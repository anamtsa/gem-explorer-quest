import { useState } from "react";
import { ArrowLeft, Camera, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/mockGems";
import { useToast } from "@/hooks/use-toast";

const AddGem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [whySpecial, setWhySpecial] = useState("");
  const [tips, setTips] = useState("");

  const handleSubmit = () => {
    if (!name || !city || !country || !category) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Gem submitted! 💎", description: "It will be reviewed and published soon." });
    navigate("/");
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
        {/* Photo upload */}
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
                  category === cat.id
                    ? "gem-gradient text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this place..."
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Why is it special?
          </label>
          <textarea
            value={whySpecial}
            onChange={(e) => setWhySpecial(e.target.value)}
            placeholder="What makes this place unique..."
            rows={2}
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            💡 Tips for visitors
          </label>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Best time to visit, how to find it..."
            rows={2}
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">📍 Location</label>
          <button className="flex w-full items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Tap to set coordinates on map
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
        >
          Submit Gem for Review 💎
        </button>
      </main>
    </div>
  );
};

export default AddGem;
