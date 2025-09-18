import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Shield, ShieldOff, Ban, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserProfile, UserRole, UserStatus } from '@/types/auth';
import { useRoles } from '@/hooks/useRoles';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { fetchAllUsers, updateUserRole, updateUserStatus, loading: rolesLoading } = useRoles();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<'role' | 'status' | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [newStatus, setNewStatus] = useState<UserStatus>('active');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const usersPerPage = 20;

  const loadUsers = async (page = 0) => {
    setLoading(true);
    const { data, count, error } = await fetchAllUsers(
      page,
      usersPerPage,
      searchTerm,
      roleFilter,
      statusFilter
    );

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } else {
      setUsers(data);
      setTotalUsers(count);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(0);
    setCurrentPage(0);
  }, [searchTerm, roleFilter, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadUsers(page);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    const result = await updateUserRole(selectedUser.user_id, newRole, selectedUser);
    if (result.success) {
      loadUsers(currentPage);
      setShowConfirmDialog(false);
      setSelectedUser(null);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;

    const result = await updateUserStatus(selectedUser.user_id, newStatus, selectedUser);
    if (result.success) {
      loadUsers(currentPage);
      setShowConfirmDialog(false);
      setSelectedUser(null);
    }
  };

  const openRoleDialog = (user: UserProfile, role: UserRole) => {
    setSelectedUser(user);
    setNewRole(role);
    setActionType('role');
    setShowConfirmDialog(true);
  };

  const openStatusDialog = (user: UserProfile, status: UserStatus) => {
    setSelectedUser(user);
    setNewStatus(status);
    setActionType('status');
    setShowConfirmDialog(true);
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Ban },
      suspended: { color: 'bg-red-100 text-red-800', icon: Ban },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      user: { color: 'bg-blue-100 text-blue-800', icon: ShieldOff },
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {role}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts, roles, and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Login Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.full_name || 'No name provided'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>{user.login_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role === 'user' ? (
                            <DropdownMenuItem onClick={() => openRoleDialog(user, 'admin')}>
                              <Shield className="w-4 h-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openRoleDialog(user, 'user')}>
                              <ShieldOff className="w-4 h-4 mr-2" />
                              Remove Admin
                            </DropdownMenuItem>
                          )}
                          {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => openStatusDialog(user, 'suspended')}>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openStatusDialog(user, 'active')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {currentPage * usersPerPage + 1} to {Math.min((currentPage + 1) * usersPerPage, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm {actionType === 'role' ? 'Role' : 'Status'} Change
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'role' 
                  ? `Are you sure you want to change ${selectedUser?.full_name || 'this user'}'s role to ${newRole}?`
                  : `Are you sure you want to change ${selectedUser?.full_name || 'this user'}'s status to ${newStatus}?`
                }
                {actionType === 'role' && newRole === 'admin' && 
                  ' This will give them full administrative access to the system.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={actionType === 'role' ? handleRoleChange : handleStatusChange}
                disabled={rolesLoading}
              >
                {rolesLoading ? 'Processing...' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;