import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface CommunityPostProps {
  author: string;
  authorAvatar?: string;
  timeAgo: string;
  title: string;
  content: string;
  category: string;
  replies: number;
  likes: number;
}

export default function CommunityPost({
  author,
  authorAvatar,
  timeAgo,
  title,
  content,
  category,
  replies,
  likes,
}: CommunityPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    console.log("Post liked");
  };

  return (
    <Card className="p-4 hover-elevate" data-testid="card-community-post">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={authorAvatar} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold" data-testid="text-author">{author}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground" data-testid="text-time">{timeAgo}</span>
            <span className="text-sm text-primary" data-testid="text-category">{category}</span>
          </div>

          <h3 className="font-semibold mb-2" data-testid="text-post-title">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-post-content">{content}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover-elevate"
              data-testid="button-reply"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{replies}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover-elevate ${isLiked ? "text-rose-500" : ""}`}
              onClick={handleLike}
              data-testid="button-like"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover-elevate"
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
