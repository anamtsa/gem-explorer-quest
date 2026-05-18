
-- Drop and recreate the INSERT policy on storage.objects for gem-photos with ownership check
DROP POLICY IF EXISTS "Gem owners can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gem photos" ON storage.objects;

CREATE POLICY "Gem owners can upload gem photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gem-photos'
  AND EXISTS (
    SELECT 1 FROM public.gems
    WHERE gems.id::text = (storage.foldername(name))[1]
      AND gems.submitted_by = auth.uid()
  )
);

CREATE POLICY "Gem owners can update gem photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gem-photos'
  AND EXISTS (
    SELECT 1 FROM public.gems
    WHERE gems.id::text = (storage.foldername(name))[1]
      AND gems.submitted_by = auth.uid()
  )
);

CREATE POLICY "Gem owners can delete gem photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gem-photos'
  AND EXISTS (
    SELECT 1 FROM public.gems
    WHERE gems.id::text = (storage.foldername(name))[1]
      AND gems.submitted_by = auth.uid()
  )
);

-- Add UPDATE and DELETE policies on gem_photos table
CREATE POLICY "Gem owners can update gem photo rows"
ON public.gem_photos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.gems
    WHERE gems.id = gem_photos.gem_id
      AND gems.submitted_by = auth.uid()
  )
);

CREATE POLICY "Gem owners can delete gem photo rows"
ON public.gem_photos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.gems
    WHERE gems.id = gem_photos.gem_id
      AND gems.submitted_by = auth.uid()
  )
);
