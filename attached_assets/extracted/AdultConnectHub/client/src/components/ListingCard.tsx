import { Heart, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export type TierType = "free" | "basic" | "vip" | "elite";

interface ListingCardProps {
  id: string;
  title: string;
  city: string;
  tagline: string;
  priceTokens?: number;
  imageUrl: string;
  tier: TierType;
  isVerified?: boolean;
  isAvailableNow?: boolean;
  isHighlighted?: boolean;
  isSpecial?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
}

const tierColors = {
  free: "",
  basic: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  vip: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  elite: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const tierLabels = {
  free: "",
  basic: "BASIC",
  vip: "VIP",
  elite: "ELITE",
};

export default function ListingCard({
  title,
  city,
  tagline,
  priceTokens,
  imageUrl,
  tier,
  isVerified = false,
  isAvailableNow = false,
  isHighlighted = false,
  isSpecial = false,
  onFavorite,
  onClick,
}: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.();
    console.log("Favorite toggled");
  };

  return (
    <Card
      className={`group overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all duration-200 ${
        isHighlighted ? "ring-2 ring-primary/50" : ""
      }`}
      onClick={onClick}
      data-testid={`card-listing-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          data-testid="img-listing"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isAvailableNow && (
            <Badge className="bg-chart-3 text-black border-0 text-xs font-semibold px-2 py-0.5" data-testid="badge-available-now">
              <Clock className="w-3 h-3 mr-1" />
              Available Now
            </Badge>
          )}
          {tier !== "free" && (
            <Badge className={`${tierColors[tier]} text-xs font-semibold px-2 py-0.5 border`} data-testid={`badge-tier-${tier}`}>
              {tierLabels[tier]}
            </Badge>
          )}
          {isSpecial && (
            <Badge className="bg-rose-500/90 text-white border-0 text-xs font-semibold px-2 py-0.5" data-testid="badge-special">
              Specials
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          {isVerified && (
            <div className="bg-green-500/20 backdrop-blur-sm rounded-full p-1" data-testid="icon-verified">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 ${
              isFavorited ? "text-rose-500" : "text-white"
            }`}
            onClick={handleFavorite}
            data-testid="button-favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1" data-testid="text-title">
            {title}
          </h3>
          <div className="flex items-center text-white/80 text-xs mb-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span data-testid="text-city">{city}</span>
          </div>
          <p className="text-white/70 text-xs line-clamp-1 mb-2" data-testid="text-tagline">{tagline}</p>
          {priceTokens && (
            <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs font-semibold" data-testid="text-price">
              {priceTokens} Love Coins
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
