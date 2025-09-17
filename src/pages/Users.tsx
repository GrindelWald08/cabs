import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users as UsersIcon, Plus, Search, Filter, MoreVertical, Mail, Calendar } from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-01-15",
    avatar: "/api/placeholder/40/40",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-02-20",
    avatar: "/api/placeholder/40/40",
    lastLogin: "1 day ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "User",
    status: "Inactive",
    joinDate: "2024-03-10",
    avatar: "/api/placeholder/40/40",
    lastLogin: "1 week ago",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2024-03-25",
    avatar: "/api/placeholder/40/40",
    lastLogin: "3 hours ago",
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    role: "User",
    status: "Active",
    joinDate: "2024-04-05",
    avatar: "/api/placeholder/40/40",
    lastLogin: "5 minutes ago",
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-destructive text-destructive-foreground";
    case "Editor":
      return "bg-warning text-warning-foreground";
    case "User":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  return status === "Active" 
    ? "bg-success text-success-foreground" 
    : "bg-muted text-muted-foreground";
};

export default function Users() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage your application users and their permissions.</p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name, email..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="w-3 h-3" />
                  <span>Last login {user.lastLogin}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">2,534</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">2,401</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">133</div>
            <div className="text-sm text-muted-foreground">Inactive Users</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">47</div>
            <div className="text-sm text-muted-foreground">New This Month</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}