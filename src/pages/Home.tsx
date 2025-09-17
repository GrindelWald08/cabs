import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-hero rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Destinations</h1>
            <p className="text-xl mb-8 opacity-90">
              Explore the world's most beautiful places with our curated travel packages
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Bali Paradise",
              location: "Indonesia",
              price: "$1,299",
              rating: 4.8,
              duration: "7 Days",
              image: "🏝️"
            },
            {
              title: "Tokyo Adventure",
              location: "Japan",
              price: "$1,899",
              rating: 4.9,
              duration: "10 Days",
              image: "🗾"
            },
            {
              title: "Swiss Alps",
              location: "Switzerland",
              price: "$2,299",
              rating: 4.7,
              duration: "8 Days",
              image: "🏔️"
            }
          ].map((destination) => (
            <Card key={destination.title} className="overflow-hidden hover:shadow-elegant transition-smooth">
              <div className="h-48 bg-gradient-subtle flex items-center justify-center text-6xl">
                {destination.image}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {destination.title}
                  <span className="text-primary font-bold">{destination.price}</span>
                </CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.location}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {destination.rating}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {destination.duration}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose TravelApp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "Expert Guides",
              description: "Professional local guides with years of experience"
            },
            {
              icon: Star,
              title: "Top Rated",
              description: "Consistently rated 5 stars by our satisfied customers"
            },
            {
              icon: MapPin,
              title: "Best Locations",
              description: "Carefully curated destinations for unforgettable experiences"
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}