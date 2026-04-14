import { useState, useRef } from "react";
import { ArrowLeft, Camera, Crosshair, Loader2, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/mockGems";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitGem } from "@/hooks/useGems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddGem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const submitGem = useSubmitGem();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const validFiles = files.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast({ title: `${f.name} is not an image`, variant: "destructive" });
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast({ title: `${f.name} exceeds 5MB limit`, variant: "destructive" });
        return false;
      }
      return true;
    }).slice(0, remaining);

    if (files.length > remaining) {
      toast({ title: `Maximum ${MAX_PHOTOS} photos allowed` });
    }

    setPhotos((prev) => [...prev, ...validFiles]);
    setPhotoPreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (gemId: string): Promise<void> => {
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${gemId}/${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gem-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gem-photos").getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("gem_photos")
        .insert({ gem_id: gemId, url: data.publicUrl, display_order: i });

      if (insertError) throw insertError;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!name || !city || !country || !category) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const gemData = {
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
      };

      const { data: gem, error } = await supabase.from("gems").insert(gemData).select().single();
      if (error) throw error;

      if (photos.length > 0) {
        await uploadPhotos(gem.id);
      }

      toast({ title: "Gem submitted! 💎", description: "It will be reviewed and published soon." });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Error submitting gem", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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

        {/* Photo upload area */}
        <div>
          {photoPreviews.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photoPreviews.map((src, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={src} alt={`Photo ${i + 1}`} className="h-32 w-32 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-32 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[10px]">Add more</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
            >
              <Camera className="h-8 w-8" />
              <span className="text-sm">Add Photos</span>
              <span className="text-[10px]">Up to {MAX_PHOTOS} images, 5MB each</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </div>

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
          disabled={submitting}
          className="w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Gem for Review 💎"}
        </button>
      </main>
    </div>
  );
};

export default AddGem;
