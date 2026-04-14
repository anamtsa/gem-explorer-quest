import { useState } from "react";
import { ArrowLeft, Camera, Crosshair, Loader2, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/mockGems";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitGem } from "@/hooks/useGems";
import { useToast } from "@/hooks/use-toast";

const AddGem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const submitGem = useSubmitGem();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [whySpecial, setWhySpecial] = useState("");
  const [tips, setTips] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locating, setLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setLocating(false);
        toast({ title: "Location set! 📍" });
      },
      (err) => {
        setLocating(false);
        toast({ title: "Could not get location", description: err.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!name || !city || !country || !category) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    submitGem.mutate(
      {
        name,
        city,
        country,
        category,
        description: description || undefined,
        why_special: whySpecial || undefined,
        tips: tips || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        submitted_by: user.id,
      },
      {
        onSuccess: () => {
          toast({ title: "Gem submitted! 💎", description: "It will be reviewed and published soon." });
          navigate("/");
        },
        onError: (e) => toast({ title: "Error submitting gem", description: e.message, variant: "destructive" }),
      }
    );
  };

  const inputClass =
    "w-full rounded-xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold">Add a Hidden Gem</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 pt-6">
        {!user && (
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-foreground">You need to be logged in to submit a gem.</p>
            <button onClick={() => navigate("/auth")} className="mt-2 text-sm font-semibold text-primary hover:underline">
              Log in or Sign up
            </button>
          </div>
        )}

        <button className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary">
          <Camera className="h-8 w-8" />
          <span className="text-sm">Add Photos</span>
        </button>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Secret Rooftop Garden" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">City *</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Country *</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category *</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  category === cat.id ? "gem-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this place..." rows={3} className={inputClass + " resize-none"} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Why is it special?
          </label>
          <textarea value={whySpecial} onChange={(e) => setWhySpecial(e.target.value)} placeholder="What makes this place unique..." rows={2} className={inputClass + " resize-none"} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">💡 Tips for visitors</label>
          <textarea value={tips} onChange={(e) => setTips(e.target.value)} placeholder="Best time to visit, how to find it..." rows={2} className={inputClass + " resize-none"} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">📍 Location</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude (e.g. 41.8967)"
              type="number"
              step="any"
              className={inputClass}
            />
            <input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude (e.g. 12.4822)"
              type="number"
              step="any"
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
            {locating ? "Getting location…" : "Use my current location"}
          </button>
          <p className="mt-1 text-[10px] text-muted-foreground">Optional — helps your gem appear on the map</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitGem.isPending}
          className="w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {submitGem.isPending ? "Submitting..." : "Submit Gem for Review 💎"}
        </button>
      </main>
    </div>
  );
};

export default AddGem;
