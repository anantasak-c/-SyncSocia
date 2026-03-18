-- Add line_access_token to profiles table
ALTER TABLE public.profiles
ADD COLUMN line_access_token TEXT;
