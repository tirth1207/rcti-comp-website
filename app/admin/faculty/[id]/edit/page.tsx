"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface EditFacultyPageProps {
  params: {
    id: string
  }
}

export default function EditFacultyPage({ params }: EditFacultyPageProps) {
  const [name, setName] = useState("")
  const [designation, setDesignation] = useState("")
  const [qualification, setQualification] = useState("")
  const [contact, setContact] = useState("")
  const [bio, setBio] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadFaculty = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.from("faculty").select("*").eq("id", params.id).single()


      if (error) {
        console.error("Error loading faculty:", error)
        router.push("/admin/faculty")
        return
      }

      setName(data.name)
      setDesignation(data.designation)
      setQualification(data.qualification || "")
      setContact(data.contact || "")
      setBio(data.bio || "")
      setCurrentPhotoUrl(data.photo_url)
      setIsLoading(false)
    }

    loadFaculty()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      let photoUrl = currentPhotoUrl

      // Upload new photo if provided
      if (photo) {
        const fileExt = photo.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("faculty-photos").upload(fileName, photo)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("faculty-photos").getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      // Update faculty
      const { error } = await supabase
        .from("faculty")
        .update({
          name,
          designation,
          qualification,
          contact,
          //bio,
          photo_url: photoUrl,
        })
        .eq("id", params.id)

      if (error) throw error

      router.push("/admin/faculty")
    } catch (error) {
      console.error("Error updating faculty:", error)
      alert("There was an error updating the faculty member. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/faculty">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/faculty">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Faculty Member</h1>
          <p className="text-muted-foreground">Update faculty member information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Details</CardTitle>
          <CardDescription>Update the information for this faculty member</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g., Professor, Associate Professor, Assistant Professor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g., Ph.D. in Computer Science, M.Tech"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Email</Label>
              <Input
                id="contact"
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter faculty bio or description"
                rows={4}
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="photo">Profile Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
              {currentPhotoUrl && (
                <p className="text-sm text-muted-foreground">
                  Current photo:{" "}
                  <a
                    href={currentPhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View current photo
                  </a>
                </p>
              )}
              <p className="text-sm text-muted-foreground">Upload a new photo to replace the current one (optional)</p>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Faculty
                  </>
                )}
              </Button>
              <Link href="/admin/faculty">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
