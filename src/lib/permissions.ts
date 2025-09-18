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
  activityType: string,
  description: string,
  metadata: Record<string, any> = {}
) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: activityType,
      activity_description: description,
      metadata,
      ip_address: null, // Could be populated from request context
      user_agent: navigator.userAgent,
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