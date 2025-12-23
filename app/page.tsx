import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  Award,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { Hero } from "@/components/hero"
import { Vision } from "@/components/vision"
import { Mission } from "@/components/mission"
import  NewsTicker  from "@/components/news-ticker"
import { MarqueeDemo } from "@/components/testimonial"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata.home

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest newsletters for announcements
  const { data: newsletters } = await supabase
    .from("newsletters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  const quickLinks = [
    {
      title: "Course Materials",
      description: "Access comprehensive notes, presentations, and study materials",
      icon: BookOpen,
      href: "/course-materials",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
    },
    {
      title: "Faculty Directory",
      description: "Meet our experienced and dedicated faculty members",
      icon: Users,
      href: "/faculty",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
      borderColor: "border-green-200/50 dark:border-green-800/30",
    },
    {
      title: "Events Gallery",
      description: "View photos and updates from department events",
      icon: Calendar,
      href: "/events",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
    },
    {
      title: "Student Corner",
      description: "Important notices and student announcements",
      icon: FileText,
      href: "/student-corner",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10",
      borderColor: "border-orange-200/50 dark:border-orange-800/30",
    },
    {
      title: "Newsletter",
      description: "Stay updated with the latest department news",
      icon: MessageSquare,
      href: "/newsletter",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10",
      borderColor: "border-indigo-200/50 dark:border-indigo-800/30",
    },
    {
      title: "Feedback",
      description: "Share your thoughts and help us improve",
      icon: Award,
      href: "/feedback",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10",
      borderColor: "border-pink-200/50 dark:border-pink-800/30",
    },
  ]

  const stats = [
    {
      label: "Students Enrolled",
      value: "500+",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Faculty Members",
      value: "25+",
      icon: Award,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Courses Offered",
      value: "40+",
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      label: "Research Projects",
      value: "15+",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent)]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Quick Access
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Navigate Our Department</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover the most important sections of our department website and access the resources you need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20 hover:-translate-y-1 bg-card/50 backdrop-blur ${link.borderColor}`}
              >
                <CardHeader className="pb-1">
                  <div
                    className={`w-12 h-12 rounded-xl ${link.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <link.icon className={`h-7 w-7 ${link.color}`} />
                  </div>
                  <CardTitle className="text-lg my-2group-hover:text-primary transition-colors duration-200">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-muted-foreground leading-relaxed">
                    {link.description}
                  </CardDescription>
                  <Link href={link.href}>
                    <Button
                      variant="ghost"
                      className={`group-hover:bg-primary/10 group-hover:${link.color} p-0 h-auto font-medium transition-all duration-200`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent)]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              Department Stats
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Excellence in Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our department continues to grow and excel in computer science education and research
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group hover:-translate-y-1 bg-card/50 backdrop-blur"
              >
                <CardContent className="pt-8 pb-6">
                  <div
                    className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <Vision />
      <Mission />


      <NewsTicker/>

      {newsletters && newsletters.length > 0 && (
        <section className="py-16 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent)]" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Latest News
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Department Announcements</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Stay updated with the latest news and announcements from our department
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((newsletter, index) => (
                <Card
                  key={newsletter.id}
                  className="hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20 group hover:-translate-y-1 bg-card/50 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {index === 0 ? "Latest" : "Recent"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(newsletter.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {newsletter.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-6 leading-relaxed">
                      {newsletter.description}
                    </CardDescription>
                    <Link href="/newsletter">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 bg-secondary border text-secondary-foreground"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/newsletter">
                <Button
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-secondary border text-secondary-foreground"
                >
                  View All Newsletters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      <div className="py-16  relative overflow-visible">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Our Reviews
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">What People Are Saying</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                 Hear from students and visitors about their experiences with our department.
              </p>
        </div>
      </div>
    </div>
  )
}
