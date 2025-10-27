import {
  type User,
  type InsertUser,
  type Listing,
  type InsertListing,
  type CommunityPost,
  type InsertCommunityPost,
  type CommunityReply,
  type InsertCommunityReply,
  type Favorite,
  type Transaction,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getListing(id: string): Promise<Listing | undefined>;
  getListingsByOwner(ownerId: string): Promise<Listing[]>;
  getAllListings(filters?: {
    category?: string;
    city?: string;
    state?: string;
    isAvailableNow?: boolean;
    tier?: string;
    isSpecial?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, updates: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<boolean>;
  bumpListing(id: string): Promise<Listing | undefined>;
  
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  getAllCommunityPosts(category?: string): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined>;
  
  getCommunityRepliesByPost(postId: string): Promise<CommunityReply[]>;
  createCommunityReply(reply: InsertCommunityReply): Promise<CommunityReply>;
  
  getFavoritesByUser(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, listingId: string): Promise<Favorite>;
  removeFavorite(userId: string, listingId: string): Promise<boolean>;
  
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(userId: string, type: string, amount: number, description: string): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private listings: Map<string, Listing>;
  private communityPosts: Map<string, CommunityPost>;
  private communityReplies: Map<string, CommunityReply>;
  private favorites: Map<string, Favorite>;
  private transactions: Map<string, Transaction>;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.communityPosts = new Map();
    this.communityReplies = new Map();
    this.favorites = new Map();
    this.transactions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      loveCoins: 0,
      tier: "free",
      tierExpires: null,
      isVerified: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getListing(id: string): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getListingsByOwner(ownerId: string): Promise<Listing[]> {
    return Array.from(this.listings.values())
      .filter((listing) => listing.ownerId === ownerId)
      .sort((a, b) => b.bumpedAt.getTime() - a.bumpedAt.getTime());
  }

  async getAllListings(filters?: {
    category?: string;
    city?: string;
    state?: string;
    isAvailableNow?: boolean;
    tier?: string;
    isSpecial?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]> {
    let listings = Array.from(this.listings.values()).filter(
      (listing) => listing.status === "active"
    );

    if (filters) {
      if (filters.category) {
        listings = listings.filter((l) => l.category === filters.category);
      }
      if (filters.city) {
        listings = listings.filter((l) => l.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      if (filters.state) {
        listings = listings.filter((l) => l.state === filters.state);
      }
      if (filters.isAvailableNow !== undefined) {
        listings = listings.filter((l) => l.isAvailableNow === filters.isAvailableNow);
      }
      if (filters.isSpecial !== undefined) {
        listings = listings.filter((l) => l.isSpecial === filters.isSpecial);
      }
      if (filters.minPrice !== undefined) {
        listings = listings.filter((l) => l.priceTokens && l.priceTokens >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        listings = listings.filter((l) => l.priceTokens && l.priceTokens <= filters.maxPrice!);
      }
    }

    return listings.sort((a, b) => b.bumpedAt.getTime() - a.bumpedAt.getTime());
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const id = randomUUID();
    const slug = `${insertListing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(0, 8)}`;
    const now = new Date();
    
    const listing: Listing = {
      id,
      ownerId: insertListing.ownerId,
      title: insertListing.title,
      slug,
      tagline: insertListing.tagline,
      description: insertListing.description,
      category: insertListing.category,
      subcategory: insertListing.subcategory || null,
      city: insertListing.city,
      state: insertListing.state,
      country: insertListing.country || "USA",
      priceTokens: insertListing.priceTokens || null,
      images: insertListing.images || [],
      status: insertListing.status || "active",
      isAvailableNow: insertListing.isAvailableNow || false,
      availableUntil: insertListing.availableUntil || null,
      bumpedAt: now,
      bumpCount: 0,
      lastBumpAt: null,
      isHighlighted: false,
      highlightUntil: null,
      isFeatured: false,
      featuredUntil: null,
      isSpecial: false,
      specialUntil: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.listings.set(id, listing);
    return listing;
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | undefined> {
    const listing = this.listings.get(id);
    if (!listing) return undefined;
    
    const updated: Listing = {
      ...listing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.listings.set(id, updated);
    return updated;
  }

  async deleteListing(id: string): Promise<boolean> {
    return this.listings.delete(id);
  }

  async bumpListing(id: string): Promise<Listing | undefined> {
    const listing = this.listings.get(id);
    if (!listing) return undefined;
    
    const now = new Date();
    const updated: Listing = {
      ...listing,
      bumpedAt: now,
      lastBumpAt: now,
      bumpCount: listing.bumpCount + 1,
      updatedAt: now,
    };
    
    this.listings.set(id, updated);
    return updated;
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async getAllCommunityPosts(category?: string): Promise<CommunityPost[]> {
    let posts = Array.from(this.communityPosts.values());
    
    if (category && category !== "all") {
      posts = posts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
    }
    
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = {
      ...insertPost,
      id,
      likeCount: 0,
      replyCount: 0,
      createdAt: new Date(),
    };
    
    this.communityPosts.set(id, post);
    return post;
  }

  async updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(id);
    if (!post) return undefined;
    
    const updated = { ...post, ...updates };
    this.communityPosts.set(id, updated);
    return updated;
  }

  async getCommunityRepliesByPost(postId: string): Promise<CommunityReply[]> {
    return Array.from(this.communityReplies.values())
      .filter((reply) => reply.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createCommunityReply(insertReply: InsertCommunityReply): Promise<CommunityReply> {
    const id = randomUUID();
    const reply: CommunityReply = {
      ...insertReply,
      id,
      createdAt: new Date(),
    };
    
    this.communityReplies.set(id, reply);
    
    const post = await this.getCommunityPost(insertReply.postId);
    if (post) {
      await this.updateCommunityPost(insertReply.postId, {
        replyCount: post.replyCount + 1,
      });
    }
    
    return reply;
  }

  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter((fav) => fav.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addFavorite(userId: string, listingId: string): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = {
      id,
      userId,
      listingId,
      createdAt: new Date(),
    };
    
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, listingId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      (fav) => fav.userId === userId && fav.listingId === listingId
    );
    
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(
    userId: string,
    type: string,
    amount: number,
    description: string
  ): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      id,
      userId,
      type,
      amount,
      description,
      createdAt: new Date(),
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
