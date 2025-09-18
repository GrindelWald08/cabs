import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Calendar } from "lucide-react";
import baliParadise from "@/assets/bali-paradise.jpg";
import tokyoAdventure from "@/assets/tokyo-adventure.jpg";
import swissAlps from "@/assets/swiss-alps.jpg";
import santoriniRomance from "@/assets/santorini-romance.jpg";
import africanSafari from "@/assets/african-safari.jpg";
import parisCulture from "@/assets/paris-culture.jpg";
import maldivesBeach from "@/assets/maldives-beach.jpg";
import icelandNorthernLights from "@/assets/iceland-northern-lights.jpg";
import amazonRainforest from "@/assets/amazon-rainforest.jpg";

export default function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Sunrise at Bali Temple",
      location: "Bali, Indonesia",
      category: "Cultural",
      date: "March 2024",
      image: baliParadise,
      description: "Beautiful sunrise view at Tanah Lot Temple"
    },
    {
      id: 2,
      title: "Tokyo Neon Nights",
      location: "Tokyo, Japan",
      category: "Urban",
      date: "February 2024",
      image: tokyoAdventure,
      description: "Vibrant nightlife in Shibuya district"
    },
    {
      id: 3,
      title: "Swiss Mountain Peak",
      location: "Interlaken, Switzerland",
      category: "Adventure",
      date: "January 2024",
      image: swissAlps,
      description: "Breathtaking view from Jungfraujoch"
    },
    {
      id: 4,
      title: "Santorini Blue Domes",
      location: "Santorini, Greece",
      category: "Romance",
      date: "March 2024",
      image: santoriniRomance,
      description: "Iconic blue domed churches of Oia"
    },
    {
      id: 5,
      title: "African Savanna",
      location: "Serengeti, Tanzania",
      category: "Wildlife",
      date: "February 2024",
      image: africanSafari,
      description: "Wildlife migration in Serengeti"
    },
    {
      id: 6,
      title: "Eiffel Tower Sunset",
      location: "Paris, France",
      category: "Cultural",
      date: "January 2024",
      image: parisCulture,
      description: "Golden hour at the Eiffel Tower"
    },
    {
      id: 7,
      title: "Maldives Crystal Waters",
      location: "Maldives",
      category: "Beach",
      date: "March 2024",
      image: maldivesBeach,
      description: "Crystal clear waters and overwater villas"
    },
    {
      id: 8,
      title: "Iceland Northern Lights",
      location: "Reykjavik, Iceland",
      category: "Adventure",
      date: "February 2024",
      image: icelandNorthernLights,
      description: "Aurora Borealis dancing in the sky"
    },
    {
      id: 9,
      title: "Amazon Rainforest",
      location: "Brazil",
      category: "Wildlife",
      date: "January 2024",
      image: amazonRainforest,
      description: "Lush rainforest and exotic wildlife"
    }
  ];

  const categories = ["All", "Cultural", "Urban", "Adventure", "Romance", "Wildlife", "Beach"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Travel Gallery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore stunning photography from our travelers around the world. Get inspired for your next adventure.
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group hover:shadow-elegant transition-smooth cursor-pointer">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth" />
              <Badge className="absolute top-4 right-4 bg-black/50 text-white border-0">
                {item.category}
              </Badge>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-smooth">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          <Camera className="w-4 h-4 mr-2" />
          Load More Photos
        </Button>
      </div>

      {/* Share Your Photos CTA */}
      <div className="text-center bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Share Your Travel Moments</h2>
        <p className="text-muted-foreground mb-6">
          Been on one of our trips? Share your photos and inspire other travelers!
        </p>
        <Button size="lg">
          <Camera className="w-4 h-4 mr-2" />
          Upload Your Photos
        </Button>
      </div>
    </div>
  );
}