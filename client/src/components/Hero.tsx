import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import heroImg from "@assets/generated_images/Dark_cityscape_hero_background_df664467.png";

export default function Hero() {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", { location, query: searchQuery });
  };

  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" data-testid="text-hero-title">
          Find Your Perfect Connection
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
          Connect with verified entertainers and personals in your local area
        </p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <div className="flex-1 flex items-center gap-2 bg-white/90 rounded-md px-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City or ZIP code"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white/90 rounded-md px-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-hero"
              />
            </div>
            <Button size="lg" className="sm:w-auto" data-testid="button-search-hero">
              Search
            </Button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-white/80 text-sm">Popular:</span>
          <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="link-category-escorts">
            Escorts
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="link-category-massage">
            Massage
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="link-category-companions">
            Companions
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="link-category-personals">
            Personals
          </Button>
        </div>
      </div>
    </div>
  );
}
