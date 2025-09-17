import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Plus, Search, Filter, Eye, MessageSquare, Heart, Calendar, User } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Getting Started with Laravel 12: New Features and Improvements",
    excerpt: "Explore the latest features in Laravel 12 including improved routing, enhanced security, and better performance optimizations.",
    author: {
      name: "John Doe",
      avatar: "/api/placeholder/32/32",
    },
    category: "Laravel",
    status: "Published",
    publishDate: "2024-09-15",
    views: 1247,
    comments: 23,
    likes: 89,
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "React Best Practices for Modern Web Development",
    excerpt: "Learn the essential React patterns and practices that will make your code more maintainable and performant.",
    author: {
      name: "Sarah Wilson",
      avatar: "/api/placeholder/32/32",
    },
    category: "React",
    status: "Published",
    publishDate: "2024-09-12",
    views: 2156,
    comments: 45,
    likes: 156,
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js and Express",
    excerpt: "A comprehensive guide to creating robust, scalable APIs using Node.js, Express, and modern development practices.",
    author: {
      name: "Mike Johnson",
      avatar: "/api/placeholder/32/32",
    },
    category: "Node.js",
    status: "Draft",
    publishDate: "2024-09-10",
    views: 0,
    comments: 0,
    likes: 0,
    readTime: "15 min read",
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt: "Understanding the differences between CSS Grid and Flexbox, and when each layout method is most appropriate.",
    author: {
      name: "Emma Davis",
      avatar: "/api/placeholder/32/32",
    },
    category: "CSS",
    status: "Published",
    publishDate: "2024-09-08",
    views: 1876,
    comments: 34,
    likes: 134,
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Database Optimization Techniques for High Traffic Applications",
    excerpt: "Learn advanced database optimization strategies to handle high traffic loads and improve application performance.",
    author: {
      name: "Alex Thompson",
      avatar: "/api/placeholder/32/32",
    },
    category: "Database",
    status: "Review",
    publishDate: "2024-09-05",
    views: 0,
    comments: 2,
    likes: 12,
    readTime: "20 min read",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-success text-success-foreground";
    case "Draft":
      return "bg-muted text-muted-foreground";
    case "Review":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    Laravel: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    React: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Node.js": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CSS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Database: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};

export default function Articles() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground">Manage your content library and published articles.</p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles by title, content, or author..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter by Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-6">
        {articles.map((article) => (
          <Card key={article.id} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary cursor-pointer transition-smooth">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Author and Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={article.author.avatar} alt={article.author.name} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {article.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{article.author.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.publishDate}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{article.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{article.likes} likes</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:w-32">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 lg:flex-none">
                    Preview
                  </Button>
                  {article.status === "Published" && (
                    <Button variant="ghost" size="sm" className="flex-1 lg:flex-none">
                      Analytics
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">247</div>
            <div className="text-sm text-muted-foreground">Total Articles</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">189</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">43</div>
            <div className="text-sm text-muted-foreground">In Draft</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">15</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}