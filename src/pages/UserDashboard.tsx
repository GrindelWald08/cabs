import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfileSettings from '@/components/user/ProfileSettings';

interface Booking {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  destinations: {
    title: string;
    location: string;
    duration: string;
  };
}

const UserDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          destinations (
            title,
            location,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your bookings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const totalSpent = bookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.amount), 0);

  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {userProfile?.full_name || 'Traveler'}!</h1>
        <p className="text-muted-foreground">Manage your travel bookings and account settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From {completedBookings} completed booking{completedBookings !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Adventure{completedBookings !== 1 ? 's' : ''} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Upcoming adventure{pendingBookings !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest travel bookings and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading your bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your adventure by exploring our travel packages!
                  </p>
                  <Button asChild>
                    <a href="/packages">Explore Packages</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{booking.destinations?.title || 'Unknown Destination'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.destinations?.location} • {booking.destinations?.duration}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Booked on {new Date(booking.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${Number(booking.amount).toLocaleString()}</div>
                        <div className="mt-1">{getStatusBadge(booking.status)}</div>
                      </div>
                    </div>
                  ))}
                  {bookings.length > 5 && (
                    <Button variant="outline" onClick={() => setActiveTab('bookings')} className="w-full">
                      View All Bookings ({bookings.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Complete history of your travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading your bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your adventure by exploring our travel packages!
                  </p>
                  <Button asChild>
                    <a href="/packages">Explore Packages</a>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.destinations?.title || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">{booking.destinations?.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.destinations?.duration || 'N/A'}</TableCell>
                        <TableCell className="font-medium">${Number(booking.amount).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{new Date(booking.payment_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your bookings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">Control your data and privacy preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Account Status:</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Member Since:</span>
                    <span className="text-sm">{userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Login:</span>
                    <span className="text-sm">{userProfile?.last_login ? new Date(userProfile.last_login).toLocaleDateString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Logins:</span>
                    <span className="text-sm">{userProfile?.login_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;