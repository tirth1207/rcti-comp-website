"use client"
import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                {/* <GraduationCap className="h-8 w-8 text-primary transition-transform group-hover:scale-110" /> */}
                <img src="/RCTI_Logo.png" alt="Logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </div>
              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Computer Department
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              To mould young and fresh minds into challenging computer professionals with ethical values and shaping them with upcoming technologies and develop the ability to deal with real world situations with skills and innovative ideas.
            </p>
            {/* <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent"
              >
                Admin Portal
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </Link> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/course-materials"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Course Materials</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="/faculty"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Faculty Directory</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Events Gallery</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="/student-corner"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Student Corner</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Academic</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/newsletter"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Newsletter</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Feedback</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground group">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Computer Science Department</div>
                  <div>Opp Sola Civil Hospital, Near Gujarat High Court</div>
                  <div>S.G.Highway, Sola, Ahmedabad - 380060</div>
                </div>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:computer.rcti640@gmail.com" className="hover:underline">
                  computer.rcti640@gmail.com
                </a>
              </li>
              {/* <li className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:underline">
                  +1 (555) 123-4567
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Computer Engineering Department. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground justify-end" >
              <div className="flex gap-1 items-center ">
                <span>Built with</span>
                <span className="text-primary font-medium">Next.js</span>
                <span>&</span>
                <span className="text-primary font-medium">Tailwind CSS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Developed by <a href="https://tirth.is-a.dev/" target="_blank" rel="noopener noreferrer" className="hover:underline">Tirth Rathod</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

import { usePathname } from "next/navigation";
// import { Footer } from "@/components/footer";


export function FooterConditional() {
  const pathname = usePathname();

  // Hide footer for all /admin/... routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
