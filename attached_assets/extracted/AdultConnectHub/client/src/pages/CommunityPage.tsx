import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunityPost from "@/components/CommunityPost";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityPage() {
  const posts = [
    {
      author: "Jessica_LA",
      timeAgo: "2 hours ago",
      title: "Tips for new entertainers starting out",
      content: "Just wanted to share some advice for anyone new to the industry. Building trust and maintaining professionalism is key to success. Always verify clients, set clear boundaries, and never compromise on safety...",
      category: "Discussion",
      replies: 24,
      likes: 156,
    },
    {
      author: "MikeNYC",
      timeAgo: "5 hours ago",
      title: "Best photography tips for your profile",
      content: "Lighting is everything! Here's what I learned about taking professional photos that get noticed. Natural light is your best friend, and investing in a ring light made a huge difference for me...",
      category: "Tips & Tricks",
      replies: 18,
      likes: 89,
    },
    {
      author: "SarahMiami",
      timeAgo: "1 day ago",
      title: "Safety protocols everyone should follow",
      content: "Your safety should always come first. Here are the protocols I use for every appointment: always screen clients, share your location with a trusted friend, have a check-in system...",
      category: "Safety",
      replies: 42,
      likes: 267,
    },
    {
      author: "Alex_SF",
      timeAgo: "1 day ago",
      title: "How to maximize your Love Coins effectively",
      content: "I've been experimenting with different upgrade strategies and wanted to share what's worked best for me. The Available Now feature has been a game-changer...",
      category: "Tips & Tricks",
      replies: 31,
      likes: 142,
    },
    {
      author: "Emma_Vegas",
      timeAgo: "2 days ago",
      title: "Building your personal brand",
      content: "Branding isn't just for big companies - it's crucial for entertainers too. Here's how I developed my unique style and positioning that attracts my ideal clients...",
      category: "Discussion",
      replies: 19,
      likes: 98,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">Connect, share, and learn from other members</p>
          </div>
          <Button className="gap-2" data-testid="button-new-post">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">All Posts</TabsTrigger>
            <TabsTrigger value="discussion" data-testid="tab-discussion">Discussion</TabsTrigger>
            <TabsTrigger value="tips" data-testid="tab-tips">Tips & Tricks</TabsTrigger>
            <TabsTrigger value="safety" data-testid="tab-safety">Safety</TabsTrigger>
            <TabsTrigger value="success" data-testid="tab-success">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.map((post, index) => (
                <CommunityPost key={index} {...post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.filter(p => p.category === "Discussion").map((post, index) => (
                <CommunityPost key={index} {...post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.filter(p => p.category === "Tips & Tricks").map((post, index) => (
                <CommunityPost key={index} {...post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="safety" className="mt-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.filter(p => p.category === "Safety").map((post, index) => (
                <CommunityPost key={index} {...post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="success" className="mt-6">
            <div className="max-w-3xl mx-auto text-center py-12">
              <p className="text-muted-foreground">No posts in this category yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
