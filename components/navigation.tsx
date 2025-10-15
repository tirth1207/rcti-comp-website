"use client"

import { useState } from "react"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import { usePathname } from "next/navigation";
// import { Footer } from "@/components/footer";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { title } from "process";

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const academicSections = [
    {
      title: "Faculty Directory",
      description: "Meet our experienced faculty members",
      href: "/faculty",
    },
    {
      title: "Student Corner",
      description: "Important notices and announcements",
      href: "/student-corner",
    },
    {
      title: "Events Gallery",
      description: "View photos from department events",
      href: "/events",
    },
    {
      title: "Newsletter",
      description: "Stay updated with department news",
      href: "/newsletter",
    },
    // {
    //   title: "Feedback",
    //   description: "Share your thoughts and suggestions",
    //   href: "/feedback",
    // },
    {
      title: "About",
      description: "Learn more about our department",
      href: "/about",
    }
  ]

  const semesters = [
    { title: "Semester 1 (Old)", number: 1, type: "old" },
    { title: "Semester 1 (NEP)", number: 1, type: "nep" },
    { title: "Semester 2 (Old)", number: 2, type: "old" },
    { title: "Semester 2 (NEP)", number: 2, type: "nep" },
    { title: "Semester 3 (Old)", number: 3, type: "old" },
    { title: "Semester 3 (NEP)", number: 3, type: "nep" },
    { title: "Semester 4", number: 4, type: "regular" },
    { title: "Semester 5", number: 5, type: "regular" },
    { title: "Semester 6", number: 6, type: "regular" },
    // { title: "Semester 7", number: 7, type: "regular" },
    // { title: "Semester 8", number: 8, type: "regular" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group">
            <div className="relative">
              {/* <GraduationCap className="h-8 w-8 text-primary transition-transform group-hover:scale-110" /> */}
              <img src="/RCTI_Logo.png" alt="Logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Computer Department
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {/* Course Materials Dropdown */}
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-transparent hover:text-accent-foreground data-[state=open]:bg-transparent transition-all duration-200",
                    )}
                  >
                    Course Materials
                    <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 shadow-lg border-border/50">
                    <DropdownMenuLabel className="text-primary font-medium">Select Semester</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {semesters.map((semester) => (
                      <DropdownMenuItem key={`${semester.number}-${semester.type}`} asChild>
                        <Link
                          href={`/course-materials/semester-${semester.number}${semester.type !== "regular" ? `-${semester.type}` : ""}`}
                          className="w-full hover:bg-accent/50 transition-colors"
                        >
                          {semester.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>

              {/* Academic Dropdown */}
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50 transition-all duration-200",
                    )}
                  >
                    Academic
                    <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[600px] shadow-lg border-border/50">
                    {/* <DropdownMenuLabel className="text-primary font-medium">Select Semester</DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}
                    <div className="grid w-[600px] grid-cols-2 p-4 gap-3">
                    {academicSections.map((section) => (
                      <NavigationMenuLink key={section.href} asChild>
                        <Link
                          href={section.href}
                          className={cn(
                            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group border border-transparent hover:border-border/50",
                            pathname === section.href && "bg-accent/50 text-accent"
                          )}
                        >
                          <div className="text-sm font-medium text-foreground leading-none group-hover:text-primary transition-colors ">
                            {section.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                            {section.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <NavigationMenuTrigger className="hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50 transition-all duration-200">
                  Academic
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-4 gap-3">
                    {academicSections.map((section) => (
                      <NavigationMenuLink key={section.href} asChild>
                        <Link
                          href={section.href}
                          className={cn(
                            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group border border-transparent hover:border-border/50",
                            pathname === section.href && "bg-accent/50 text-accent"
                          )}
                        >
                          <div className="text-sm font-medium text-foreground leading-none group-hover:text-primary transition-colors ">
                            {section.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                            {section.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent> */}
              </NavigationMenuItem>

              {/* Contact Link */}
              <NavigationMenuItem>
                <Link href="/feedback" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                      pathname === "/feedback" && "bg-accent/50 text-accent-foreground",
                    )}
                  >
                    Feedback
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <AnimatedThemeToggler />
            <div className="hidden lg:block">
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent"
                >
                  Contact
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Navigation
                  </SheetTitle>
                </SheetHeader> 
                <div className="mt-6 space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="course-materials" className="border-border/50 px-3 py-2 rounded-md hover:text-accent-foreground transition-colors">
                      <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors">
                        Course Materials
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-4">
                          {semesters.slice(0, 8).map((semester) => (
                            <Link
                              key={`${semester.number}-${semester.type}`}
                              href={`/course-materials/semester-${semester.number}${semester.type !== "regular" ? `-${semester.type}` : ""}`}
                              className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {semester.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="academic" className="border-border/50 px-3 py-2 rounded-md hover:text-accent-foreground transition-colors">
                      <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors">
                        Academic
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-4">
                          {academicSections.map((section) => (
                            <Link
                              key={section.href}
                              href={section.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                                pathname === section.href && "bg-accent/50 text-accent-foreground",
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {section.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Link href='/feedback' className={cn("block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === "/feedback" && "bg-accent/50 text-accent-foreground",
                  )}
                  onClick={()=> setMobileMenuOpen(false)}
                  >
                    Feedback
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      "block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/contact" && "bg-accent/50 text-accent-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  {/* <div className="pt-4 border-t border-border/50">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent"
                      >
                        Admin Login
                      </Button>
                    </Link>
                  </div> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}





export function NavConditional() {
  const pathname = usePathname();

  // Hide footer for all /admin/... routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Navigation />;
}
