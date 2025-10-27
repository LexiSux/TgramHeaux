import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import placeholderImg from "@assets/generated_images/Profile_placeholder_image_63834e8a.png";

export default function BrowsePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const listings = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    title: `Entertainer ${i + 1}`,
    city: ["Los Angeles, CA", "Miami, FL", "New York, NY", "Chicago, IL", "Las Vegas, NV"][i % 5],
    tagline: ["Professional companion", "Upscale entertainer", "Elite companion", "Massage therapist", "Content creator"][i % 5],
    priceTokens: [100, 120, 150, 80, 110][i % 5],
    imageUrl: placeholderImg,
    tier: (["free", "basic", "vip", "elite"] as const)[i % 4],
    isVerified: i % 3 === 0,
    isAvailableNow: i % 4 === 0,
    isHighlighted: i % 7 === 0,
    isSpecial: i % 9 === 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
            <p className="text-muted-foreground">Showing {listings.length} results in your area</p>
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 lg:hidden" data-testid="button-open-filters">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <FilterSidebar onClose={() => setIsFilterOpen(false)} isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside>

          <main className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button variant="outline" disabled data-testid="button-prev">Previous</Button>
                <Button variant="outline" data-testid="button-page-1">1</Button>
                <Button data-testid="button-page-2">2</Button>
                <Button variant="outline" data-testid="button-page-3">3</Button>
                <Button variant="outline" data-testid="button-next">Next</Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
