import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  count: number;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function CategoryCard({ name, count, icon: Icon, onClick }: CategoryCardProps) {
  return (
    <Card
      className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
      onClick={() => {
        onClick?.();
        console.log("Category clicked:", name);
      }}
      data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1" data-testid="text-category-name">{name}</h3>
          <p className="text-sm text-muted-foreground" data-testid="text-category-count">
            {count.toLocaleString()} listings
          </p>
        </div>
      </div>
    </Card>
  );
}
