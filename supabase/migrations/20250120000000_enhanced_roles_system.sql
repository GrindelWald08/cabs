-- Enhanced Role System Migration
-- This migration adds better role management, user activity logging, and enhanced permissions

-- Add more columns to profiles table for enhanced user management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Create user_activity table for tracking user actions
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activity
CREATE POLICY "Users can view their own activity" 
ON public.user_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" 
ON public.user_activity 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert activity" 
ON public.user_activity 
FOR INSERT 
WITH CHECK (true);

-- Create admin_settings table for system-wide settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Admins can manage settings" 
ON public.admin_settings 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
ON public.user_sessions 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Update profiles policies to allow admins to manage all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activity (user_id, action, resource_type, resource_id, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to update user last login
CREATE OR REPLACE FUNCTION public.update_last_login(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login = now(),
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log the login activity
  PERFORM public.log_user_activity(p_user_id, 'login', 'auth', p_user_id::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to get user statistics (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE(
  total_users bigint,
  active_users bigint,
  admin_users bigint,
  new_users_today bigint,
  new_users_week bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE p.status = 'active') as active_users,
    COUNT(*) FILTER (WHERE p.role = 'admin') as admin_users,
    COUNT(*) FILTER (WHERE p.created_at >= CURRENT_DATE) as new_users_today,
    COUNT(*) FILTER (WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_week
  FROM public.profiles p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to change user role (admin only)
CREATE OR REPLACE FUNCTION public.change_user_role(
  p_user_id UUID,
  p_new_role TEXT
) RETURNS boolean AS $$
BEGIN
  -- Check if the caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Validate role
  IF p_new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: must be user or admin';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = p_new_role, 
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log the role change
  PERFORM public.log_user_activity(
    auth.uid(), 
    'role_change', 
    'user', 
    p_user_id::text, 
    jsonb_build_object('new_role', p_new_role, 'target_user', p_user_id)
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login DESC);

-- Add trigger for user_activity timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin settings
INSERT INTO public.admin_settings (key, value, description) VALUES
('site_maintenance', 'false', 'Enable/disable site maintenance mode'),
('user_registration', 'true', 'Allow new user registration'),
('max_login_attempts', '5', 'Maximum login attempts before account lockout'),
('session_timeout', '7200', 'Session timeout in seconds (2 hours)'),
('email_notifications', 'true', 'Enable system email notifications')
ON CONFLICT (key) DO NOTHING;

-- Create view for admin dashboard user overview
CREATE OR REPLACE VIEW public.admin_user_overview AS
SELECT 
  p.id,
  p.user_id,
  p.email,
  p.full_name,
  p.role,
  p.status,
  p.last_login,
  p.created_at,
  p.updated_at,
  COUNT(ua.id) as activity_count,
  MAX(ua.created_at) as last_activity
FROM public.profiles p
LEFT JOIN public.user_activity ua ON p.user_id = ua.user_id
GROUP BY p.id, p.user_id, p.email, p.full_name, p.role, p.status, p.last_login, p.created_at, p.updated_at
ORDER BY p.created_at DESC;

-- Grant necessary permissions
GRANT SELECT ON public.admin_user_overview TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.change_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_login(UUID) TO authenticated;