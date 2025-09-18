import { UserRole, RoleBasedPermissions } from '@/types/auth';

export const getRolePermissions = (role: UserRole): RoleBasedPermissions => {
  switch (role) {
    case 'admin':
      return {
        canViewAdminDashboard: true,
        canManageUsers: true,
        canManageDestinations: true,
        canViewAllPayments: true,
        canModifyUserRoles: true,
        canViewUserActivities: true,
      };
    case 'user':
    default:
      return {
        canViewAdminDashboard: false,
        canManageUsers: false,
        canManageDestinations: false,
        canViewAllPayments: false,
        canModifyUserRoles: false,
        canViewUserActivities: false,
      };
  }
};

export const hasPermission = (
  userRole: UserRole,
  permission: keyof RoleBasedPermissions
): boolean => {
  const permissions = getRolePermissions(userRole);
  return permissions[permission];
};

export const checkAdminAccess = (role: UserRole): boolean => {
  return role === 'admin';
};

export const checkUserAccess = (role: UserRole): boolean => {
  return role === 'user' || role === 'admin';
};

// Activity logging utilities
export const logUserActivity = async (
  userId: string,
  action: string,
  resourceType: string | null = null,
  resourceId: string | null = null,
  details: Record<string, any> = {}
) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.rpc('log_user_activity', {
      p_user_id: userId,
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details
    });
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
};

// Common activity types
export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
  ROLE_CHANGE: 'role_change',
  DESTINATION_CREATE: 'destination_create',
  DESTINATION_UPDATE: 'destination_update',
  DESTINATION_DELETE: 'destination_delete',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_STATUS_CHANGE: 'user_status_change',
  BOOKING_CREATE: 'booking_create',
  PREFERENCES_UPDATE: 'preferences_update',
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

// Helper function to change user role (admin only)
export const changeUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.rpc('change_user_role', {
      p_user_id: userId,
      p_new_role: newRole
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Failed to change user role:', error);
    return { success: false, error };
  }
};