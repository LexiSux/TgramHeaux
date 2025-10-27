import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TierPricingCardProps {
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
}

export default function TierPricingCard({
  name,
  price,
  duration,
  features,
  isPopular = false,
  onSelect,
}: TierPricingCardProps) {
  const tierColors = {
    Free: "from-muted to-muted",
    Basic: "from-blue-500/20 to-blue-600/20",
    VIP: "from-purple-500/20 to-purple-600/20",
    Elite: "from-amber-500/20 to-amber-600/20",
  };

  return (
    <Card
      className={`relative overflow-hidden ${isPopular ? "ring-2 ring-primary" : ""}`}
      data-testid={`card-tier-${name.toLowerCase()}`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-md bg-primary" data-testid="badge-popular">
            Most Popular
          </Badge>
        </div>
      )}

      <div className={`bg-gradient-to-br ${tierColors[name as keyof typeof tierColors]} p-6`}>
        <h3 className="text-2xl font-bold mb-2" data-testid="text-tier-name">{name}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold" data-testid="text-tier-price">{price}</span>
          <span className="text-lg text-muted-foreground">Love Coins</span>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-tier-duration">{duration}</p>
      </div>

      <div className="p-6 space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm" data-testid={`text-feature-${index}`}>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          onClick={() => {
            onSelect?.();
            console.log("Tier selected:", name);
          }}
          data-testid="button-select-tier"
        >
          {price === 0 ? "Get Started" : "Upgrade Now"}
        </Button>
      </div>
    </Card>
  );
}
