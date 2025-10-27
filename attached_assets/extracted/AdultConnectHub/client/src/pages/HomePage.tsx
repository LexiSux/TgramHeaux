import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Hand, Video, Users, MessageCircle, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholderImg from "@assets/generated_images/Profile_placeholder_image_63834e8a.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
              <p className="text-muted-foreground">Discover entertainers and personals by category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <CategoryCard name="Escorts" count={1234} icon={Heart} />
            <CategoryCard name="BDSM & Fetish" count={567} icon={Sparkles} />
            <CategoryCard name="Massage" count={890} icon={Hand} />
            <CategoryCard name="Content Creators" count={456} icon={Video} />
            <CategoryCard name="Companions" count={789} icon={Users} />
            <CategoryCard name="Personals" count={2345} icon={MessageCircle} />
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-8 h-8 text-chart-3" />
                Available Now
              </h2>
              <p className="text-muted-foreground">Entertainers ready to connect right now</p>
            </div>
            <Button variant="outline" className="gap-2" data-testid="link-view-all-available">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
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
              isAvailableNow={true}
            />
            <ListingCard
              id="3"
              title="Emma Rodriguez"
              city="New York, NY"
              tagline="Elite companion"
              priceTokens={180}
              imageUrl={placeholderImg}
              tier="elite"
              isVerified={true}
              isAvailableNow={true}
            />
            <ListingCard
              id="4"
              title="Mia Johnson"
              city="Chicago, IL"
              tagline="Professional massage & relaxation"
              priceTokens={90}
              imageUrl={placeholderImg}
              tier="vip"
              isAvailableNow={true}
            />
            <ListingCard
              id="5"
              title="Ava Williams"
              city="Las Vegas, NV"
              tagline="Content creator & entertainer"
              priceTokens={110}
              imageUrl={placeholderImg}
              tier="basic"
              isVerified={true}
              isAvailableNow={true}
            />
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Premium verified entertainers</p>
            </div>
            <Button variant="outline" className="gap-2" data-testid="link-view-all-featured">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ListingCard
              id="6"
              title="Charlotte Davis"
              city="San Francisco, CA"
              tagline="Elite VIP companion"
              priceTokens={200}
              imageUrl={placeholderImg}
              tier="elite"
              isVerified={true}
              isHighlighted={true}
            />
            <ListingCard
              id="7"
              title="Olivia Brown"
              city="Boston, MA"
              tagline="Professional entertainer"
              priceTokens={130}
              imageUrl={placeholderImg}
              tier="vip"
              isVerified={true}
            />
            <ListingCard
              id="8"
              title="Amelia Wilson"
              city="Seattle, WA"
              tagline="Massage & wellness expert"
              priceTokens={95}
              imageUrl={placeholderImg}
              tier="vip"
              isVerified={true}
              isSpecial={true}
            />
            <ListingCard
              id="9"
              title="Harper Anderson"
              city="Austin, TX"
              tagline="Content creator & model"
              priceTokens={105}
              imageUrl={placeholderImg}
              tier="basic"
              isVerified={true}
            />
            <ListingCard
              id="10"
              title="Evelyn Thomas"
              city="Denver, CO"
              tagline="Professional companion"
              priceTokens={140}
              imageUrl={placeholderImg}
              tier="vip"
              isVerified={true}
            />
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Listings</h2>
              <p className="text-muted-foreground">Recently joined entertainers</p>
            </div>
            <Button variant="outline" className="gap-2" data-testid="link-view-all-new">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ListingCard
              id="11"
              title="Luna Martinez"
              city="Portland, OR"
              tagline="Upscale companion"
              priceTokens={115}
              imageUrl={placeholderImg}
              tier="basic"
            />
            <ListingCard
              id="12"
              title="Aria Garcia"
              city="Phoenix, AZ"
              tagline="Professional entertainer"
              priceTokens={100}
              imageUrl={placeholderImg}
              tier="basic"
              isVerified={true}
            />
            <ListingCard
              id="13"
              title="Nova Lee"
              city="San Diego, CA"
              tagline="Massage therapist"
              priceTokens={85}
              imageUrl={placeholderImg}
              tier="free"
            />
            <ListingCard
              id="14"
              title="Stella Kim"
              city="Dallas, TX"
              tagline="Content creator"
              priceTokens={95}
              imageUrl={placeholderImg}
              tier="basic"
            />
            <ListingCard
              id="15"
              title="Ivy Chen"
              city="Atlanta, GA"
              tagline="Professional companion"
              priceTokens={125}
              imageUrl={placeholderImg}
              tier="vip"
            />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
