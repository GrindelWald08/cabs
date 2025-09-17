import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Users, Plane, Camera, Mountain } from "lucide-react";

export default function TravelPackages() {
  const packages = [
    {
      id: 1,
      title: "Bali Cultural Heritage Tour",
      location: "Bali, Indonesia",
      price: "$1,299",
      originalPrice: "$1,599",
      rating: 4.8,
      reviews: 124,
      duration: "7 Days 6 Nights",
      maxGuests: 15,
      category: "Cultural",
      featured: true,
      image: "🏛️",
      highlights: ["Tanah Lot Temple", "Ubud Rice Terraces", "Traditional Dance Show", "Local Cooking Class"]
    },
    {
      id: 2,
      title: "Tokyo Modern City Adventure",
      location: "Tokyo, Japan",
      price: "$1,899",
      originalPrice: "$2,199",
      rating: 4.9,
      reviews: 89,
      duration: "10 Days 9 Nights",
      maxGuests: 12,
      category: "Urban",
      featured: true,
      image: "🏙️",
      highlights: ["Shibuya Crossing", "Mount Fuji Day Trip", "Sushi Making Class", "Robot Restaurant"]
    },
    {
      id: 3,
      title: "Swiss Alps Mountain Retreat",
      location: "Interlaken, Switzerland",
      price: "$2,299",
      originalPrice: "$2,699",
      rating: 4.7,
      reviews: 156,
      duration: "8 Days 7 Nights",
      maxGuests: 10,
      category: "Adventure",
      featured: false,
      image: "🏔️",
      highlights: ["Jungfraujoch Excursion", "Scenic Train Rides", "Alpine Hiking", "Lake Cruises"]
    },
    {
      id: 4,
      title: "Santorini Romantic Getaway",
      location: "Santorini, Greece",
      price: "$1,599",
      originalPrice: "$1,899",
      rating: 4.9,
      reviews: 203,
      duration: "6 Days 5 Nights",
      maxGuests: 8,
      category: "Romance",
      featured: false,
      image: "🏖️",
      highlights: ["Sunset in Oia", "Wine Tasting Tour", "Volcanic Island Tour", "Private Beach Access"]
    },
    {
      id: 5,
      title: "African Safari Experience",
      location: "Serengeti, Tanzania",
      price: "$3,499",
      originalPrice: "$3,999",
      rating: 4.8,
      reviews: 67,
      duration: "12 Days 11 Nights",
      maxGuests: 8,
      category: "Wildlife",
      featured: true,
      image: "🦁",
      highlights: ["Big Five Safari", "Maasai Village Visit", "Hot Air Balloon", "Luxury Lodge Stay"]
    },
    {
      id: 6,
      title: "Paris Art & Culture Tour",
      location: "Paris, France",
      price: "$1,799",
      originalPrice: "$2,099",
      rating: 4.6,
      reviews: 178,
      duration: "9 Days 8 Nights",
      maxGuests: 15,
      category: "Cultural",
      featured: false,
      image: "🗼",
      highlights: ["Louvre Museum", "Eiffel Tower Dinner", "Seine River Cruise", "Versailles Palace"]
    }
  ];

  const categories = ["All", "Cultural", "Urban", "Adventure", "Romance", "Wildlife"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Travel Packages</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our carefully curated travel packages designed to give you the best experiences around the world
        </p>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-elegant transition-smooth">
            {/* Package Image */}
            <div className="relative h-48 bg-gradient-subtle flex items-center justify-center text-6xl">
              {pkg.image}
              {pkg.featured && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-1">{pkg.title}</CardTitle>
                  <CardDescription className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pkg.location}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{pkg.category}</Badge>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </div>

              {/* Package Details */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Max {pkg.maxGuests}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Highlights */}
              <div>
                <h4 className="font-medium mb-2">Highlights:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Book Button */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    {pkg.originalPrice}
                  </span>
                  <div className="text-xs text-muted-foreground">per person</div>
                </div>
                <Button>Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6">
          Contact us to create a custom travel package tailored to your preferences
        </p>
        <Button size="lg">
          <Plane className="w-4 h-4 mr-2" />
          Create Custom Package
        </Button>
      </div>
    </div>
  );
}