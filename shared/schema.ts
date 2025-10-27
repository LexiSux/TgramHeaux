import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("classified"),
  loveCoins: integer("love_coins").notNull().default(0),
  tier: text("tier").notNull().default("free"),
  tierExpires: timestamp("tier_expires"),
  isVerified: boolean("is_verified").notNull().default(false),
  isSuspended: boolean("is_suspended").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("USA"),
  priceTokens: integer("price_tokens"),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("active"),
  isAvailableNow: boolean("is_available_now").notNull().default(false),
  availableUntil: timestamp("available_until"),
  bumpedAt: timestamp("bumped_at").notNull().default(sql`now()`),
  bumpCount: integer("bump_count").notNull().default(0),
  lastBumpAt: timestamp("last_bump_at"),
  isHighlighted: boolean("is_highlighted").notNull().default(false),
  highlightUntil: timestamp("highlight_until"),
  isFeatured: boolean("is_featured").notNull().default(false),
  featuredUntil: timestamp("featured_until"),
  isSpecial: boolean("is_special").notNull().default(false),
  specialUntil: timestamp("special_until"),
  hasSlideshow: boolean("has_slideshow").notNull().default(false),
  slideshowUntil: timestamp("slideshow_until"),
  isPaidListing: boolean("is_paid_listing").notNull().default(false),
  paidListingUntil: timestamp("paid_listing_until"),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uploaderId: varchar("uploader_id").notNull(),
  fileHash: text("file_hash").notNull().unique(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  cdnUrl: text("cdn_url").notNull(),
  localPath: text("local_path"),
  width: integer("width"),
  height: integer("height"),
  uploadedAt: timestamp("uploaded_at").notNull().default(sql`now()`),
});

export const upgradePurchases = pgTable("upgrade_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  listingId: varchar("listing_id"),
  upgradeType: text("upgrade_type").notNull(),
  tokensSpent: integer("tokens_spent").notNull(),
  expiresAt: timestamp("expires_at"),
  purchasedAt: timestamp("purchased_at").notNull().default(sql`now()`),
});

export const flaggedContent = pgTable("flagged_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: text("content_type").notNull(),
  contentId: varchar("content_id").notNull(),
  reporterId: varchar("reporter_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const bitcoinPayments = pgTable("bitcoin_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  paymentAddress: text("payment_address").notNull(),
  amount: integer("amount").notNull(),
  tokensAmount: integer("tokens_amount").notNull(),
  status: text("status").notNull().default("pending"),
  qrCodeData: text("qr_code_data"),
  expiresAt: timestamp("expires_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const adminActions = pgTable("admin_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull(),
  actionType: text("action_type").notNull(),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  replyCount: integer("reply_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const communityReplies = pgTable("community_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  listingId: varchar("listing_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  loveCoins: true,
  tier: true,
  tierExpires: true,
  isVerified: true,
  isSuspended: true,
  createdAt: true,
  role: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  slug: true,
  bumpedAt: true,
  bumpCount: true,
  lastBumpAt: true,
  isHighlighted: true,
  highlightUntil: true,
  isFeatured: true,
  featuredUntil: true,
  isSpecial: true,
  specialUntil: true,
  hasSlideshow: true,
  slideshowUntil: true,
  isPaidListing: true,
  paidListingUntil: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  uploadedAt: true,
});

export const insertUpgradePurchaseSchema = createInsertSchema(upgradePurchases).omit({
  id: true,
  purchasedAt: true,
});

export const insertFlaggedContentSchema = createInsertSchema(flaggedContent).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewNotes: true,
  createdAt: true,
});

export const insertBitcoinPaymentSchema = createInsertSchema(bitcoinPayments).omit({
  id: true,
  status: true,
  completedAt: true,
  createdAt: true,
});

export const insertAdminActionSchema = createInsertSchema(adminActions).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  likeCount: true,
  replyCount: true,
  createdAt: true,
});

export const insertCommunityReplySchema = createInsertSchema(communityReplies).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;
export type InsertUpgradePurchase = z.infer<typeof insertUpgradePurchaseSchema>;
export type UpgradePurchase = typeof upgradePurchases.$inferSelect;
export type InsertFlaggedContent = z.infer<typeof insertFlaggedContentSchema>;
export type FlaggedContent = typeof flaggedContent.$inferSelect;
export type InsertBitcoinPayment = z.infer<typeof insertBitcoinPaymentSchema>;
export type BitcoinPayment = typeof bitcoinPayments.$inferSelect;
export type InsertAdminAction = z.infer<typeof insertAdminActionSchema>;
export type AdminAction = typeof adminActions.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityReply = z.infer<typeof insertCommunityReplySchema>;
export type CommunityReply = typeof communityReplies.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
