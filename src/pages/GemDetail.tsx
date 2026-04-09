import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Star, MapPin, Clock, Share2, MessageCircle, Navigation } from "lucide-react";
import { mockGems } from "@/data/mockGems";

const GemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const gem = mockGems.find((g) => g.id === id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!gem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Gem not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Image */}
      <div className="relative">
        <img src={gem.image} alt={gem.name} className="h-72 w-full object-cover" width={800} height={288} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-foreground/20" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setSaved(!saved)} className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
              <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} />
            </button>
            <button className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="mb-2 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {gem.category}
          </span>
          <h1 className="text-2xl font-bold text-primary-foreground">{gem.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-primary-foreground/80">
            <MapPin className="h-4 w-4" />
            {gem.city}, {gem.country}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-lg px-4">
        {/* Stats Row */}
        <div className="flex items-center gap-4 border-b border-border py-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{gem.rating}</span>
            <span className="text-sm text-muted-foreground">({gem.reviewCount})</span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-coral text-coral" : "text-muted-foreground"}`} />
            <span className="text-sm">{gem.likes + (liked ? 1 : 0)}</span>
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {gem.reviewCount} reviews
          </div>
        </div>

        {/* Description */}
        <section className="py-4">
          <h2 className="font-semibold text-foreground">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{gem.description}</p>
        </section>

        {/* Why Special */}
        <section className="rounded-2xl bg-primary/5 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-primary">
            ✨ Why it's special
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{gem.whySpecial}</p>
        </section>

        {/* Tips */}
        <section className="mt-4 rounded-2xl bg-accent/10 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-accent">
            💡 Insider Tips
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{gem.tips}</p>
        </section>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {gem.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {gem.lat.toFixed(4)}, {gem.lon.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Added {gem.addedAt} by @{gem.addedBy}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="mt-6 w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]">
          Get Directions 🧭
        </button>
      </main>
    </div>
  );
};

export default GemDetail;
