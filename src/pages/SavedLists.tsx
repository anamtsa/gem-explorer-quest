import { ArrowLeft, Plus, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockGems } from "@/data/mockGems";

const lists = [
  { id: "1", name: "Japan Trip 🇯🇵", count: 3, image: null },
  { id: "2", name: "Best Cafés ☕", count: 5, image: null },
  { id: "3", name: "Nature Escapes 🌿", count: 4, image: null },
];

const SavedLists = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full p-1.5 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold">Saved Lists</h1>
          </div>
          <button className="rounded-full bg-primary p-2 text-primary-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* Quick Saved */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Saved</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mockGems.slice(0, 3).map((gem) => (
              <button
                key={gem.id}
                onClick={() => navigate(`/gem/${gem.id}`)}
                className="relative min-w-[140px] overflow-hidden rounded-xl"
              >
                <img src={gem.image} alt={gem.name} className="h-28 w-full object-cover" loading="lazy" width={140} height={112} />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-primary-foreground truncate">
                  {gem.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Lists */}
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">My Lists</h2>
        <div className="space-y-3">
          {lists.map((list) => (
            <button
              key={list.id}
              className="flex w-full items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{list.name}</h3>
                <p className="text-xs text-muted-foreground">{list.count} gems</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SavedLists;
