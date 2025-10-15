"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Edit, Trash2, Camera } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client" // Make sure this is a client-side supabase instance

export function AdminEventsList({ events }: { events: any[] }) {
  const [eventList, setEventList] = useState(events)
  const router = useRouter()

  async function handleDelete(id: any) {
    const supabase = createClient()
    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) {
      alert("Error deleting event: " + error.message)
    } else {
      setEventList(eventList.filter(e => e.id !== id))
    }
  }

  if (!eventList || eventList.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first event.</p>
          <Link href="/admin/events/new">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventList.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="aspect-video bg-card relative">
            {event.images && event.images.length > 0 ? (
              <Image src={event.images[0] || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{event.description}</CardDescription>
            {event.images && event.images.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {event.images.length} photo{event.images.length !== 1 ? "s" : ""} in this album
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}