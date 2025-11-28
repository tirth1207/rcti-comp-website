import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Camera } from "lucide-react"
import Image from "next/image"
import { EventCarousel } from "@/components/carousel"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.events

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Events Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our vibrant department life through photos from various events, workshops, seminars, and
            celebrations
          </p>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="h-full overflow-hidden pb-6 pt-0">
                <div className="aspect-video bg-card relative">
                  {event.images && event.images.length > 0 ? (
                    <EventCarousel images={event.images} title={event.title} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{event.description}</CardDescription>
                  {event.images && event.images.length > 1 && (
                    <p className="text-sm text-muted-foreground">{event.images.length} photos in this album</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No events available</h3>
            <p className="text-muted-foreground">
              Event photos will be uploaded after department activities and celebrations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}