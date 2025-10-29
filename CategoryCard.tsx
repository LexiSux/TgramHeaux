import CategoryCard from "../CategoryCard";
import { Heart, Sparkles, Hand, Video, Users, MessageCircle } from "lucide-react";

export default function CategoryCardExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CategoryCard name="Escorts" count={1234} icon={Heart} />
          <CategoryCard name="BDSM & Fetish" count={567} icon={Sparkles} />
          <CategoryCard name="Massage" count={890} icon={Hand} />
          <CategoryCard name="Content Creators" count={456} icon={Video} />
          <CategoryCard name="Companions" count={789} icon={Users} />
          <CategoryCard name="Personals" count={2345} icon={MessageCircle} />
        </div>
      </div>
    </div>
  );
}
