import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, UserStatus } from '@/types/auth';
import { logUserActivity, ACTIVITY_TYPES } from '@/lib/permissions';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useRoles = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateUserRole = useCallback(async (
    userId: string,
    newRole: UserRole,
    targetUserProfile?: UserProfile
  ) => {
    if (!isAdmin || !user) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to modify user roles.',
        variant: 'destructive',
      });
      return { success: false, error: 'Access denied' };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the role change activity
      await logUserActivity(
        user.id,
        ACTIVITY_TYPES.ROLE_CHANGE,
        `Changed role for user ${targetUserProfile?.full_name || 'Unknown'} to ${newRole}`,
        {
          target_user_id: userId,
          old_role: targetUserProfile?.role,
          new_role: newRole,
        }
      );

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user, toast]);

  const updateUserStatus = useCallback(async (
    userId: string,
    newStatus: UserStatus,
    targetUserProfile?: UserProfile
  ) => {
    if (!isAdmin || !user) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to modify user status.',
        variant: 'destructive',
      });
      return { success: false, error: 'Access denied' };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the status change activity
      await logUserActivity(
        user.id,
        ACTIVITY_TYPES.USER_STATUS_CHANGE,
        `Changed status for user ${targetUserProfile?.full_name || 'Unknown'} to ${newStatus}`,
        {
          target_user_id: userId,
          old_status: targetUserProfile?.status,
          new_status: newStatus,
        }
      );

      toast({
        title: 'Status Updated',
        description: `User status has been updated to ${newStatus}.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user, toast]);

  const fetchAllUsers = useCallback(async (
    page = 0,
    limit = 50,
    search = '',
    roleFilter = 'all',
    statusFilter = 'all'
  ) => {
    if (!isAdmin) {
      return { data: [], error: 'Access denied', count: 0 };
    }

    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply search filter
      if (search.trim()) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply pagination
      const from = page * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as UserProfile[], error: null, count: count || 0 };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return { data: [], error: error.message, count: 0 };
    }
  }, [isAdmin]);

  const fetchUserStatistics = useCallback(async () => {
    if (!isAdmin) {
      return { data: null, error: 'Access denied' };
    }

    try {
      const { data, error } = await supabase.rpc('get_user_statistics');

      if (error) throw error;

      return { data: data?.[0] || null, error: null };
    } catch (error: any) {
      console.error('Error fetching user statistics:', error);
      return { data: null, error: error.message };
    }
  }, [isAdmin]);

  const fetchUserActivities = useCallback(async (
    userId: string,
    page = 0,
    limit = 20
  ) => {
    if (!isAdmin && user?.id !== userId) {
      return { data: [], error: 'Access denied', count: 0 };
    }

    try {
      const from = page * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: data || [], error: null, count: count || 0 };
    } catch (error: any) {
      console.error('Error fetching user activities:', error);
      return { data: [], error: error.message, count: 0 };
    }
  }, [isAdmin, user]);

  return {
    updateUserRole,
    updateUserStatus,
    fetchAllUsers,
    fetchUserStatistics,
    fetchUserActivities,
    loading,
  };
};