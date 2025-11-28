import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AVAILABLE_SEMESTERS } from "@/utils/semesterUtils"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.coursesMaterials

export default function CourseMaterialsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Course Materials</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive study materials, notes, presentations, and resources organized by semester
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {AVAILABLE_SEMESTERS.map((semester) => (
            <Link key={semester.slug} href={`/course-materials/${semester.slug}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {semester.displayName}
                  </CardTitle>
                  <CardDescription>
                    Browse subjects and study materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                    <span>View Subjects</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Information Section */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <p className="text-sm text-muted-foreground">
                  Select your semester from the grid above
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <p className="text-sm text-muted-foreground">
                  Choose the subject you want to study
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <p className="text-sm text-muted-foreground">
                  Access notes, presentations, and other materials
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Available Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Lecture Notes & Study Materials</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Presentations & Slides</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Assignments & Practice Sets</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Syllabus & Curriculum</span>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Help Section */}
        {/* <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                If you cannot find the materials you're looking for or encounter any issues, please don't hesitate to reach out.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/contact">
                  <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <CardTitle className="text-sm mb-1">Contact Faculty</CardTitle>
                      <CardDescription className="text-xs">Get help from professors</CardDescription>
                    </div>
                  </Card>
                </Link>
                <Link href="/feedback">
                  <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <CardTitle className="text-sm mb-1">Send Feedback</CardTitle>
                      <CardDescription className="text-xs">Request new materials</CardDescription>
                    </div>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}