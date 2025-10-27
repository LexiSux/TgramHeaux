import TierPricingCard from "../TierPricingCard";

export default function TierPricingCardExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Choose Your Tier</h2>
        <p className="text-center text-muted-foreground mb-12">30-day subscription with no auto-renewal</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TierPricingCard
            name="Free"
            price={0}
            duration="Always free"
            features={[
              "2 active listings",
              "8 photos per listing",
              "1 YouTube video",
              "Bump every 4 hours",
              "Available Now every 6 hrs",
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
              "Basic badge",
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
              "VIP badge",
              "10% upgrade discount",
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
              "Bump every 30 mins",
              "Available Now anytime",
              "Elite badge",
              "15% upgrade discount",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
