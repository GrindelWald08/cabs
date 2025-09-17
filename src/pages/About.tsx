import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Award, Globe, Heart, MapPin, Star, Plane } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Users, label: "Happy Travelers", value: "10,000+" },
    { icon: Globe, label: "Destinations", value: "50+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Star, label: "Average Rating", value: "4.9/5" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      experience: "15 years in travel industry",
      specialty: "Adventure Travel",
      image: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Travel Director",
      experience: "12 years guiding tours",
      specialty: "Cultural Tours",
      image: "👨‍💼"
    },
    {
      name: "Elena Rodriguez",
      role: "Operations Manager",
      experience: "10 years in hospitality",
      specialty: "Luxury Travel",
      image: "👩‍💼"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We live and breathe travel, bringing you authentic experiences that create lasting memories."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to ensure your trip exceeds expectations."
    },
    {
      icon: Globe,
      title: "Sustainable Tourism",
      description: "We're committed to responsible travel that benefits local communities and preserves destinations."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Continuously striving for perfection in every aspect of your travel experience."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About TravelApp</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          For over 15 years, we've been crafting extraordinary travel experiences that connect people 
          with the world's most amazing destinations. Our passion is turning your travel dreams into reality.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center p-6">
            <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              TravelApp was born from a simple belief: travel has the power to transform lives. 
              Founded in 2009 by Sarah Johnson, a passionate traveler who had explored over 60 countries, 
              our company started with a mission to make extraordinary travel accessible to everyone.
            </p>
            <p>
              What began as a small boutique travel agency has grown into a trusted partner for thousands 
              of travelers worldwide. We've maintained our personal touch while expanding our reach, 
              always focusing on creating authentic, meaningful experiences rather than just trips.
            </p>
            <p>
              Today, we're proud to be one of the leading travel companies, recognized for our commitment 
              to excellence, sustainability, and customer satisfaction. Every journey we plan is crafted 
              with the same care and attention to detail that has made us who we are.
            </p>
          </div>
        </div>
        <div className="relative h-96 bg-gradient-hero rounded-lg flex items-center justify-center text-9xl">
          ✈️
        </div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="text-center p-6">
              <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-xl mb-3">{value.title}</CardTitle>
              <CardDescription>{value.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="text-center p-6">
              <div className="text-6xl mb-4">{member.image}</div>
              <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
              <Badge variant="secondary" className="mb-3">{member.role}</Badge>
              <CardDescription className="space-y-2">
                <div>{member.experience}</div>
                <div className="flex items-center justify-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  Specialty: {member.specialty}
                </div>
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Awards & Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Best Travel Agency 2023</h3>
            <p className="text-muted-foreground">Travel Industry Awards</p>
          </div>
          <div className="text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Excellence in Service</h3>
            <p className="text-muted-foreground">Customer Choice Awards</p>
          </div>
          <div className="text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Sustainable Tourism Leader</h3>
            <p className="text-muted-foreground">Global Travel Awards</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-hero text-white rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of satisfied travelers who have trusted us with their dream vacations
        </p>
        <Button size="lg" variant="secondary">
          <Plane className="w-4 h-4 mr-2" />
          Plan Your Trip Today
        </Button>
      </section>
    </div>
  );
}