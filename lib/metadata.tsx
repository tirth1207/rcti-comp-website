import type { Metadata } from "next";

export const createMetadata = (
  title: string,
  description: string,
  keywords: string[],
  path: string,
  ogImage: string = "/RCTI_Logo.png"
): Metadata => ({
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    url: `https://rcti-comp.vercel.app${path}`,
    siteName: "RCTI Computer Department",
    images: [
      {
        url: ogImage,
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
    title,
    description,
    images: [ogImage],
    creator: "@RCTIComputerDept",
  },
  alternates: {
    canonical: `https://rcti-comp.vercel.app${path}`,
  },
});

// Page-specific metadata exports
export const pageMetadata = {
  home: createMetadata(
    "Home - Computer Department RCTI",
    "Welcome to RCTI Computer Department. Explore academic programs, faculty, events, and resources for computer engineering students.",
    [
      "RCTI home",
      "Computer Department",
      "Computer courses",
      "Engineering college",
      "Student resources",
    ],
    "/"
  ),

  coursesMaterials: createMetadata(
    "Course Materials - Computer Department RCTI",
    "Access comprehensive course materials including lecture notes, presentations, assignments, and study resources for all computer engineering courses at RCTI.",
    [
      "course materials",
      "lecture notes",
      "study materials",
      "computer engineering courses",
      "RCTI course resources",
      "assignments",
      "presentations",
    ],
    "/course-materials"
  ),

  faculty: createMetadata(
    "Faculty Directory - Computer Department RCTI",
    "Meet our experienced faculty members at RCTI Computer Department. View faculty profiles, qualifications, research interests, and office hours.",
    [
      "faculty directory",
      "computer engineering faculty",
      "RCTI professors",
      "faculty profiles",
      "academic staff",
      "faculty contact",
    ],
    "/faculty"
  ),

  events: createMetadata(
    "Events & Gallery - Computer Department RCTI",
    "Explore photos and updates from department events, seminars, workshops, and student activities at RCTI Computer Department.",
    [
      "events gallery",
      "department events",
      "seminars",
      "workshops",
      "student activities",
      "event photos",
      "RCTI events",
    ],
    "/events"
  ),

  studentCorner: createMetadata(
    "Student Corner - Computer Department RCTI",
    "Important notices, announcements, and information for students. Find student resources, deadlines, and academic updates.",
    [
      "student notices",
      "student announcements",
      "academic information",
      "student resources",
      "important notices",
      "student updates",
    ],
    "/student-corner"
  ),

  newsletter: createMetadata(
    "Newsletter - Computer Department RCTI",
    "Stay updated with the latest news, announcements, and stories from RCTI Computer Department. Subscribe to our newsletter for regular updates.",
    [
      "newsletter",
      "department news",
      "announcements",
      "updates",
      "subscribe newsletter",
      "latest news",
    ],
    "/newsletter"
  ),

  feedback: createMetadata(
    "Feedback & Suggestions - Computer Department RCTI",
    "Share your feedback and suggestions to help us improve. Your insights matter to the RCTI Computer Department.",
    [
      "feedback form",
      "suggestions",
      "contact feedback",
      "improvement suggestions",
      "student feedback",
    ],
    "/feedback"
  ),

  about: createMetadata(
    "About Us - Computer Department RCTI",
    "Learn about RCTI Computer Department's mission, vision, history, and commitment to computer science education and research.",
    [
      "about computer department",
      "department information",
      "mission vision",
      "history",
      "about RCTI",
    ],
    "/about"
  ),

  contact: createMetadata(
    "Contact Us - Computer Department RCTI",
    "Get in touch with RCTI Computer Department. Find our contact information, location, phone number, and email address.",
    [
      "contact us",
      "department contact",
      "phone number",
      "email address",
      "location",
      "contact information",
    ],
    "/contact"
  ),

  placements: createMetadata(
    "Placements - Computer Department RCTI",
    "Explore placement statistics, recruiting companies, and career opportunities for RCTI Computer Department graduates.",
    [
      "placements",
      "placement statistics",
      "recruiting companies",
      "career opportunities",
      "job placements",
      "campus recruitment",
    ],
    "/placements"
  ),

  research: createMetadata(
    "Research & Projects - Computer Department RCTI",
    "Discover ongoing research projects, publications, and innovations led by faculty and students at RCTI Computer Department.",
    [
      "research projects",
      "research papers",
      "publications",
      "innovation",
      "academic research",
      "research center",
    ],
    "/research"
  ),

  syllabus: createMetadata(
    "Academic Syllabus - Computer Department RCTI",
    "View the complete academic syllabus for all computer engineering programs and courses offered at RCTI.",
    [
      "syllabus",
      "academic syllabus",
      "course syllabus",
      "curriculum",
      "academic structure",
      "course details",
    ],
    "/syllabus"
  ),
};