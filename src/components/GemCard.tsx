import { Heart, MapPin, Star, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleSave, getAvgRating, getPrimaryPhoto, type GemWithPhotos } from "@/hooks/useGems";

interface GemCardProps {
  gem: GemWithPhotos;
  compact?: boolean;
}

const GemCard = ({ gem, compact = false }: GemCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toggleSave = useToggleSave();
  const avgRating = getAvgRating(gem.reviews);
  const photo = getPrimaryPhoto(gem.gem_photos);
  const isSaved = gem.saves?.some((s) => s.user_id === user?.id) ?? false;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleSave.mutate({ gemId: gem.id, userId: user.id, isSaved });
  };

  if (compact) {
    return (
      <button
        onClick={() => navigate(`/gem/${gem.id}`)}
        className="group flex gap-3 rounded-xl bg-card p-3 shadow-sm transition-all hover:shadow-md text-left w-full"
      >
        <img src={photo} alt={gem.name} className="h-20 w-20 rounded-lg object-cover" loading="lazy" width={80} height={80} />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <h3 className="font-semibold text-sm text-card-foreground">{gem.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {gem.city}, {gem.country}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{avgRating || "New"}</span>
            </div>
            <span className="text-xs text-muted-foreground">({gem.reviews.length})</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group animate-fade-in overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg">
      <button onClick={() => navigate(`/gem/${gem.id}`)} className="relative w-full overflow-hidden">
        <img src={photo} alt={gem.name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width={400} height={192} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {avgRating || "New"}
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
          {gem.category}
        </span>
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-card-foreground">{gem.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {gem.city}, {gem.country}
            </div>
          </div>
          <button onClick={handleSave} className="rounded-full p-1.5 transition-colors hover:bg-muted">
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>
        {gem.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{gem.description}</p>
        )}
      </div>
    </div>
  );
};

export default GemCard;
