import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TierPricingCard from "@/components/TierPricingCard";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Membership Tier</h1>
          <p className="text-xl text-muted-foreground mb-2">
            30-day subscriptions • No auto-renewal • Cancel anytime
          </p>
          <p className="text-sm text-muted-foreground">
            All prices in Love Coins (1 Coin = $1 USD)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <TierPricingCard
            name="Free"
            price={0}
            duration="Always free"
            features={[
              "2 active listings",
              "8 photos per listing",
              "1 YouTube video",
              "Bump every 4 hours",
              "Available Now every 6 hrs (4 hr duration)",
              "Basic profile customization",
            ]}
          />
          <TierPricingCard
            name="Basic"
            price={49}
            duration="30 days"
            features={[
              "3 active listings",
              "16 photos per listing",
              "2 videos",
              "Bump every 2 hours",
              "Available Now anytime",
              "Basic badge on profile",
              "Appears in Paid Listings filter",
            ]}
          />
          <TierPricingCard
            name="VIP"
            price={99}
            duration="30 days"
            isPopular={true}
            features={[
              "4 active listings",
              "32 photos per listing",
              "4 videos",
              "Bump every 1 hour",
              "Available Now anytime",
              "VIP badge on profile",
              "10% discount on upgrades",
              "Priority support",
            ]}
          />
          <TierPricingCard
            name="Elite"
            price={199}
            duration="30 days"
            features={[
              "5 active listings",
              "40 photos per listing",
              "8 videos",
              "Bump every 30 minutes",
              "Available Now anytime",
              "Elite badge on profile",
              "15% discount on upgrades",
              "Priority support & verification",
            ]}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Available Upgrades</h2>
          <p className="text-center text-muted-foreground mb-8">
            Enhance your listings with these premium upgrades (purchased with Love Coins)
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Highlight Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stand out with colored background and highlight badge
              </p>
              <p className="text-2xl font-bold text-primary mb-3">From 10 coins/day</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Increased visibility</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Color-coded border</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Specials Tag</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add limited-time offers and special promotions
              </p>
              <p className="text-2xl font-bold text-primary mb-3">15 coins/week</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Prominent "Specials" badge</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Appears in Specials filter</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Image Slideshow</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Rotating 4-5 image gallery on grid cards
              </p>
              <p className="text-2xl font-bold text-primary mb-3">20 coins/month</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Auto-rotating photos</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Catches more attention</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Bump Anytime</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Instant bump that bypasses cooldown timer
              </p>
              <p className="text-2xl font-bold text-primary mb-3">5 coins each</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Immediate top placement</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Buy in packs for discounts</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Homepage Featured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Premium placement on homepage (limited spots)
              </p>
              <p className="text-2xl font-bold text-primary mb-3">50 coins/week</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Maximum exposure</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Rotation among top spots</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Category Banners</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Large banner at top or bottom of category pages
              </p>
              <p className="text-2xl font-bold text-primary mb-3">From 75 coins/week</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Prominent banner placement</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Targeted by city & category</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
