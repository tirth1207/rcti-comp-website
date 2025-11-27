"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { AVAILABLE_SEMESTERS } from "@/utils/semesterUtils"

interface EditSubjectPageProps {
  params: {
    id: string
  }
}

export default function EditSubjectPage({ params }: EditSubjectPageProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [semester, setSemester] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Get unique semester numbers for the dropdown
  const SEMESTER_OPTIONS = [
    { value: "1-OLD", label: "Semester 1 (OLD)" },
    { value: "1-NEP", label: "Semester 1 (NEP)" },

    { value: "2-OLD", label: "Semester 2 (OLD)" },
    { value: "2-NEP", label: "Semester 2 (NEP)" },

    { value: "3-OLD", label: "Semester 3 (OLD)" },
    { value: "3-NEP", label: "Semester 3 (NEP)" },

    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
  ]
  const formatOldNew = (value: string | null) => {
    if (!value) return null
    if (value.toLowerCase() === "new") return "NEP"
    if (value.toLowerCase() === "old") return "OLD"
    return value.toUpperCase()
  }

  useEffect(() => {
    const loadSubject = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error loading subject:", error)
        router.push("/admin/subjects")
        return
      }
      console.log(data)
      setName(data.name)
      setCode(data.code || "")
      setSemester(
        data.old_new
          ? `${data.semester}-${formatOldNew(data.old_new)}`
          : `${data.semester}`
      )
      setIsLoading(false)
    }
    
    console.log(semester)
    loadSubject()
  }, [params.id, router])
  

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    

    if (!name.trim() || !semester) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()
    const [semValue, flag] = semester.split("-")

    const normalizedOldNew =
      flag?.toLowerCase() === "nep"
        ? "new"
        : flag?.toLowerCase() === "old"
        ? "old"
        : null
    try {
      const { error } = await supabase
        .from("subjects")
        .update({
          name: name.trim(),
          code: code.trim() || null,
          semester: parseInt(semValue),
          old_new: normalizedOldNew
        })
        .eq("id", params.id)

      if (error) throw error

      router.push("/admin/subjects")
      router.refresh()
    } catch (error) {
      console.error("Error updating subject:", error)
      alert("There was an error updating the subject. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subject? This will also delete all associated resources. This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      // First delete all resources associated with this subject
      const { error: resourcesError } = await supabase
        .from("resources")
        .delete()
        .eq("subject_id", params.id)

      if (resourcesError) throw resourcesError

      // Then delete the subject
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", params.id)

      if (error) throw error

      router.push("/admin/subjects")
      router.refresh()
    } catch (error) {
      console.error("Error deleting subject:", error)
      alert("There was an error deleting the subject. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/subjects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
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
        <Link href="/admin/subjects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Subject</h1>
          <p className="text-muted-foreground">Update subject information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject Details</CardTitle>
              <CardDescription>Update the information for this subject</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Subject Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Data Structures and Algorithms"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g., CS301, IT205"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">
                    Semester <span className="text-destructive">*</span>
                  </Label>
                  <Select value={semester} onValueChange={setSemester} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Updating..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Subject
                      </>
                    )}
                  </Button>
                  <Link href="/admin/subjects">
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
              <Link href={`/admin/subjects/${params.id}/resources`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Manage Resources
                </Button>
              </Link>
              <Link href={`/course-materials/semester-${semester}/${params.id}`} target="_blank">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Public Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will permanently delete this subject
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
                    Delete Subject
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete the subject and all associated resources. This action cannot be undone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}