import { useState } from 'react';
import { Shield, User, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserProfile, UserRole } from '@/types/auth';
import { useRoles } from '@/hooks/useRoles';

interface RoleAssignmentProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChanged?: () => void;
}

export function RoleAssignment({ user, open, onOpenChange, onRoleChanged }: RoleAssignmentProps) {
  const { updateUserRole, loading } = useRoles();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const roles = [
    {
      value: 'user' as UserRole,
      label: 'User',
      description: 'Regular user with basic permissions',
      icon: User,
      permissions: [
        'View own profile and bookings',
        'Make travel bookings',
        'Update personal information',
        'View public content'
      ]
    },
    {
      value: 'admin' as UserRole,
      label: 'Administrator',
      description: 'Full access to system management',
      icon: Shield,
      permissions: [
        'Manage all users and roles',
        'Manage destinations and content',
        'View all payments and analytics',
        'Access admin dashboard',
        'Configure system settings'
      ]
    }
  ];

  const handleRoleChange = async () => {
    if (selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    const result = await updateUserRole(user.user_id, selectedRole, user);
    if (result.success) {
      onOpenChange(false);
      onRoleChanged?.();
    }
  };

  const isRoleChange = selectedRole !== user.role;
  const isPromotingToAdmin = selectedRole === 'admin' && user.role === 'user';
  const isDemotingFromAdmin = selectedRole === 'user' && user.role === 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Change User Role
          </DialogTitle>
          <DialogDescription>
            Update the role and permissions for <strong>{user.full_name || user.email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Role Display */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Role</span>
              <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                {user.role === 'admin' ? (
                  <Shield className="w-3 h-3 mr-1" />
                ) : (
                  <User className="w-3 h-3 mr-1" />
                )}
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select New Role</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={role.value} id={role.value} />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={role.value} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="w-4 h-4" />
                        {role.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                      <div className="space-y-1">
                        {role.permissions.map((permission, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            {permission}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Warning for role changes */}
          {isPromotingToAdmin && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This will grant full administrative access to the system, 
                including the ability to manage other users and system settings.
              </AlertDescription>
            </Alert>
          )}

          {isDemotingFromAdmin && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This will remove all administrative privileges. 
                The user will lose access to the admin dashboard and management features.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRoleChange}
            disabled={loading || !isRoleChange}
          >
            {loading ? 'Updating...' : isRoleChange ? 'Update Role' : 'No Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}