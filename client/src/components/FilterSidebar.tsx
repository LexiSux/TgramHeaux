import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { X } from "lucide-react";

interface FilterSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({ onClose, isMobile = false }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filters, setFilters] = useState({
    availableNow: false,
    verified: false,
    paidListings: false,
    specials: false,
  });

  const handleFilterChange = (key: string, value: boolean) => {
    setFilters({ ...filters, [key]: value });
    console.log("Filter changed:", key, value);
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setFilters({
      availableNow: false,
      verified: false,
      paidListings: false,
      specials: false,
    });
    console.log("Filters reset");
  };

  return (
    <div className="flex flex-col h-full">
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-filters">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Quick Filters</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={filters.availableNow}
                onCheckedChange={(checked) => handleFilterChange("availableNow", !!checked)}
                data-testid="checkbox-available-now"
              />
              <Label htmlFor="available" className="cursor-pointer">Available Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verified}
                onCheckedChange={(checked) => handleFilterChange("verified", !!checked)}
                data-testid="checkbox-verified"
              />
              <Label htmlFor="verified" className="cursor-pointer">Verified Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paid"
                checked={filters.paidListings}
                onCheckedChange={(checked) => handleFilterChange("paidListings", !!checked)}
                data-testid="checkbox-paid"
              />
              <Label htmlFor="paid" className="cursor-pointer">Paid Listings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specials"
                checked={filters.specials}
                onCheckedChange={(checked) => handleFilterChange("specials", !!checked)}
                data-testid="checkbox-specials"
              />
              <Label htmlFor="specials" className="cursor-pointer">Specials</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Price Range (Love Coins)</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={500}
              step={10}
              className="w-full"
              data-testid="slider-price"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span data-testid="text-price-min">{priceRange[0]} coins</span>
              <span data-testid="text-price-max">{priceRange[1]} coins</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Membership Tier</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="basic" data-testid="checkbox-tier-basic" />
              <Label htmlFor="basic" className="cursor-pointer">Basic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="vip" data-testid="checkbox-tier-vip" />
              <Label htmlFor="vip" className="cursor-pointer">VIP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="elite" data-testid="checkbox-tier-elite" />
              <Label htmlFor="elite" className="cursor-pointer">Elite</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2">
        <Button className="w-full" data-testid="button-apply-filters">Apply Filters</Button>
        <Button variant="outline" className="w-full" onClick={handleReset} data-testid="button-reset-filters">
          Reset All
        </Button>
      </div>
    </div>
  );
}
