import "./globals.css";
import { NavConditional, Navigation } from "@/components/navigation";
import { FooterConditional } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Computer Department - RCTI | Official Website",
  description:
    "Explore the Computer Engineering Department at RCTI. Discover programs, faculty, events, resources, and opportunities that prepare students for careers in technology.",
  keywords: [
    "RCTI",
    "Computer Department",
    "Computer Engineering",
    "RCTI Ahmedabad",
    "Engineering College",
    "Computer Science",
    "Technical Education",
  ],
  authors: [{ name: "RCTI Computer Department" }],
  creator: "RCTI Computer Department",
  publisher: "RCTI",
  icons: {
    icon: "/RCTI_Logo.png",      // ✅ correct
    shortcut: "/RCTI_Logo.png",  // ✅ correct
    apple: "/RCTI_Logo.png",     // ✅ correct
  },
  openGraph: {
    title: "Computer Department - RCTI",
    description:
      "Official website of the Computer Engineering Department at RCTI, featuring academic programs, resources, and events.",
    url: "https://rcti-comp.vercel.app",
    siteName: "RCTI Computer Department",
    images: [
      {
        url: "/RCTI_Logo.png",  // ✅ correct
        width: 800,
        height: 600,
        alt: "RCTI Computer Department",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Computer Department - RCTI",
    description:
      "Discover the Computer Engineering Department at RCTI with programs, faculty, and resources for aspiring engineers.",
    images: ["/RCTI_Logo.png"], // ✅ correct
    creator: "@yourTwitterHandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rcti-comp.vercel.app",
  },
  metadataBase: new URL("https://rcti-comp.vercel.app"),
  category: "Education",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollegeOrUniversity",
              name: "RCTI - Computer Department",
              url: "https://rcti-comp.vercel.app",
              logo: "https://rcti-comp.vercel.app/RCTI_Logo.png",
              sameAs: [
                "https://www.facebook.com/yourpage",
                "https://twitter.com/yourhandle",
                "https://www.linkedin.com/school/yourpage/",
              ],
              department: {
                "@type": "EducationalOrganization",
                name: "Computer Engineering Department",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          disableTransitionOnChange
        >
          <NavConditional />
          <main className="flex-1">
            <Analytics />
            <SpeedInsights />
            {children}
          </main>
          <FooterConditional />
        </ThemeProvider>
      </body>
    </html>
  );
}
