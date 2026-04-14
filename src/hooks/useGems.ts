import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GemWithPhotos {
  id: string;
  name: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  description: string | null;
  why_special: string | null;
  tips: string | null;
  opening_hours: string | null;
  is_approved: boolean;
  submitted_by: string;
  created_at: string;
  gem_photos: { url: string; display_order: number }[];
  reviews: { rating: number }[];
  saves: { user_id: string }[];
}

export const useGems = (category?: string | null) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["gems", category, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("gems")
        .select("*, gem_photos(url, display_order), reviews(rating), saves(user_id)")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GemWithPhotos[];
    },
  });
};

export const useGem = (id: string) => {
  return useQuery({
    queryKey: ["gem", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gems")
        .select("*, gem_photos(url, display_order), reviews(id, rating, text, user_id, created_at), saves(user_id)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useSubmitGem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gem: {
      name: string;
      city: string;
      country: string;
      category: string;
      description?: string;
      why_special?: string;
      tips?: string;
      latitude?: number;
      longitude?: number;
      submitted_by: string;
    }) => {
      const { data, error } = await supabase.from("gems").insert(gem).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gems"] });
    },
  });
};

export const useToggleSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gemId, userId, isSaved }: { gemId: string; userId: string; isSaved: boolean }) => {
      if (isSaved) {
        const { error } = await supabase.from("saves").delete().eq("gem_id", gemId).eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saves").insert({ gem_id: gemId, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gems"] });
      queryClient.invalidateQueries({ queryKey: ["gem"] });
      queryClient.invalidateQueries({ queryKey: ["saved-gems"] });
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { gem_id: string; user_id: string; rating: number; text?: string }) => {
      const { data, error } = await supabase.from("reviews").insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gem"] });
      queryClient.invalidateQueries({ queryKey: ["gems"] });
    },
  });
};

export const useSavedGems = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-gems", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saves")
        .select("gem_id, gems(*, gem_photos(url, display_order), reviews(rating))")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUserLists = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["lists", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("lists")
        .select("*, list_items(gem_id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUserStats = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user) return { gems: 0, saves: 0, reviews: 0, following: 0 };
      const [gemsRes, savesRes, reviewsRes, followingRes] = await Promise.all([
        supabase.from("gems").select("id", { count: "exact", head: true }).eq("submitted_by", user.id),
        supabase.from("saves").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("followers").select("id", { count: "exact", head: true }).eq("follower_id", user.id),
      ]);
      return {
        gems: gemsRes.count ?? 0,
        saves: savesRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        following: followingRes.count ?? 0,
      };
    },
    enabled: !!user,
  });
};

// Helper to compute average rating
export const getAvgRating = (reviews: { rating: number }[]) => {
  if (!reviews.length) return 0;
  return Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1));
};

// Helper to get primary photo
export const getPrimaryPhoto = (photos: { url: string; display_order: number }[]) => {
  if (!photos.length) return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
  return [...photos].sort((a, b) => a.display_order - b.display_order)[0].url;
};
