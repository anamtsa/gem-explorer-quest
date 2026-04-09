import { Heart, MapPin, Star, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Gem } from "@/data/mockGems";
import { useState } from "react";

interface GemCardProps {
  gem: Gem;
  compact?: boolean;
}

const GemCard = ({ gem, compact = false }: GemCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(gem.liked ?? false);
  const [saved, setSaved] = useState(gem.saved ?? false);

  if (compact) {
    return (
      <button
        onClick={() => navigate(`/gem/${gem.id}`)}
        className="group flex gap-3 rounded-xl bg-card p-3 shadow-sm transition-all hover:shadow-md text-left w-full"
      >
        <img
          src={gem.image}
          alt={gem.name}
          className="h-20 w-20 rounded-lg object-cover"
          loading="lazy"
          width={80}
          height={80}
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <h3 className="font-semibold text-sm text-card-foreground">{gem.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {gem.city}, {gem.country}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{gem.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({gem.reviewCount})</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group animate-fade-in overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg">
      <button
        onClick={() => navigate(`/gem/${gem.id}`)}
        className="relative w-full overflow-hidden"
      >
        <img
          src={gem.image}
          alt={gem.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={192}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {gem.rating}
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
          <div className="flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className="rounded-full p-1.5 transition-colors hover:bg-muted"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-coral text-coral" : "text-muted-foreground"}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className="rounded-full p-1.5 transition-colors hover:bg-muted"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{gem.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {gem.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GemCard;
