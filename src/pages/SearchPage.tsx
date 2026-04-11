import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, MapPin, List, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GemCard from "@/components/GemCard";
import GemMap from "@/components/GemMap";
import CategoryPills from "@/components/CategoryPills";
import { useGems } from "@/hooks/useGems";
import type { Category } from "@/data/mockGems";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const { data: allGems = [], isLoading } = useGems(category);

  const results = allGems.filter((g) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.country.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full p-1.5 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search countries, cities, gems..." className="w-full rounded-full bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" autoFocus />
            </div>
            <button className="rounded-full bg-secondary p-2 hover:bg-secondary/80">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        <CategoryPills selected={category} onSelect={setCategory} />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${results.length} gems found`}
          </span>
          <div className="flex gap-1 rounded-full bg-secondary p-0.5">
            <button onClick={() => setView("list")} className={`rounded-full p-1.5 transition-all ${view === "list" ? "bg-card shadow-sm" : ""}`}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setView("map")} className={`rounded-full p-1.5 transition-all ${view === "map" ? "bg-card shadow-sm" : ""}`}>
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="mt-4 grid gap-3">
            {results.map((gem) => (
              <GemCard key={gem.id} gem={gem} compact />
            ))}
            {!isLoading && results.length === 0 && (
              <div className="py-16 text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No gems found. Try a different search!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <GemMap gems={results} />
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
