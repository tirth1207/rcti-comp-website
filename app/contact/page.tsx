import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.contact

// Add these styles at the top or import them from a CSS file
const mapStyles = `
.embed-map-responsive {
  position: relative;
  text-align: right;
  width: 100%;
  height: 0;
  padding-bottom: 66.66666666666666%;
}
.embed-map-container {
  overflow: hidden;
  background: none !important;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.embed-map-frame {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
}
`;

export default function ContactPage() {
  return (
    <>
      <style>{mapStyles}</style>
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get in touch with the Computer Science Department for inquiries, admissions, or any other information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Department Information</CardTitle>
                  <CardDescription>
                    Find us at our campus location or reach out through any of the following channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground">
                        Opp Sola Civil Hospital, Near Gujarat High Court
                         <br />
                        S.G.Highway,Sola, Ahmedabad - 380060
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div> */}

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Office Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 10:30 AM - 6:10 PM
                        <br />
                        Saturday: 10:30 AM - 5:00 PM (Working Saturday)
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground"><a href="mailto:computer.rcti640@gmail.com">computer.rcti640@gmail.com</a></p>
                </CardContent>
              </Card>
            </div>

            {/* Map and Contact Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
                    <div className="embed-map-responsive">
                      <div className="embed-map-container">
                        <iframe
                          className="embed-map-frame"
                          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=R.C.%20Technical%20institute&t=p&z=16&ie=UTF8&iwloc=B&output=embed"
                          allowFullScreen
                          aria-label="Google Map"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                {/* <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Have a question or inquiry? Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Enter the subject" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Enter your message" rows={6} />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent> */}
                <ContactForm />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}