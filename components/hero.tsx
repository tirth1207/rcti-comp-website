import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, Calendar, Sparkles } from "lucide-react"
import { AnimatedStudents } from "./ui/animatednumber"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 text-sm font-medium animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Welcome to Computer Engineering Department
          </Badge>

          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-in fade-in-0 slide-in-from-bottom-6 duration-1000 delay-200">
            Shaping the Future of{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Technology
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-300">
            Empowering students with cutting-edge computer science education, innovative research opportunities, and
            industry-ready skills for tomorrow's challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/course-materials">
              <Button
                size="lg"
                className="text-base px-8 group hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/faculty">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 group hover:bg-accent hover:shadow-md  bg-transparent"
              >
                Meet Faculty
                <Users className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 delay-700">
            <Card className="flex items-center justify-center gap-3 p-4 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">40+ Courses</span>
            </Card>
            <Card className="flex items-center justify-center gap-3 p-4 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">25+ Faculty</span>
            </Card>
            <Card className="flex items-center justify-center gap-3 p-4 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">500+ Students</span>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
