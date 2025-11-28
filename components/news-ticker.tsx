"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Megaphone } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"

interface Notice {
  id: string
  title: string
  file_url: string | null
}

export default function NewsTicker() {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    async function fetchNotices() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("students_corner")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching student notices:", error)
      } else {
        setNotices(data as Notice[])
      }
    }
    fetchNotices()
  }, [])

  return (
    <section
      aria-labelledby="announcements"
      className="py-6 border-y border-border/60 bg-muted/30"
    >
      <div className="flex flex-col p-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary/15 text-primary">
            <Megaphone className="h-4 w-4" />
          </div>
          <h3
            id="announcements"
            className="text-sm font-semibold text-foreground"
          >
            Department Announcements
          </h3>
        </div>

        {/* News Marquee */}
        <div className="relative overflow-hidden">
          <Marquee pauseOnHover className="[--duration:80s] py-2">
            {notices.map((notice) => (
              <div key={notice.id} className="flex items-center">
                <NewsCard key={notice.id} {...notice} />
                <span
                  className="mx-3 inline-block h-1 w-1 rounded-full bg-foreground/30"
                  aria-hidden="true"
                />
              </div>
            ))}
          </Marquee>

          {/* Fade edges */}
          <div className="from-[#fcfcfc] dark:from-[#121212] pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r" />
          <div className="from-[#fcfcfc] dark:from-[#121212] pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l" />
        </div>
      </div>
    </section>
  )
}


function NewsCard({ title, file_url }: Notice) {
  return (
    <a
      href={file_url || "#"}
      target={file_url ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="mx-6 inline-flex items-center text-sm text-foreground/90 hover:text-primary transition-colors"
    >
      {title}
    </a>
  )
}
