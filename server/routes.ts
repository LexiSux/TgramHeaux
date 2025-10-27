import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { saveFile, hashFile, getTierMediaLimits } from "./media";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import { insertListingSchema, insertFlaggedContentSchema, insertCommunityPostSchema, insertCommunityReplySchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

interface AuthRequest extends Request {
  user?: any;
}

function requireRole(roles: string[]) {
  return async (req: AuthRequest, res: any, next: any) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/listings", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertListingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const canCreate = await storage.canCreateListing(userId);
      if (!canCreate.canCreate) {
        return res.status(403).json({ error: canCreate.reason });
      }

      const listing = await storage.createListing({
        ...validation.data,
        ownerId: userId,
      });
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.get("/api/listings", async (req, res) => {
    try {
      const listings = await storage.getActiveListings(100);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/available-now", async (req, res) => {
    try {
      const listings = await storage.getAvailableNowListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available now listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      await storage.updateListing(req.params.id, {
        viewCount: listing.viewCount + 1,
      });

      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  app.get("/api/listings/slug/:slug", async (req, res) => {
    try {
      const listing = await storage.getListingBySlug(req.params.slug);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      await storage.updateListing(listing.id, {
        viewCount: listing.viewCount + 1,
      });

      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  app.patch("/api/listings/:id", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const listing = await storage.getListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (listing.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await storage.updateListing(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update listing" });
    }
  });

  app.get("/api/my-listings", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const listings = await storage.getUserListings(userId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  app.post("/api/listings/:id/bump", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const canBump = await storage.canBumpListing(userId, req.params.id);
      if (!canBump.canBump) {
        return res.status(403).json({ error: canBump.reason });
      }

      const user = await storage.getUser(userId);
      const bumpCost = user?.tier === "free" ? 10 : user?.tier === "basic" ? 5 : 0;

      if (bumpCost > 0) {
        const success = await storage.deductTokens(userId, bumpCost, `Bump listing ${req.params.id}`);
        if (!success) {
          return res.status(402).json({ error: "Insufficient Love Coins" });
        }
      }

      const listing = await storage.bumpListing(req.params.id);
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to bump listing" });
    }
  });

  app.post("/api/listings/:id/available-now", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const { enabled } = req.body;
      const listing = await storage.getListing(req.params.id);
      
      if (!listing || listing.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const cost = 20;
      if (enabled) {
        const success = await storage.deductTokens(userId, cost, `Available Now for listing ${req.params.id}`);
        if (!success) {
          return res.status(402).json({ error: "Insufficient Love Coins" });
        }
      }

      const updated = await storage.setAvailableNow(req.params.id, enabled);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update available now status" });
    }
  });

  app.post("/api/media/upload", isAuthenticated, upload.array("files", 30), async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const limits = getTierMediaLimits(user.tier);
      if (files.length > limits.maxImages) {
        return res.status(403).json({ error: `Your tier allows maximum ${limits.maxImages} images` });
      }

      const uploadedMedia = [];
      for (const file of files) {
        const fileHash = await hashFile(file.buffer);
        const existing = await storage.getMediaByHash(fileHash);

        if (existing) {
          uploadedMedia.push(existing);
        } else {
          const savedFile = await saveFile(file.buffer, file.originalname, file.mimetype);
          const media = await storage.saveMedia({
            uploaderId: userId,
            fileHash: savedFile.hash,
            fileName: savedFile.fileName,
            fileSize: savedFile.fileSize,
            mimeType: savedFile.mimeType,
            cdnUrl: savedFile.cdnUrl,
            localPath: savedFile.localPath,
          });
          uploadedMedia.push(media);
        }
      }

      res.json(uploadedMedia);
    } catch (error) {
      console.error("Media upload error:", error);
      res.status(500).json({ error: "Failed to upload media" });
    }
  });

  app.post("/api/upgrades/purchase", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const { upgradeType, listingId, duration } = req.body;

      const costs: Record<string, number> = {
        highlight: 50,
        special: 75,
        slideshow: 100,
        paid_listing: 150,
      };

      const cost = costs[upgradeType];
      if (!cost) {
        return res.status(400).json({ error: "Invalid upgrade type" });
      }

      const success = await storage.deductTokens(userId, cost, `${upgradeType} upgrade`);
      if (!success) {
        return res.status(402).json({ error: "Insufficient Love Coins" });
      }

      const expiresAt = new Date(Date.now() + (duration || 7) * 24 * 60 * 60 * 1000);
      const purchase = await storage.purchaseUpgrade({
        userId,
        listingId,
        upgradeType,
        tokensSpent: cost,
        expiresAt,
      });

      if (listingId) {
        const updates: Record<string, any> = {};
        if (upgradeType === "highlight") {
          updates.isHighlighted = true;
          updates.highlightUntil = expiresAt;
        } else if (upgradeType === "special") {
          updates.isSpecial = true;
          updates.specialUntil = expiresAt;
        } else if (upgradeType === "slideshow") {
          updates.hasSlideshow = true;
          updates.slideshowUntil = expiresAt;
        } else if (upgradeType === "paid_listing") {
          updates.isPaidListing = true;
          updates.paidListingUntil = expiresAt;
        }
        await storage.updateListing(listingId, updates);
      }

      res.json(purchase);
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase upgrade" });
    }
  });

  app.post("/api/payments/bitcoin/create", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tokensAmount } = req.body;
      if (!tokensAmount || tokensAmount < 100) {
        return res.status(400).json({ error: "Minimum purchase is 100 Love Coins" });
      }

      const btcAmount = tokensAmount * 0.00001;
      const mockAddress = `bc1q${Math.random().toString(36).substring(2, 15)}`;
      const qrCodeData = `bitcoin:${mockAddress}?amount=${btcAmount}`;

      const payment = await storage.createBitcoinPayment({
        userId,
        paymentAddress: mockAddress,
        amount: Math.floor(btcAmount * 100000000),
        tokensAmount,
        qrCodeData,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  app.get("/api/payments/bitcoin/:id", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const payment = await storage.getBitcoinPayment(req.params.id);
      if (!payment || payment.userId !== userId) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  app.post("/api/payments/bitcoin/:id/complete", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const payment = await storage.getBitcoinPayment(req.params.id);
      if (!payment || payment.userId !== userId) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await storage.addTokens(userId, payment.tokensAmount, `Bitcoin payment ${req.params.id}`);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to complete payment" });
    }
  });

  app.get("/api/transactions", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactionHistory(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/favorites/:listingId", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorite = await storage.addFavorite(userId, req.params.listingId);
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:listingId", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.removeFavorite(userId, req.params.listingId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/flag-content", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertFlaggedContentSchema.safeParse({
        ...req.body,
        reporterId: userId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const flag = await storage.flagContent(validation.data);
      res.json(flag);
    } catch (error) {
      res.status(500).json({ error: "Failed to flag content" });
    }
  });

  app.get("/api/admin/flags", isAuthenticated, requireRole(["admin"]), async (req: AuthRequest, res) => {
    try {
      const flags = await storage.getPendingFlags();
      res.json(flags);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flags" });
    }
  });

  app.post("/api/admin/flags/:id/review", isAuthenticated, requireRole(["admin"]), async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const { action, notes } = req.body;
      const flag = await storage.reviewFlag(req.params.id, userId, action, notes);

      await storage.logAdminAction({
        adminId: userId,
        actionType: "review_flag",
        targetType: "flagged_content",
        targetId: req.params.id,
        details: `Action: ${action}, Notes: ${notes}`,
      });

      res.json(flag);
    } catch (error) {
      res.status(500).json({ error: "Failed to review flag" });
    }
  });

  app.post("/api/community/posts", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertCommunityPostSchema.safeParse({
        ...req.body,
        authorId: userId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const post = await storage.createCommunityPost(validation.data);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.get("/api/community/posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const posts = await storage.getCommunityPosts(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/community/posts/:postId/replies", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertCommunityReplySchema.safeParse({
        ...req.body,
        postId: req.params.postId,
        authorId: userId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const reply = await storage.createCommunityReply(validation.data);
      res.json(reply);
    } catch (error) {
      res.status(500).json({ error: "Failed to create reply" });
    }
  });

  app.get("/api/community/posts/:postId/replies", async (req, res) => {
    try {
      const replies = await storage.getCommunityReplies(req.params.postId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
