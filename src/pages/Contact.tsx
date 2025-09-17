import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
      description: "Mon-Fri 9AM-6PM PST"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@travelapp.com", "support@travelapp.com"],
      description: "We reply within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["123 Travel Street", "San Francisco, CA 94102"],
      description: "Visit us for personalized planning"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM"],
      description: "Closed on Sundays"
    }
  ];

  const faqItems = [
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking 2-3 months in advance for the best availability and prices."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations made 30+ days before travel receive a full refund minus processing fees."
    },
    {
      question: "Do you offer travel insurance?",
      answer: "Yes, we partner with leading insurance providers to offer comprehensive travel protection."
    },
    {
      question: "Can you arrange custom itineraries?",
      answer: "Absolutely! We specialize in creating personalized travel experiences based on your preferences."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about your next adventure? Our travel experts are here to help you plan 
          the perfect trip. Get in touch and let's make your travel dreams come true.
        </p>
      </section>

      {/* Contact Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info) => (
          <Card key={info.title} className="text-center p-6">
            <info.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
            <CardTitle className="text-lg mb-3">{info.title}</CardTitle>
            <CardContent className="p-0 space-y-1">
              {info.details.map((detail, index) => (
                <div key={index} className="text-sm font-medium">{detail}</div>
              ))}
              <CardDescription className="text-xs mt-2">{info.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Contact Form and Map */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inquiryType">Type of Inquiry</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Information</SelectItem>
                  <SelectItem value="booking">Booking Assistance</SelectItem>
                  <SelectItem value="custom">Custom Trip Planning</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Tell us about your travel plans or questions..."
                rows={6}
              />
            </div>
            
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Map and Office Info */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Visit Our Office</CardTitle>
              <CardDescription>
                Drop by for personalized travel planning and expert advice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center text-6xl">
                🗺️
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  123 Travel Street, San Francisco, CA 94102
                </div>
                <div className="text-sm text-muted-foreground">
                  Located in the heart of downtown, easily accessible by public transport
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email Newsletter
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Emergency Support</h2>
        <p className="text-muted-foreground mb-6">
          For travelers currently on our tours needing immediate assistance
        </p>
        <Button variant="destructive" size="lg">
          <Phone className="w-4 h-4 mr-2" />
          Emergency Hotline: +1 (555) 911-HELP
        </Button>
      </section>
    </div>
  );
}