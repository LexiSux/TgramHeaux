import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, desc, and, sql, or, gt, lt } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  UpsertUser,
  Listing,
  InsertListing,
  Media,
  InsertMedia,
  UpgradePurchase,
  InsertUpgradePurchase,
  FlaggedContent,
  InsertFlaggedContent,
  BitcoinPayment,
  InsertBitcoinPayment,
  AdminAction,
  InsertAdminAction,
  CommunityPost,
  InsertCommunityPost,
  CommunityReply,
  InsertCommunityReply,
  Favorite,
  Transaction,
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const client = new pg.Client({ connectionString });
await client.connect();
export const db = drizzle(client, { schema });

export interface TierLimits {
  maxListings: number;
  maxImages: number;
  bumpCooldown: number;
  availableNowCooldown: number;
  canHighlight: boolean;
  canFeatured: boolean;
  canSpecial: boolean;
  canSlideshow: boolean;
}

export function getTierLimits(tier: string): TierLimits {
  switch (tier) {
    case "free":
      return {
        maxListings: 1,
        maxImages: 2,
        bumpCooldown: 24 * 60,
        availableNowCooldown: 24 * 60,
        canHighlight: false,
        canFeatured: false,
        canSpecial: false,
        canSlideshow: false,
      };
    case "basic":
      return {
        maxListings: 3,
        maxImages: 5,
        bumpCooldown: 12 * 60,
        availableNowCooldown: 12 * 60,
        canHighlight: true,
        canFeatured: false,
        canSpecial: false,
        canSlideshow: false,
      };
    case "vip":
      return {
        maxListings: 10,
        maxImages: 15,
        bumpCooldown: 4 * 60,
        availableNowCooldown: 6 * 60,
        canHighlight: true,
        canFeatured: true,
        canSpecial: true,
        canSlideshow: false,
      };
    case "elite":
      return {
        maxListings: -1,
        maxImages: 30,
        bumpCooldown: 60,
        availableNowCooldown: 2 * 60,
        canHighlight: true,
        canFeatured: true,
        canSpecial: true,
        canSlideshow: true,
      };
    default:
      return getTierLimits("free");
  }
}

