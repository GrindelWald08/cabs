import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, DollarSign, Plus, Activity, Eye, MessageSquare } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,534",
    description: "Active registered users",
    icon: Users,
    trend: { value: 12.5, isPositive: true },
  },
  {
    title: "Articles",
    value: "1,247",
    description: "Published articles",
    icon: FileText,
    trend: { value: 8.2, isPositive: true },
  },
  {
    title: "Page Views",
    value: "45.2K",
    description: "This month",
    icon: Eye,
    trend: { value: 23.1, isPositive: true },
  },
  {
    title: "Revenue",
    value: "$12,847",
    description: "Monthly revenue",
    icon: DollarSign,
    trend: { value: -3.2, isPositive: false },
  },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "published a new article",
    title: "Getting Started with Laravel 12",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "updated user profile",
    title: "Profile settings",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "left a comment on",
    title: "React Best Practices",
    time: "6 hours ago",
  },
  {
    id: 4,
    user: "Emma Davis",
    action: "created a new account",
    title: "New user registration",
    time: "8 hours ago",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your application.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="w-4 h-4" />
            View Reports
          </Button>
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions from your users and content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                      <span className="font-semibold">{activity.title}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4" />
              Create New Article
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4" />
              View Comments
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4" />
              Analytics Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>Traffic and engagement metrics for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">Performance Chart</p>
              <p className="text-muted-foreground">Chart visualization would go here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}