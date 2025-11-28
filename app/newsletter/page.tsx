import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, SquareArrowOutUpRight } from "lucide-react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.newsletter

export default async function NewsletterPage() {
  const supabase = await createClient()

  const { data: newsletters, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching newsletters:", error)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Department Newsletter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest updates, announcements, and news from the Computer Science Department
          </p>
        </div>

        {newsletters && newsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-6 w-6 text-primary mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{newsletter.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(newsletter.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{newsletter.description}</CardDescription>
                  {newsletter.file_url && (
                    <a
                      href={newsletter.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Button
                      variant="secondary"
                      className="w-full bg-transparent flex items-center justify-center gap-2"
                      asChild
                      >
                      <>
                        <SquareArrowOutUpRight className="h-4 w-4" />
                        <span className="font-medium">Redirect</span>
                      </>
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No newsletters available</h3>
            <p className="text-muted-foreground">
              Check back later for the latest department updates and announcements.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
