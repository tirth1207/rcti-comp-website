import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ChevronLeft,
  ExternalLink,
  FileText,
  Presentation,
  FileImage,
  File,
} from "lucide-react"
import Link from "next/link"

// Parse semester information from slug
function parseSemesterSlug(slug: string) {
  const patterns = [
    {
      pattern: /^semester-(\d+)-(old|new)$/,
      handler: (match: RegExpMatchArray) => ({
        number: Number.parseInt(match[1]),
        type: match[2] as "old" | "new",
      }),
    },
    {
      pattern: /^semester-(\d+)$/,
      handler: (match: RegExpMatchArray) => ({
        number: Number.parseInt(match[1]),
        type: "regular" as const,
      }),
    },
  ]

  for (const { pattern, handler } of patterns) {
    const match = slug.match(pattern)
    if (match) {
      const result = handler(match)
      return {
        ...result,
        displayName:
          result.type === "regular"
            ? `Semester ${result.number}`
            : `Semester ${result.number} (${result.type.toUpperCase()})`,
      }
    }
  }

  return null
}

// Select icon based on file extension
function getFileIcon(fileName: string | null, category: string) {
  if (!fileName) return File

  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return FileText
    case "ppt":
    case "pptx":
      return Presentation
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return FileImage
    default:
      switch (category.toLowerCase()) {
        case "notes":
        case "syllabus":
          return FileText
        case "presentations":
          return Presentation
        default:
          return File
      }
  }
}

function getCategoryColor(category: string) {
  const colors = {
    notes: "bg-blue-50 text-blue-700 border-blue-200",
    presentations: "bg-green-50 text-green-700 border-green-200",
    assignments: "bg-orange-50 text-orange-700 border-orange-200",
    syllabus: "bg-purple-50 text-purple-700 border-purple-200",
    resources: "bg-indigo-50 text-indigo-700 border-indigo-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  }

  return colors[category.toLowerCase() as keyof typeof colors] || colors.default
}

interface Resource {
  id: string
  subject_id: string
  category: string
  title: string
  file_url: string | null
  created_at: string
}

const MAIN_CATEGORIES = {
  "Curriculum": [
    "Syllabus",
  ],

  "Course Material": [
    "Resources",
    "Reference Materials",
    "Other",
    "Notes",
    "Presentations",
  ],

  "Lab Resources": [
    "Lab Manual",
  ],

  "Learning Exercises": [
    "Assignments",
    "Assignments Rubrics",
    "Suggested List of Microprojects",
    "Microporject Rubrics",
    "Question Bank",
    "Internal Viva Questions",
    "GTU Question Papers",
    "Question Papers",
    "Diary Format",
    "Cover Pages",
  ],
}


function mapToMainCategory(category: string): string {
  for (const mainCategory in MAIN_CATEGORIES) {
    if (MAIN_CATEGORIES[mainCategory as keyof typeof MAIN_CATEGORIES].includes(category)) {
      return mainCategory
    }
  }
  return "Course Material"
}

export default async function SubjectResourcesPage({ params }: { params: { slug: string; subject: string } }) {
  const { slug, subject: subjectId } = params

  const semesterInfo = parseSemesterSlug(slug)
  if (!semesterInfo) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Semester</h1>
              <p className="text-muted-foreground mb-4">The requested semester could not be found.</p>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch subject details
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .single()

  if (subjectError || !subject) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Subject Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested subject could not be found.</p>
              <Link href={`/course-materials/${slug}`}>
                <Button variant="outline">Back to Semester</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Fetch resources
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("subject_id", subjectId)
    .order("category")
    .order("created_at", { ascending: false })

  // Group by category
  const resourcesByCategory: Record<string, Resource[]> = {}
  resources?.forEach((resource) => {
    const category = resource.category || "Other"
    if (!resourcesByCategory[category]) {
      resourcesByCategory[category] = []
    }
    resourcesByCategory[category].push(resource)
  })

  const resourcesByMainCategory: Record<string, Resource[]> = {
    Curriculum: [],
    "Course Material": [],
    "Lab Resources": [],
    "Learning Exercises": [],
  }

  Object.entries(resourcesByCategory).forEach(([category, list]) => {
    resourcesByMainCategory[mapToMainCategory(category)].push(...list)
  })

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>

            <Link href={`/course-materials/${slug}`}>
              <Button variant="ghost" size="sm" title={semesterInfo.displayName}>
                <span className="truncate">{semesterInfo.displayName}</span>
              </Button>
            </Link>

            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate">{subject.name}</span>
          </nav>

          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Badge variant="secondary">{semesterInfo.displayName}</Badge>
              {subject.code && <Badge variant="outline">{subject.code}</Badge>}
            </div>
            <h1 className="text-4xl font-bold mb-4">{subject.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Study materials, notes, and resources for this subject.
            </p>
          </div>
        </div>

        {/* Content */}
        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(resourcesByMainCategory).map(([mainCategory, list]) => (
              <div key={mainCategory}>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold">{mainCategory}</h2>
                  <Badge variant="outline" className="ml-3">
                    {list.length} {list.length === 1 ? "item" : "items"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {list.length > 0 ? (
                    list.map((resource) => {
                      const IconComponent = getFileIcon(resource.file_url, resource.category)
                      const categoryColorClass = getCategoryColor(resource.category)

                      return resource.file_url ? (
                        <a
                          key={resource.id}
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="hover:shadow-lg cursor-pointer transition-all py-0">
                            <CardHeader className="flex flex-row items-center justify-between p-4">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${categoryColorClass}`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-base line-clamp-1">{resource.title}</CardTitle>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {resource.category}
                                  </Badge>
                                </div>
                              </div>

                              <ExternalLink className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                          </Card>
                        </a>
                      ) : (
                        <Card key={resource.id} className="opacity-60">
                          <CardHeader className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${categoryColorClass}`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-base line-clamp-1">{resource.title}</CardTitle>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {resource.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs mt-2">
                              No file
                            </Badge>
                          </CardHeader>
                        </Card>
                      )
                    })
                  ) : (
                    <Card className="text-center py-6">
                      <CardContent>
                        <p className="text-muted-foreground text-sm">No items in this category.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No Resources Available</h3>
                <p className="text-muted-foreground mt-2">
                  No study materials have been uploaded yet.
                </p>
                <Link href={`/course-materials/${slug}`}>
                  <Button className="mt-6" variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Subjects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Need More Resources?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                If you need additional study materials, feel free to contact faculty.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/contact">
                  <Button variant="outline">Contact Faculty</Button>
                </Link>
                <Link href="/feedback">
                  <Button variant="outline">Request Materials</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
