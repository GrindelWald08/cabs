import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Key,
  Save,
  Upload,
  Plus
} from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences.</p>
        </div>
        <Button variant="hero">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Settings Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: User, label: "General", active: true },
                { icon: Shield, label: "Security", active: false },
                { icon: Bell, label: "Notifications", active: false },
                { icon: Palette, label: "Appearance", active: false },
                { icon: Database, label: "Data & Privacy", active: false },
                { icon: Key, label: "API Keys", active: false },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-smooth ${
                      item.active 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Update your application's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input 
                    id="app-name" 
                    placeholder="LaravelApp" 
                    defaultValue="LaravelApp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-url">Application URL</Label>
                  <Input 
                    id="app-url" 
                    placeholder="https://yourapp.com" 
                    defaultValue="https://laravelapp.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-description">Description</Label>
                <Textarea 
                  id="app-description" 
                  placeholder="Describe your application..."
                  defaultValue="A modern web application built with React and TypeScript, featuring a comprehensive admin dashboard and content management system."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@yourapp.com"
                  defaultValue="admin@laravelapp.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Authentication
              </CardTitle>
              <CardDescription>Configure security settings and user authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-success">Enabled</Badge>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Verification Required</Label>
                  <p className="text-sm text-muted-foreground">Require users to verify their email addresses</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Strong Password Policy</Label>
                  <p className="text-sm text-muted-foreground">Enforce minimum password requirements</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  placeholder="60" 
                  defaultValue="120"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose which notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "New User Registrations",
                  description: "Get notified when new users sign up",
                  enabled: true,
                },
                {
                  title: "New Article Comments",
                  description: "Notifications for comments on articles",
                  enabled: true,
                },
                {
                  title: "System Updates",
                  description: "Important system maintenance notifications",
                  enabled: true,
                },
                {
                  title: "Weekly Analytics Report",
                  description: "Receive weekly performance summaries",
                  enabled: false,
                },
                {
                  title: "Security Alerts",
                  description: "Notifications about security events",
                  enabled: true,
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{notification.title}</Label>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Manage API keys and integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Primary API Key</Label>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      value="sk_test_4eC39HqLyjWDarjtT1zdp7dc" 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created on September 15, 2024 • Last used 2 hours ago
                  </p>
                </div>

                <Button variant="outline">
                  <Plus className="w-4 h-4" />
                  Generate New API Key
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Rate Limiting</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate-limit" className="text-sm">Requests per minute</Label>
                    <Input 
                      id="rate-limit" 
                      type="number" 
                      defaultValue="1000"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="burst-limit" className="text-sm">Burst limit</Label>
                    <Input 
                      id="burst-limit" 
                      type="number" 
                      defaultValue="1500"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              Reset to Defaults
            </Button>
            <Button variant="hero">
              <Save className="w-4 h-4" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}