"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function FinalCTA() {
  return (
    <section id="apply" className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <Card className="p-8 md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold md:text-3xl">
              Ready to start your journey in Computer Engineering?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join a dynamic community of learners, creators, and problem-solvers. Build strong fundamentals and a
              portfolio you’ll be proud of.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <a href="/contact" aria-label="Begin application">
                  Begin Application
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="#offers" aria-label="View curriculum highlights">
                  View Highlights
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
