import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Helper function to parse semester info from slug
function parseSemesterSlug(slug: string) {
  const patterns = [
    {
      pattern: /^semester-(\d+)-(old|new)$/, handler: (match: RegExpMatchArray) => ({
        number: parseInt(match[1]),
        type: match[2] as 'old' | 'new'
      })
    },
    {
      pattern: /^semester-(\d+)$/, handler: (match: RegExpMatchArray) => ({
        number: parseInt(match[1]),
        type: 'regular' as const
      })
    }
  ]

  for (const { pattern, handler } of patterns) {
    const match = slug.match(pattern)
    if (match) {
      const result = handler(match)
      return {
        ...result,
        displayName: result.type === 'regular'
          ? `Semester ${result.number}`
          : `Semester ${result.number} (${result.type.toUpperCase()})`
      }
    }
  }

  return null
}

interface Subject {
  id: string
  name: string
  code: string | null
  semester: number
  created_at: string
}

interface Props {
  params: { slug: string }
}

export default async function SemesterSubjectsPage({ params }: Props) {
  const { slug } = params
  const semesterInfo = parseSemesterSlug(slug)
  // console.log('Parsed semester info:', semesterInfo)

  if (!semesterInfo) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Semester</h1>
              <p className="text-muted-foreground mb-4">The requested semester could not be found.</p>
              <Link href="/course-materials">
                <Button variant="outline">Browse All Materials</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Get subjects for this semester
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('semester', semesterInfo.number)
    .eq('old_new', semesterInfo.type.toLowerCase())
    .order('code')

  if (error) {
    console.error('Error fetching subjects:', error)
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-red-500">Error loading subjects. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {semesterInfo.displayName}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Course Subjects
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a subject to access study materials, notes, and resources
            </p>
          </div>
        </div>

        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/course-materials/${slug}/${subject.id}`}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2 line-clamp-2">
                          {subject.name}
                        </CardTitle>
                        {subject.code && (
                          <Badge variant="outline" className="text-xs">
                            {subject.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      Click to view study materials and resources for this subject
                    </CardDescription>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                      <span>View Materials</span>
                      <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Subjects Available
                </h3>
                <p className="text-muted-foreground mb-4">
                  No subjects have been added for {semesterInfo.displayName} yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Subjects will be added by faculty members.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you cannot find the materials you're looking for, please contact the faculty or administration.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
                <Link href="/feedback">
                  <Button variant="outline">Send Feedback</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}