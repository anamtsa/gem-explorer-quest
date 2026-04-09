
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ GEMS ============
CREATE TABLE public.gems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  category TEXT NOT NULL,
  description TEXT,
  why_special TEXT,
  tips TEXT,
  opening_hours TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved gems" ON public.gems FOR SELECT USING (is_approved = true OR auth.uid() = submitted_by);
CREATE POLICY "Authenticated users can submit gems" ON public.gems FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can update own gems" ON public.gems FOR UPDATE USING (auth.uid() = submitted_by);
CREATE TRIGGER update_gems_updated_at BEFORE UPDATE ON public.gems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GEM PHOTOS ============
CREATE TABLE public.gem_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id UUID NOT NULL REFERENCES public.gems(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gem_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gem photos" ON public.gem_photos FOR SELECT USING (true);
CREATE POLICY "Gem owners can add photos" ON public.gem_photos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.gems WHERE id = gem_id AND submitted_by = auth.uid()));

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id UUID NOT NULL REFERENCES public.gems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(gem_id, user_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SAVES ============
CREATE TABLE public.saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gem_id UUID NOT NULL REFERENCES public.gems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, gem_id)
);
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saves" ON public.saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own saves" ON public.saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON public.saves FOR DELETE USING (auth.uid() = user_id);

-- ============ LISTS ============
CREATE TABLE public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own lists" ON public.lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own lists" ON public.lists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lists" ON public.lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lists" ON public.lists FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LIST ITEMS ============
CREATE TABLE public.list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  gem_id UUID NOT NULL REFERENCES public.gems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(list_id, gem_id)
);
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own list items" ON public.list_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can add to own lists" ON public.list_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can remove from own lists" ON public.list_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.lists WHERE id = list_id AND user_id = auth.uid())
);

-- ============ FOLLOWERS ============
CREATE TABLE public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, followee_id),
  CHECK (follower_id != followee_id)
);
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view followers" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.followers FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.followers FOR DELETE USING (auth.uid() = follower_id);

-- ============ INDEXES ============
CREATE INDEX idx_gems_category ON public.gems(category);
CREATE INDEX idx_gems_country ON public.gems(country);
CREATE INDEX idx_gems_city ON public.gems(city);
CREATE INDEX idx_gems_approved ON public.gems(is_approved);
CREATE INDEX idx_reviews_gem ON public.reviews(gem_id);
CREATE INDEX idx_saves_user ON public.saves(user_id);
CREATE INDEX idx_followers_followee ON public.followers(followee_id);

-- ============ STORAGE ============
INSERT INTO storage.buckets (id, name, public) VALUES ('gem-photos', 'gem-photos', true);
CREATE POLICY "Anyone can view gem photos" ON storage.objects FOR SELECT USING (bucket_id = 'gem-photos');
CREATE POLICY "Authenticated users can upload gem photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gem-photos');
