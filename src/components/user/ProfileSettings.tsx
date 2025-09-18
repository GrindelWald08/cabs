import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logUserActivity, ACTIVITY_TYPES } from '@/lib/permissions';

const ProfileSettings: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    preferences: {
      newsletter: true,
      promotions: true,
    },
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        date_of_birth: userProfile.date_of_birth || '',
        preferences: {
          newsletter: userProfile.preferences?.newsletter ?? true,
          promotions: userProfile.preferences?.promotions ?? true,
        },
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('preferences.')) {
      const prefKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      toast({
        title: 'Error',
        description: 'User information not available. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth || null,
          preferences: formData.preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log the activity
      await logUserActivity(
        user.id,
        ACTIVITY_TYPES.PROFILE_UPDATE,
        'User updated profile information',
        {
          updated_fields: Object.keys(formData).filter(key => 
            formData[key as keyof typeof formData] !== userProfile[key as keyof typeof userProfile]
          ),
        }
      );

      // Refresh user profile
      await refreshUserProfile();

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p>Loading profile information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-muted"
                    placeholder="Email cannot be changed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="newsletter" className="text-sm font-normal">
                    Receive newsletter and travel updates
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="promotions"
                    checked={formData.preferences.promotions}
                    onChange={(e) => handleInputChange('preferences.promotions', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="promotions" className="text-sm font-normal">
                    Receive promotional offers and deals
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Reset form to original values
                  if (userProfile) {
                    setFormData({
                      full_name: userProfile.full_name || '',
                      email: userProfile.email || '',
                      phone: userProfile.phone || '',
                      date_of_birth: userProfile.date_of_birth || '',
                      preferences: {
                        newsletter: userProfile.preferences?.newsletter ?? true,
                        promotions: userProfile.preferences?.promotions ?? true,
                      },
                    });
                  }
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Your account activity and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userProfile.login_count || 0}</div>
              <div className="text-sm text-muted-foreground">Total Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {userProfile.created_at 
                  ? Math.floor((Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
                  : 0
                }
              </div>
              <div className="text-sm text-muted-foreground">Days Since Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold capitalize">{userProfile.status}</div>
              <div className="text-sm text-muted-foreground">Account Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold capitalize">{userProfile.role}</div>
              <div className="text-sm text-muted-foreground">Account Type</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;