export class Storage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(schema.users)
      .values(userData)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    return db.select().from(schema.listings).where(eq(schema.listings.ownerId, userId)).orderBy(desc(schema.listings.bumpedAt));
  }

  async canCreateListing(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
    const user = await this.getUser(userId);
    if (!user) return { canCreate: false, reason: "User not found" };

    const limits = getTierLimits(user.tier);
    if (limits.maxListings === -1) return { canCreate: true };

    const listings = await this.getUserListings(userId);
    const activeListings = listings.filter(l => l.status === "active");

    if (activeListings.length >= limits.maxListings) {
      return { canCreate: false, reason: `Your ${user.tier} tier allows ${limits.maxListings} active listing(s)` };
    }

    return { canCreate: true };
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const slug = listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const result = await db.insert(schema.listings).values({ ...listing, slug }).returning();
    return result[0];
  }

  async updateListing(id: string, data: Partial<Listing>): Promise<Listing | undefined> {
    const result = await db.update(schema.listings).set({ ...data, updatedAt: new Date() }).where(eq(schema.listings.id, id)).returning();
    return result[0];
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const result = await db.select().from(schema.listings).where(eq(schema.listings.id, id)).limit(1);
    return result[0];
  }

  async getListingBySlug(slug: string): Promise<Listing | undefined> {
    const result = await db.select().from(schema.listings).where(eq(schema.listings.slug, slug)).limit(1);
    return result[0];
  }

  async getActiveListings(limit: number = 50): Promise<Listing[]> {
    return db.select().from(schema.listings)
      .where(eq(schema.listings.status, "active"))
      .orderBy(desc(schema.listings.bumpedAt))
      .limit(limit);
  }

  async getAvailableNowListings(): Promise<Listing[]> {
    const now = new Date();
    return db.select().from(schema.listings)
      .where(and(
        eq(schema.listings.status, "active"),
        eq(schema.listings.isAvailableNow, true),
        or(
          sql`${schema.listings.availableUntil} IS NULL`,
          gt(schema.listings.availableUntil, now)
        )
      ))
      .orderBy(desc(schema.listings.bumpedAt))
      .limit(20);
  }

  async canBumpListing(userId: string, listingId: string): Promise<{ canBump: boolean; reason?: string }> {
    const user = await this.getUser(userId);
    const listing = await this.getListing(listingId);

    if (!user || !listing) return { canBump: false, reason: "Not found" };
    if (listing.ownerId !== userId) return { canBump: false, reason: "Not your listing" };

    const limits = getTierLimits(user.tier);
    
    if (listing.lastBumpAt) {
      const minutesSinceLastBump = (Date.now() - listing.lastBumpAt.getTime()) / (1000 * 60);
      if (minutesSinceLastBump < limits.bumpCooldown) {
        const remainingMinutes = Math.ceil(limits.bumpCooldown - minutesSinceLastBump);
        return { canBump: false, reason: `Bump cooldown: ${remainingMinutes} minutes remaining` };
      }
    }

    return { canBump: true };
  }

  async bumpListing(listingId: string): Promise<Listing | undefined> {
    const now = new Date();
    const result = await db.update(schema.listings)
      .set({
        bumpedAt: now,
        lastBumpAt: now,
        bumpCount: sql`${schema.listings.bumpCount} + 1`,
      })
      .where(eq(schema.listings.id, listingId))
      .returning();
    return result[0];
  }

  async setAvailableNow(listingId: string, enabled: boolean): Promise<Listing | undefined> {
    const availableUntil = enabled ? new Date(Date.now() + 4 * 60 * 60 * 1000) : null;
    const result = await db.update(schema.listings)
      .set({
        isAvailableNow: enabled,
        availableUntil,
      })
      .where(eq(schema.listings.id, listingId))
      .returning();
    return result[0];
  }

  async saveMedia(media: InsertMedia): Promise<Media> {
    const existing = await db.select().from(schema.media).where(eq(schema.media.fileHash, media.fileHash)).limit(1);
    if (existing[0]) return existing[0];

    const result = await db.insert(schema.media).values(media).returning();
    return result[0];
  }

  async getMedia(id: string): Promise<Media | undefined> {
    const result = await db.select().from(schema.media).where(eq(schema.media.id, id)).limit(1);
    return result[0];
  }

  async getMediaByHash(hash: string): Promise<Media | undefined> {
    const result = await db.select().from(schema.media).where(eq(schema.media.fileHash, hash)).limit(1);
    return result[0];
  }

  async purchaseUpgrade(upgrade: InsertUpgradePurchase): Promise<UpgradePurchase> {
    const result = await db.insert(schema.upgradePurchases).values(upgrade).returning();
    return result[0];
  }

  async deductTokens(userId: string, amount: number, description: string): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user || user.loveCoins < amount) return false;

    await db.update(schema.users)
      .set({ loveCoins: sql`${schema.users.loveCoins} - ${amount}` })
      .where(eq(schema.users.id, userId));

    await db.insert(schema.transactions).values({
      userId,
      type: "debit",
      amount: -amount,
      description,
    });

    return true;
  }

  async addTokens(userId: string, amount: number, description: string): Promise<boolean> {
    await db.update(schema.users)
      .set({ loveCoins: sql`${schema.users.loveCoins} + ${amount}` })
      .where(eq(schema.users.id, userId));

    await db.insert(schema.transactions).values({
      userId,
      type: "credit",
      amount,
      description,
    });

    return true;
  }

  async flagContent(flag: InsertFlaggedContent): Promise<FlaggedContent> {
    const result = await db.insert(schema.flaggedContent).values(flag).returning();
    return result[0];
  }

  async getPendingFlags(): Promise<FlaggedContent[]> {
    return db.select().from(schema.flaggedContent)
      .where(eq(schema.flaggedContent.status, "pending"))
      .orderBy(desc(schema.flaggedContent.createdAt));
  }

  async reviewFlag(flagId: string, reviewedBy: string, action: "approved" | "rejected", notes?: string): Promise<FlaggedContent | undefined> {
    const result = await db.update(schema.flaggedContent)
      .set({
        status: action,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: notes,
      })
      .where(eq(schema.flaggedContent.id, flagId))
      .returning();
    return result[0];
  }

  async createBitcoinPayment(payment: InsertBitcoinPayment): Promise<BitcoinPayment> {
    const result = await db.insert(schema.bitcoinPayments).values(payment).returning();
    return result[0];
  }

  async getBitcoinPayment(id: string): Promise<BitcoinPayment | undefined> {
    const result = await db.select().from(schema.bitcoinPayments).where(eq(schema.bitcoinPayments.id, id)).limit(1);
    return result[0];
  }

  async logAdminAction(action: InsertAdminAction): Promise<AdminAction> {
    const result = await db.insert(schema.adminActions).values(action).returning();
    return result[0];
  }

  async getTransactionHistory(userId: string, limit: number = 50): Promise<Transaction[]> {
    return db.select().from(schema.transactions)
      .where(eq(schema.transactions.userId, userId))
      .orderBy(desc(schema.transactions.createdAt))
      .limit(limit);
  }

  async addFavorite(userId: string, listingId: string): Promise<Favorite> {
    const result = await db.insert(schema.favorites).values({ userId, listingId }).returning();
    return result[0];
  }

  async removeFavorite(userId: string, listingId: string): Promise<boolean> {
    await db.delete(schema.favorites)
      .where(and(
        eq(schema.favorites.userId, userId),
        eq(schema.favorites.listingId, listingId)
      ));
    return true;
  }

  async getUserFavorites(userId: string): Promise<Listing[]> {
    const favorites = await db.select()
      .from(schema.favorites)
      .innerJoin(schema.listings, eq(schema.favorites.listingId, schema.listings.id))
      .where(eq(schema.favorites.userId, userId))
      .orderBy(desc(schema.favorites.createdAt));
    
    return favorites.map(f => f.listings);
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const result = await db.insert(schema.communityPosts).values(post).returning();
    return result[0];
  }

  async getCommunityPosts(category?: string, limit: number = 50): Promise<CommunityPost[]> {
    if (category) {
      return db.select().from(schema.communityPosts)
        .where(eq(schema.communityPosts.category, category))
        .orderBy(desc(schema.communityPosts.createdAt))
        .limit(limit);
    }
    return db.select().from(schema.communityPosts)
      .orderBy(desc(schema.communityPosts.createdAt))
      .limit(limit);
  }

  async createCommunityReply(reply: InsertCommunityReply): Promise<CommunityReply> {
    const result = await db.insert(schema.communityReplies).values(reply).returning();
    
    await db.update(schema.communityPosts)
      .set({ replyCount: sql`${schema.communityPosts.replyCount} + 1` })
      .where(eq(schema.communityPosts.id, reply.postId));
    
    return result[0];
  }

  async getCommunityReplies(postId: string): Promise<CommunityReply[]> {
    return db.select().from(schema.communityReplies)
      .where(eq(schema.communityReplies.postId, postId))
      .orderBy(desc(schema.communityReplies.createdAt));
  }
}

export const storage = new Storage();
