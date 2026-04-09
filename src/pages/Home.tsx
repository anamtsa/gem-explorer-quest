import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GemCard from "@/components/GemCard";
import CategoryPills from "@/components/CategoryPills";
import { mockGems, type Category } from "@/data/mockGems";
import logo from "@/assets/logo.png";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  const filteredGems = selectedCategory
    ? mockGems.filter((g) => g.category === selectedCategory)
    : mockGems;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Hidden Gems" className="h-8 w-8" width={32} height={32} />
            <h1 className="text-lg font-bold text-gradient">Hidden Gems</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/search")}
              className="rounded-full bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="relative rounded-full bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary/80">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-coral" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* Greeting */}
        <div className="mb-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">
            Discover the<br />
            <span className="text-gradient">Undiscovered</span> ✨
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Find unique places only locals know about
          </p>
        </div>

        {/* Categories */}
        <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Trending Section */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Trending Gems 🔥</h3>
            <button className="text-xs font-medium text-primary">See all</button>
          </div>

          {/* Horizontal scroll for top gems */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {mockGems.slice(0, 3).map((gem) => (
              <button
                key={gem.id}
                onClick={() => navigate(`/gem/${gem.id}`)}
                className="group relative min-w-[220px] overflow-hidden rounded-2xl"
              >
                <img
                  src={gem.image}
                  alt={gem.name}
                  className="h-36 w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                  width={220}
                  height={144}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold text-primary-foreground">{gem.name}</p>
                  <p className="text-xs text-primary-foreground/80">{gem.city}, {gem.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All Gems */}
        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-foreground">Recently Added 🌍</h3>
          <div className="grid gap-4">
            {filteredGems.map((gem) => (
              <GemCard key={gem.id} gem={gem} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
