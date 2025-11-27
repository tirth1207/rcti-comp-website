"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Props {
  params: {
    id: string
    rid: string
  }
}

const RESOURCE_CATEGORIES = [
  "Notes",
  "Presentations",
  "Assignments",
  "Syllabus",
  "Resources",
  "Lab Manual",
  "Question Papers",
  "Reference Materials",
  "Other"
]

export default function EditResourcePage({ params }: Props) {
  const [subject, setSubject] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [category, setCategory] = useState("")
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      // Load subject
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", params.id)
        .single()

      if (subjectError) {
        console.error("Error loading subject:", subjectError)
        router.push("/admin/subjects")
        return
      }

      // Load resource
      const { data: resourceData, error: resourceError } = await supabase
        .from("resources")
        .select("*")
        .eq("id", params.rid)
        .single()

      if (resourceError) {
        console.error("Error loading resource:", resourceError)
        router.push(`/admin/subjects/${params.id}/resources`)
        return
      }

      setSubject(subjectData)
      setTitle(resourceData.title)
      setCategory(resourceData.category)
      setCurrentFileUrl(resourceData.file_url)
      setIsLoading(false)
    }

    loadData()
  }, [params.id, params.rid, router])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  const supabase = createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error("User not authenticated")

    if (!title.trim() || !category) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Update resource with Google Drive URL (no file upload)
    const { error } = await supabase
      .from("resources")
      .update({
        title: title.trim(),
        category,
        file_url: fileUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.rid)

    if (error) throw error

    router.push(`/admin/subjects/${params.id}/resources`)
    router.refresh()
  } catch (error) {
    console.error("Error updating resource:", error)
    alert("There was an error saving the resource. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", params.rid)

      if (error) throw error

      router.push(`/admin/subjects/${params.id}/resources`)
      router.refresh()
    } catch (error) {
      console.error("Error deleting resource:", error)
      alert("There was an error deleting the resource. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/subjects/${params.id}/resources`}>
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

  if (!subject) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Subject Not Found</h1>
          <Link href="/admin/subjects">
            <Button variant="outline">Back to Subjects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/admin/subjects/${params.id}/resources`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Resource</h1>
          <p className="text-muted-foreground">
            Editing resource for: <strong>{subject.name}</strong>
            {subject.code && <span> ({subject.code})</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
              <CardDescription>Update the information for this resource</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Resource Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Arrays - Lecture Notes"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUrl">Google Drive Link (Optional)</Label>
                  <Input
                    id="fileUrl"
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                  <p className="text-sm text-muted-foreground">Paste a Google Drive link to the material (optional)</p>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Updating..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Resource
                      </>
                    )}
                  </Button>
                  <Link href={`/admin/subjects/${params.id}/resources`}>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentFileUrl && (
                <a href={currentFileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Current File
                  </Button>
                </a>
              )}
              <Link href={`/course-materials/semester-${subject.semester}/${params.id}`} target="_blank">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Subject Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will permanently delete this resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Resource
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete the resource. This action cannot be undone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}