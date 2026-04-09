import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Star, MapPin, Clock, Share2, MessageCircle, Navigation, Send } from "lucide-react";
import { useGem, useToggleSave, useSubmitReview, getAvgRating, getPrimaryPhoto } from "@/hooks/useGems";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const GemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: gem, isLoading } = useGem(id!);
  const toggleSave = useToggleSave();
  const submitReview = useSubmitReview();

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!gem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Gem not found</p>
      </div>
    );
  }

  const avgRating = getAvgRating(gem.reviews);
  const photo = getPrimaryPhoto(gem.gem_photos);
  const isSaved = gem.saves?.some((s: { user_id: string }) => s.user_id === user?.id) ?? false;
  const hasReviewed = gem.reviews?.some((r: { user_id: string }) => r.user_id === user?.id);

  const handleSave = () => {
    if (!user) { navigate("/auth"); return; }
    toggleSave.mutate({ gemId: gem.id, userId: user.id, isSaved });
  };

  const handleReview = () => {
    if (!user) { navigate("/auth"); return; }
    submitReview.mutate(
      { gem_id: gem.id, user_id: user.id, rating: reviewRating, text: reviewText || undefined },
      {
        onSuccess: () => {
          toast({ title: "Review submitted! ⭐" });
          setReviewText("");
          setReviewRating(5);
        },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="relative">
        <img src={photo} alt={gem.name} className="h-72 w-full object-cover" width={800} height={288} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-foreground/20" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleSave} className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
              <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
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
        <div className="flex items-center gap-4 border-b border-border py-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{avgRating || "New"}</span>
            <span className="text-sm text-muted-foreground">({gem.reviews.length})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {gem.reviews.length} reviews
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Bookmark className="h-4 w-4" />
            {gem.saves?.length ?? 0} saves
          </div>
        </div>

        <section className="py-4">
          <h2 className="font-semibold text-foreground">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{gem.description}</p>
        </section>

        {gem.why_special && (
          <section className="rounded-2xl bg-primary/5 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-primary">✨ Why it's special</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{gem.why_special}</p>
          </section>
        )}

        {gem.tips && (
          <section className="mt-4 rounded-2xl bg-accent/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-accent">💡 Insider Tips</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{gem.tips}</p>
          </section>
        )}

        {gem.latitude && gem.longitude && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{gem.latitude.toFixed(4)}, {gem.longitude.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Added {new Date(gem.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <section className="mt-6 border-t border-border pt-4">
          <h2 className="font-semibold text-foreground">Reviews</h2>
          {gem.reviews.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No reviews yet. Be the first!</p>
          ) : (
            <div className="mt-3 space-y-3">
              {gem.reviews.map((review: any) => (
                <div key={review.id} className="rounded-xl bg-secondary/50 p-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {review.text && <p className="mt-1 text-sm text-foreground">{review.text}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          {user && !hasReviewed && (
            <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Leave a Review</h3>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setReviewRating(n)}>
                    <Star className={`h-6 w-6 ${n <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={2}
                className="mt-2 w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                onClick={handleReview}
                disabled={submitReview.isPending}
                className="mt-2 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Submit
              </button>
            </div>
          )}
          {!user && (
            <button onClick={() => navigate("/auth")} className="mt-3 text-sm font-medium text-primary hover:underline">
              Log in to leave a review
            </button>
          )}
        </section>

        <button className="mt-6 w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]">
          Get Directions 🧭
        </button>
      </main>
    </div>
  );
};

export default GemDetail;
