import CommunityPost from "../CommunityPost";

export default function CommunityPostExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Community Posts</h2>
        <div className="space-y-4">
          <CommunityPost
            author="Jessica_LA"
            timeAgo="2 hours ago"
            title="Tips for new entertainers starting out"
            content="Just wanted to share some advice for anyone new to the industry. Building trust and maintaining professionalism is key..."
            category="Discussion"
            replies={24}
            likes={156}
          />
          <CommunityPost
            author="MikeNYC"
            timeAgo="5 hours ago"
            title="Best photography tips for your profile"
            content="Lighting is everything! Here's what I learned about taking professional photos that get noticed..."
            category="Tips & Tricks"
            replies={18}
            likes={89}
          />
          <CommunityPost
            author="SarahMiami"
            timeAgo="1 day ago"
            title="Safety protocols everyone should follow"
            content="Your safety should always come first. Here are the protocols I use for every appointment..."
            category="Safety"
            replies={42}
            likes={267}
          />
        </div>
      </div>
    </div>
  );
}
