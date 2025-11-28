import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Download, FileText, SquareArrowOutUpRightIcon } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.studentCorner

export default async function StudentCornerPage() {
  const supabase = await createClient()

  const { data: notices, error } = await supabase
    .from("students_corner")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching student notices:", error)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Student Corner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Important notices, results, scholarship information, and announcements for students
          </p>
        </div>

        {notices && notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((notice) => (
              <Card key={notice.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <Bell className="h-6 w-6 text-accent mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{notice.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(notice.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 whitespace-pre-wrap">{notice.description}</CardDescription>
                  {notice.file_url && (
                    <Link href={notice.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full bg-transparent" >
                      
                      <SquareArrowOutUpRightIcon className="h-4 w-4 mr-2" />
                      View Attachment
                      </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No notices available</h3>
            <p className="text-muted-foreground">Check back later for important student announcements and notices.</p>
          </div>
        )}
      </div>
    </div>
  )
}
