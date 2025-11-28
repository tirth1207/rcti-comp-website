"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

type Props = {
  imageSrc: string
  imageAlt: string
  eyebrow?: string
  title: string
  body: string
  bullets?: string[]
  reverse?: boolean
}

export function ImageRichSection({ imageSrc, imageAlt, eyebrow, title, body, bullets = [], reverse }: Props) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Card className="p-0">
          <div
            className={`grid items-stretch gap-0 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-last" : ""}`}
          >
            <div className="relative aspect-[16/11] w-full md:aspect-auto">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-t-md object-cover md:rounded-l-md md:rounded-tr-none"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              {eyebrow ? <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p> : null}
              <h3 className="mt-1 text-xl font-semibold md:text-2xl">{title}</h3>
              <p className="mt-3 text-muted-foreground">{body}</p>
              {bullets.length > 0 ? (
                <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
                  {bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
