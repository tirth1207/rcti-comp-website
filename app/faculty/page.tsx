import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.faculty

export default async function FacultyPage() {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
  .from("faculty")
  .select("*")
  .order("designation", { ascending: true })
  .order("name", { ascending: true })


  if (error) {
    console.error("Error fetching faculty:", error)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Faculty Directory</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our experienced and dedicated faculty members who are committed to excellence in teaching and research
          </p>
        </div>

        {faculty && faculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member) => (
              <Card key={member.id} className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {member.photo_url ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={member.photo_url || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{member.designation}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  {member.qualification && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Qualification:</strong> {member.qualification}
                    </p>
                  )}
                  {member.contact && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{member.contact}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No faculty information available</h3>
            <p className="text-muted-foreground">Faculty profiles will be updated soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
