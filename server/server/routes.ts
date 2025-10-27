import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertListingSchema, insertCommunityPostSchema, insertCommunityReplySchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

const MemStore = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "love-directory-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      store: new MemStore({
        checkPeriod: 86400000, // 24 hours
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  // Auth middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Listing routes
  app.get("/api/listings", async (req: Request, res: Response) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        city: req.query.city as string | undefined,
        state: req.query.state as string | undefined,
        isAvailableNow: req.query.availableNow === "true" ? true : undefined,
        isSpecial: req.query.specials === "true" ? true : undefined,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      };
      
      const listings = await storage.getAllListings(filters);
      res.json({ listings });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/listings/:id", async (req: Request, res: Response) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ listing });
  });

  app.post("/api/listings", requireAuth, async (req: Request, res: Response) => {
    try {
      const data = insertListingSchema.parse({
        ...req.body,
        ownerId: req.session.userId,
      });
      
      const listing = await storage.createListing(data);
      res.json({ listing });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.put("/api/listings/:id", requireAuth, async (req: Request, res: Response) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.ownerId !== req.session.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await storage.updateListing(req.params.id, req.body);
    res.json({ listing: updated });
  });

  app.delete("/api/listings/:id", requireAuth, async (req: Request, res: Response) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.ownerId !== req.session.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await storage.deleteListing(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/listings/:id/bump", requireAuth, async (req: Request, res: Response) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.ownerId !== req.session.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // TODO: Check bump cooldown based on tier
    const updated = await storage.bumpListing(req.params.id);
    res.json({ listing: updated });
  });

  app.post("/api/listings/:id/available-now", requireAuth, async (req: Request, res: Response) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.ownerId !== req.session.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // TODO: Check available now cooldown based on tier
    const availableUntil = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
    const updated = await storage.updateListing(req.params.id, {
      isAvailableNow: true,
      availableUntil,
    });
    res.json({ listing: updated });
  });

  app.get("/api/my-listings", requireAuth, async (req: Request, res: Response) => {
    const listings = await storage.getListingsByOwner(req.session.userId!);
    res.json({ listings });
  });

  // Love Coins & Tier routes
  app.post("/api/coins/purchase", requireAuth, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      if (!amount || amount < 1) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      // TODO: Mock purchase - in production would integrate with NOWPayments
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updated = await storage.updateUser(req.session.userId!, {
        loveCoins: user.loveCoins + amount,
      });

      await storage.createTransaction(
        req.session.userId!,
        "purchase",
        amount,
        `Purchased ${amount} Love Coins`
      );

      const { password, ...userWithoutPassword } = updated!;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/tier/upgrade", requireAuth, async (req: Request, res: Response) => {
    try {
      const { tier } = req.body;
      const tierPrices = {
        free: 0,
        basic: 49,
        vip: 99,
        elite: 199,
      };

      if (!tierPrices[tier as keyof typeof tierPrices]) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const price = tierPrices[tier as keyof typeof tierPrices];
      if (user.loveCoins < price) {
        return res.status(400).json({ error: "Insufficient Love Coins" });
      }

      const tierExpires = new Date();
      tierExpires.setDate(tierExpires.getDate() + 30);

      const updated = await storage.updateUser(req.session.userId!, {
        tier,
        tierExpires,
        loveCoins: user.loveCoins - price,
      });

      await storage.createTransaction(
        req.session.userId!,
        "tier_upgrade",
        -price,
        `Upgraded to ${tier} tier`
      );

      const { password, ...userWithoutPassword } = updated!;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Community routes
  app.get("/api/community/posts", async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const posts = await storage.getAllCommunityPosts(category);
    
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await storage.getUser(post.authorId);
        return {
          ...post,
          author: author ? { displayName: author.displayName, id: author.id } : null,
        };
      })
    );
    
    res.json({ posts: postsWithAuthors });
  });

  app.post("/api/community/posts", requireAuth, async (req: Request, res: Response) => {
    try {
      const data = insertCommunityPostSchema.parse({
        ...req.body,
        authorId: req.session.userId,
      });
      
      const post = await storage.createCommunityPost(data);
      res.json({ post });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.get("/api/community/posts/:id/replies", async (req: Request, res: Response) => {
    const replies = await storage.getCommunityRepliesByPost(req.params.id);
    
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => {
        const author = await storage.getUser(reply.authorId);
        return {
          ...reply,
          author: author ? { displayName: author.displayName, id: author.id } : null,
        };
      })
    );
    
    res.json({ replies: repliesWithAuthors });
  });

  app.post("/api/community/posts/:id/replies", requireAuth, async (req: Request, res: Response) => {
    try {
      const data = insertCommunityReplySchema.parse({
        ...req.body,
        postId: req.params.id,
        authorId: req.session.userId,
      });
      
      const reply = await storage.createCommunityReply(data);
      res.json({ reply });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.post("/api/community/posts/:id/like", requireAuth, async (req: Request, res: Response) => {
    const post = await storage.getCommunityPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updated = await storage.updateCommunityPost(req.params.id, {
      likeCount: post.likeCount + 1,
    });
    res.json({ post: updated });
  });

  // Favorites routes
  app.get("/api/favorites", requireAuth, async (req: Request, res: Response) => {
    const favorites = await storage.getFavoritesByUser(req.session.userId!);
    res.json({ favorites });
  });

  app.post("/api/favorites/:listingId", requireAuth, async (req: Request, res: Response) => {
    const favorite = await storage.addFavorite(req.session.userId!, req.params.listingId);
    res.json({ favorite });
  });

  app.delete("/api/favorites/:listingId", requireAuth, async (req: Request, res: Response) => {
    await storage.removeFavorite(req.session.userId!, req.params.listingId);
    res.json({ success: true });
  });

  // Transactions routes
  app.get("/api/transactions", requireAuth, async (req: Request, res: Response) => {
    const transactions = await storage.getTransactionsByUser(req.session.userId!);
    res.json({ transactions });
  });

  const httpServer = createServer(app);

  return httpServer;
}
