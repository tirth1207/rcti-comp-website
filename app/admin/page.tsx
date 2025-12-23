import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, FileText, BookOpen, Calendar, MessageSquare, Bell, Plus, TrendingUp } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  // Get user profile to check role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user?.id).single()

  // Get dashboard statistics
  const [
    { count: newsletterCount },
    { count: materialCount },
    { count: eventCount },
    { count: subjectsCount },
    { count: facultyCount },
    { count: noticeCount },
  ] = await Promise.all([
    supabase.from("newsletters").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("subjects").select("*", { count: "exact", head: true }),
    supabase.from("faculty").select("*", { count: "exact", head: true }),
    supabase.from("students_corner").select("*", { count: "exact", head: true }),
  ])

  // Get recent feedback
  const { data: recentFeedback } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const dashboardCards = [
    {
      title: "Newsletters",
      count: newsletterCount || 0,
      icon: FileText,
      href: "/admin/newsletters",
      color: "text-blue-600",
      description: "Published newsletters",
    },
    {
      title: "Course Materials",
      count: materialCount || 0,
      icon: BookOpen,
      href: "/admin/subjects",
      color: "text-green-600",
      description: "Uploaded materials",
    },
    {
      title: "Events",
      count: eventCount || 0,
      icon: Calendar,
      href: "/admin/events",
      color: "text-purple-600",
      description: "Department events",
    },
    {
      title: "Faculty Members",
      count: facultyCount || 0,
      icon: Users,
      href: "/admin/faculty",
      color: "text-orange-600",
      description: "Faculty profiles",
    },
    {
      title: "Student Notices",
      count: noticeCount || 0,
      icon: Bell,
      href: "/admin/student-corner",
      color: "text-red-600",
      description: "Published notices",
    },
    {
      title: "Subjects",
      count: subjectsCount || 0,
      icon: MessageSquare,
      href: "/admin/subjects",
      color: "text-indigo-600",
      description: "Total subjects",
    },
  ]

  return (
    <div className="space-y-8">
      {/* <SidebarTrigger className="-ml-1" /> */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name || data.user?.email}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline">View Website</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 gap-6">
            <Link href="/admin/newsletters/new">
              <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                <FileText className="h-4 w-4 mr-2" />
                Add New Newsletter
              </Button>
            </Link>
            <Link href="/admin/subjects/new">
              <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                Upload Subject
              </Button>
            </Link>
            <Link href="/admin/events/new">
              <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </Link>
            <Link href="/admin/faculty/new">
              <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                <Users className="h-4 w-4 mr-2" />
                Add Faculty Member
              </Button>
            </Link>
            <Link href="/admin/student-corner/new">
              <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                <Bell className="h-4 w-4 mr-2" />
                Post Student Notice
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Feedback</span>
            </CardTitle>
            <CardDescription>Latest feedback from students and visitors</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFeedback && recentFeedback.length > 0 ? (
              <div className="space-y-4">
                {recentFeedback.slice(0, 3).map((feedback) => (
                  <div key={feedback.id} className="border-l-2 border-accent pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{feedback.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{feedback.message}</p>
                  </div>
                ))}
                <Link href="/admin/feedback">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Feedback
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No feedback received yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and user information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {profile?.role === "admin" ? "Administrator" : "Faculty"}
              </div>
              <p className="text-sm text-muted-foreground">Your Role</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{new Date().toLocaleDateString()}</div>
              <p className="text-sm text-muted-foreground">Today's Date</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {(newsletterCount || 0) + (materialCount || 0) + (eventCount || 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Content Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
