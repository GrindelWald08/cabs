-- Enhanced Role System Migration
-- Add enhanced columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- Add constraint for status column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'inactive', 'suspended'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_activities table for audit logging
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all activities" ON public.user_activities;
CREATE POLICY "Admins can view all activities" 
ON public.user_activities 
FOR SELECT 
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "System can insert activities" ON public.user_activities;
CREATE POLICY "System can insert activities" 
ON public.user_activities 
FOR INSERT 
WITH CHECK (true);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_marketing BOOLEAN DEFAULT true,
  email_bookings BOOLEAN DEFAULT true,
  email_updates BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enhanced admin policies for user management
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update user profiles" ON public.profiles;
CREATE POLICY "Admins can update user profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Function to create default notification preferences
CREATE OR REPLACE FUNCTION public.create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_user_notification_preferences_created ON auth.users;
CREATE TRIGGER on_user_notification_preferences_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_notification_preferences();

-- Function to get user statistics (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE (
  total_users BIGINT,
  active_users BIGINT,
  admin_users BIGINT,
  new_users_this_month BIGINT,
  total_logins BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.profiles)::BIGINT as total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE status = 'active')::BIGINT as active_users,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin')::BIGINT as admin_users,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= date_trunc('month', now()))::BIGINT as new_users_this_month,
    (SELECT SUM(login_count) FROM public.profiles)::BIGINT as total_logins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION public.get_user_activity_summary(user_id_param UUID)
RETURNS TABLE (
  activity_type TEXT,
  activity_count BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.activity_type,
    COUNT(*)::BIGINT as activity_count,
    MAX(ua.created_at) as last_activity
  FROM public.user_activities ua
  WHERE ua.user_id = user_id_param
  GROUP BY ua.activity_type
  ORDER BY activity_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Update notification_preferences trigger
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login);