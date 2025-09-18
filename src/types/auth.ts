export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  last_login: string | null;
  notification_preferences: NotificationPreferences;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_today: number;
  new_users_week: number;
}

export interface UserActivitySummary {
  action: string;
  activity_count: number;
  last_activity: string;
}

export interface UserManagementFilters {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserWithActivity extends UserProfile {
  activity_count: number;
  last_activity: string | null;
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