import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { HeroAbout } from "@/components/hero-about"
import { VisionMissionCards } from "@/components/vision-mission-cards"
import { BentoOffers } from "@/components/bento-offers"
import { ImageRichSection } from "@/components/image-rich-section"
import { FinalCTA } from "@/components/final-cta"

export const metadata: Metadata = pageMetadata.about

export default function AboutPage() {
  return (
    <main>
      <HeroAbout />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold md:text-3xl">About RC Technical Institute</h2>
            <p className="mt-3 text-muted-foreground">
              Established in 1998, RCTI has been at the forefront of technical education in Ahmedabad, fostering
              innovation, research, and holistic development with state-of-the-art infrastructure and dedicated faculty.
            </p>
          </div>
        </div>
      </section>

      <VisionMissionCards />
      <BentoOffers />

      <ImageRichSection
        imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_gsRMnmw8_J3jkh9CTTURa47KkMEfs7xzew&s"
        imageAlt="Students collaborating on a coding project in the lab"
        eyebrow="Hands-On Learning"
        title="Project-based learning that builds confidence"
        body="Each semester includes practical labs and projects designed to reinforce theory with real applications. You’ll work in teams, use modern tools, and present your work just like in the industry."
        bullets={["Mini-projects every term", "Peer reviews and demos", "Portfolio-focused outcomes"]}
      />

      <ImageRichSection
        reverse
        imageSrc="https://media.istockphoto.com/id/506340238/photo/pc-room.jpg?s=612x612&w=0&k=20&c=hClJ3bjnW6n8gXSNbotpe520ofrREJYlJNMElU5CWJA="
        imageAlt="Modern computer networks and hardware setup"
        eyebrow="Modern Infrastructure"
        title="Labs and resources to explore and experiment"
        body="From well-equipped computer labs to networking and hardware resources, you’ll have access to tools that help you test ideas and grow your skill set."
        bullets={["High-availability lab access", "Guided workshops and clinics", "Dedicated mentorship hours"]}
      />

      <FinalCTA />
    </main>
  )
}
