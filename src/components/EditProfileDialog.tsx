import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    display_name: string | null;
    username: string | null;
    bio: string | null;
    country: string | null;
    region: string | null;
    avatar_url: string | null;
  } | null;
}

const EditProfileDialog = ({ open, onOpenChange, profile }: EditProfileDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    display_name: "",
    username: "",
    bio: "",
    country: "",
    region: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        country: profile.country || "",
        region: profile.region || "",
      });
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [profile, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    setUploading(true);
    try {
      const ext = avatarFile.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      // Add cache-buster to force browser refresh
      return `${data.publicUrl}?t=${Date.now()}`;
    } catch (e: any) {
      toast.error(e.message || "Failed to upload avatar");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let avatarUrl: string | null | undefined;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (avatarUrl === null && avatarFile) {
          setSaving(false);
          return; // upload failed
        }
      }

      const updateData = {
        display_name: form.display_name || null,
        username: form.username || null,
        bio: form.bio || null,
        country: form.country || null,
        region: form.region || null,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = avatarPreview || profile?.avatar_url;
  const initials = (form.display_name || "?").charAt(0).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
            >
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full gem-gradient flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">Tap to change photo</p>

          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input id="display_name" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="@username" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="Country" />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input id="region" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} placeholder="City / Region" />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving || uploading} className="w-full gem-gradient text-primary-foreground">
            {uploading ? "Uploading…" : saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
