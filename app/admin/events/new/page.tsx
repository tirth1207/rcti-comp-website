"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleImageUrlChange = (idx: number, value: string) => {
    setImageUrls((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const addImageField = () => setImageUrls((prev) => [...prev, ""]);
  const removeImageField = (idx: number) => setImageUrls((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const supabase = createClient();
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      // Insert event
      const { error } = await supabase.from("events").insert([
        {
          title: title.trim(),
          description: description.trim() || null,
          images: imageUrls.filter((url) => url.trim() !== ""),
          date: date ? new Date(date).toISOString().split("T")[0] : null,
          location: location.trim() || null,
          created_by: user.id,
        },
      ]);
      if (error) throw error;
      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      console.log("error", error)
      alert("There was an error creating the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Event</h1>
          <p className="text-muted-foreground">Create a new event for the department</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Fill in the information for the new event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Image URLs (Google Drive or direct links)</Label>
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex space-x-2 mb-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                  {imageUrls.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => removeImageField(idx)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addImageField}>
                Add Another Image
              </Button>
              <p className="text-sm text-muted-foreground">Paste one or more Google Drive or direct image links for the event (optional)</p>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
              <Link href="/admin/events">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
