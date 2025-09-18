import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, MapPin, Users, UserCheck, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { UserStatistics } from '@/types/auth';
import UserManagement from '@/components/admin/UserManagement';

interface Destination {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  duration: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  destinations?: { title: string };
}

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const { fetchUserStatistics } = useRoles();
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isDestinationDialogOpen, setIsDestinationDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [destinationForm, setDestinationForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    image_url: '',
  });

  useEffect(() => {
    if (isAdmin) {
      fetchDestinations();
      fetchPayments();
      loadUserStatistics();
    }
  }, [isAdmin]);

  const loadUserStatistics = async () => {
    const { data, error } = await fetchUserStatistics();
    if (error) {
      console.error('Error fetching user statistics:', error);
    } else {
      setUserStats(data);
    }
  };

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch destinations',
        variant: 'destructive',
      });
    } else {
      setDestinations(data || []);
    }
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        destinations(title)
      `)
      .order('payment_date', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payments',
        variant: 'destructive',
      });
    } else {
      setPayments(data || []);
      const total = data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      setTotalRevenue(total);
    }
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const destinationData = {
      ...destinationForm,
      price: parseFloat(destinationForm.price),
    };

    let error;
    if (editingDestination) {
      const { error: updateError } = await supabase
        .from('destinations')
        .update(destinationData)
        .eq('id', editingDestination.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('destinations')
        .insert([destinationData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingDestination ? 'update' : 'create'} destination`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Destination ${editingDestination ? 'updated' : 'created'} successfully`,
      });
      fetchDestinations();
      setIsDestinationDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteDestination = async (id: string) => {
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete destination',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Destination deleted successfully',
      });
      fetchDestinations();
    }
  };

  const openEditDialog = (destination: Destination) => {
    setEditingDestination(destination);
    setDestinationForm({
      title: destination.title,
      description: destination.description || '',
      price: destination.price.toString(),
      location: destination.location || '',
      duration: destination.duration || '',
      image_url: destination.image_url || '',
    });
    setIsDestinationDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDestination(null);
    setDestinationForm({
      title: '',
      description: '',
      price: '',
      location: '',
      duration: '',
      image_url: '',
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()}`}
          description="All-time revenue"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Users"
          value={userStats?.total_users || 0}
          description={`${userStats?.new_users_this_month || 0} new this month`}
          icon={Users}
        />
        <StatsCard
          title="Active Users"
          value={userStats?.active_users || 0}
          description="Currently active accounts"
          icon={UserCheck}
        />
        <StatsCard
          title="Admin Users"
          value={userStats?.admin_users || 0}
          description="System administrators"
          icon={Activity}
        />
      </div>

      <Tabs defaultValue="destinations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="destinations">

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Destinations</CardTitle>
                  <CardDescription>Manage travel destinations</CardDescription>
                </div>
                <Dialog open={isDestinationDialogOpen} onOpenChange={setIsDestinationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Destination
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingDestination ? 'Edit Destination' : 'Add New Destination'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingDestination ? 'Update the destination details.' : 'Create a new travel destination.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveDestination}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={destinationForm.title}
                            onChange={(e) => setDestinationForm({ ...destinationForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={destinationForm.description}
                            onChange={(e) => setDestinationForm({ ...destinationForm, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={destinationForm.price}
                            onChange={(e) => setDestinationForm({ ...destinationForm, price: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={destinationForm.location}
                            onChange={(e) => setDestinationForm({ ...destinationForm, location: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            value={destinationForm.duration}
                            onChange={(e) => setDestinationForm({ ...destinationForm, duration: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image_url">Image URL</Label>
                          <Input
                            id="image_url"
                            value={destinationForm.image_url}
                            onChange={(e) => setDestinationForm({ ...destinationForm, image_url: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingDestination ? 'Update' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell className="font-medium">{destination.title}</TableCell>
                      <TableCell>{destination.location}</TableCell>
                      <TableCell>${destination.price}</TableCell>
                      <TableCell>{destination.duration}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(destination)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDestination(destination.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Overview of all payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>Customer</TableCell>
                      <TableCell>{payment.destinations?.title || 'Unknown'}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;