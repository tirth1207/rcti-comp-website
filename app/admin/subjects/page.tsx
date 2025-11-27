"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, BookOpen, Edit, Trash2, Users } from "lucide-react"

interface Subject {
  id: string
  name: string
  code?: string
  semester: number
  old_new: string
  created_at: string
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch subjects from Supabase
  useEffect(() => {
    async function fetchSubjects() {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("semester", { ascending: true })
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching subjects:", error)
      } else {
        setSubjects(data as Subject[])
      }
      setLoading(false)
    }

    fetchSubjects()
  }, [])

  // Delete subject with confirmation
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this subject?")
    if (!confirmed) return

    const supabase = await createClient()
    const { error } = await supabase.from("subjects").delete().eq("id", id)
    if (error) {
      alert("Failed to delete subject: " + error.message)
    } else {
      setSubjects((prev) => prev.filter((subj) => subj.id !== id))
    }
  }
  
  function toTitleCase(str: string) {
    if (!str) return ""
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  // Group subjects by semester
  const subjectsBySemester =
    subjects.reduce((acc, subject) => {
      if (!acc[subject.semester]) acc[subject.semester] = []
      acc[subject.semester].push(subject)
      return acc
    }, {} as Record<number, Subject[]>) || {}

  if (loading) return <p>Loading subjects...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects Management</h1>
          <p className="text-muted-foreground">Manage subjects and course curriculum</p>
        </div>
        <Link href="/admin/subjects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semesters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(subjectsBySemester).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      {Object.keys(subjectsBySemester).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(subjectsBySemester)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([semester, semesterSubjects]) => (
              <div key={semester}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Semester {semester}</h2>
                  <Badge variant="outline">
                    {semesterSubjects.length} subject{semesterSubjects.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semesterSubjects.map((subject) => (
                    <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <BookOpen className="h-5 w-5 text-primary mt-1" />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg line-clamp-2">{subject.name}</CardTitle>
                              {subject.code && (
                                <CardDescription className="font-medium text-primary">
                                  {subject.code}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Link href={`/admin/subjects/${subject.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(subject.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            Semester {subject.semester} - {toTitleCase(subject.old_new)}
                          </Badge>
                          <Link href={`/admin/subjects/${subject.id}/resources`}>
                            <Button variant="outline" size="sm">
                              Manage Resources
                            </Button>
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Created: {new Date(subject.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first subject.</p>
            <Link href="/admin/subjects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
