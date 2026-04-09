import { ArrowLeft, Plus, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSavedGems, useUserLists, getPrimaryPhoto } from "@/hooks/useGems";
import { useAuth } from "@/contexts/AuthContext";

const SavedLists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: savedGems = [], isLoading: savesLoading } = useSavedGems();
  const { data: lists = [], isLoading: listsLoading } = useUserLists();

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
        {!user ? (
          <div className="py-16 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">Log in to see your saved gems</p>
            <button onClick={() => navigate("/auth")} className="mt-2 text-sm font-semibold text-primary hover:underline">
              Log in
            </button>
          </div>
        ) : (
          <>
            {/* Quick Saved */}
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Saved</h2>
              {savesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : savedGems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved gems yet. Tap the bookmark icon on any gem to save it!</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {savedGems.map((save: any) => {
                    const gem = save.gems;
                    if (!gem) return null;
                    return (
                      <button key={save.gem_id} onClick={() => navigate(`/gem/${gem.id}`)} className="relative min-w-[140px] overflow-hidden rounded-xl">
                        <img src={getPrimaryPhoto(gem.gem_photos || [])} alt={gem.name} className="h-28 w-full object-cover" loading="lazy" width={140} height={112} />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-primary-foreground truncate">{gem.name}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lists */}
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">My Lists</h2>
            {listsLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : lists.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lists yet. Create one to organize your gems!</p>
            ) : (
              <div className="space-y-3">
                {lists.map((list: any) => (
                  <button key={list.id} className="flex w-full items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg">
                      {list.emoji || <MapPin className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{list.name}</h3>
                      <p className="text-xs text-muted-foreground">{list.list_items?.length ?? 0} gems</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SavedLists;
