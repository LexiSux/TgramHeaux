import ListingCard from "../ListingCard";
import placeholderImg from "@assets/generated_images/Profile_placeholder_image_63834e8a.png";

export default function ListingCardExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Listing Cards</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ListingCard
            id="1"
            title="Sophia Martinez"
            city="Los Angeles, CA"
            tagline="Professional companion & model"
            priceTokens={150}
            imageUrl={placeholderImg}
            tier="elite"
            isVerified={true}
            isAvailableNow={true}
            onClick={() => console.log("Card clicked")}
          />
          <ListingCard
            id="2"
            title="Isabella Chen"
            city="Miami, FL"
            tagline="Upscale entertainer"
            priceTokens={120}
            imageUrl={placeholderImg}
            tier="vip"
            isVerified={true}
            isSpecial={true}
            onClick={() => console.log("Card clicked")}
          />
          <ListingCard
            id="3"
            title="Emma Johnson"
            city="New York, NY"
            tagline="Elite companion"
            imageUrl={placeholderImg}
            tier="basic"
            isHighlighted={true}
            onClick={() => console.log("Card clicked")}
          />
          <ListingCard
            id="4"
            title="Ava Williams"
            city="Chicago, IL"
            tagline="Professional massage therapist"
            priceTokens={80}
            imageUrl={placeholderImg}
            tier="free"
            onClick={() => console.log("Card clicked")}
          />
          <ListingCard
            id="5"
            title="Mia Rodriguez"
            city="Las Vegas, NV"
            tagline="Content creator & dancer"
            priceTokens={100}
            imageUrl={placeholderImg}
            tier="vip"
            isVerified={true}
            isAvailableNow={true}
            onClick={() => console.log("Card clicked")}
          />
        </div>
      </div>
    </div>
  );
}
