export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  last_login: string | null;
  login_count: number;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_marketing: boolean;
  email_bookings: boolean;
  email_updates: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_this_month: number;
  total_logins: number;
}

export interface UserActivitySummary {
  activity_type: string;
  activity_count: number;
  last_activity: string;
}

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface RoleBasedPermissions {
  canViewAdminDashboard: boolean;
  canManageUsers: boolean;
  canManageDestinations: boolean;
  canViewAllPayments: boolean;
  canModifyUserRoles: boolean;
  canViewUserActivities: boolean;
}

export interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  userProfile: UserProfile | null;
  permissions: RoleBasedPermissions;
  refreshUserProfile: () => Promise<void>;
}