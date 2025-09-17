import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, Clock, Download, Filter, Calendar } from "lucide-react";

const analyticsStats = [
  {
    title: "Page Views",
    value: "156.2K",
    description: "Total page views",
    icon: Eye,
    trend: { value: 12.5, isPositive: true },
  },
  {
    title: "Unique Visitors",
    value: "23.4K",
    description: "Unique users",
    icon: Users,
    trend: { value: 8.2, isPositive: true },
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    description: "Average session duration",
    icon: Clock,
    trend: { value: 15.7, isPositive: true },
  },
  {
    title: "Bounce Rate",
    value: "32.1%",
    description: "Users leaving quickly",
    icon: TrendingUp,
    trend: { value: -5.3, isPositive: true },
  },
];

const topPages = [
  { page: "/articles/laravel-12-features", views: 12543, percentage: 78 },
  { page: "/articles/react-best-practices", views: 9876, percentage: 62 },
  { page: "/dashboard", views: 8234, percentage: 51 },
  { page: "/articles/nodejs-apis", views: 6789, percentage: 42 },
  { page: "/users", views: 5432, percentage: 34 },
];

const topReferrers = [
  { source: "Google Search", visitors: 8945, percentage: 65 },
  { source: "Direct Traffic", visitors: 3234, percentage: 23 },
  { source: "Social Media", visitors: 1876, percentage: 14 },
  { source: "Email Campaigns", visitors: 987, percentage: 7 },
  { source: "Other", visitors: 654, percentage: 5 },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your application's performance and user engagement.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="hero">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Traffic Overview
            </CardTitle>
            <CardDescription>Visitor trends over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Traffic Chart</p>
                <p className="text-muted-foreground">Interactive chart would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Visitor device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground">Device Chart</p>
                <p className="text-muted-foreground">Pie chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{page.page}</p>
                    <p className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-border rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">
                      {page.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{referrer.source}</p>
                    <p className="text-sm text-muted-foreground">{referrer.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-border rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${referrer.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">
                      {referrer.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Real-time Activity
          </CardTitle>
          <CardDescription>Live visitor activity on your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-subtle rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">47</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-xs text-success mt-1">+12 from last hour</div>
            </div>
            <div className="text-center p-6 bg-gradient-subtle rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">156</div>
              <div className="text-sm text-muted-foreground">Page Views (Last Hour)</div>
              <div className="text-xs text-success mt-1">+23% increase</div>
            </div>
            <div className="text-center p-6 bg-gradient-subtle rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">4.2s</div>
              <div className="text-sm text-muted-foreground">Avg Load Time</div>
              <div className="text-xs text-success mt-1">-0.3s improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}