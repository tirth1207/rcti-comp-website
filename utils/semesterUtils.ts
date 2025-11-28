// utils/semesterUtils.ts

export interface SemesterInfo {
  number: number
  type: 'old' | 'new' | 'regular'
  displayName: string
  slug: string
}

export function parseSemesterSlug(slug: string): SemesterInfo | null {
  const patterns = [
    { 
      pattern: /^semester-(\d+)-(old|nep)$/, 
      handler: (match: RegExpMatchArray) => ({ 
        number: parseInt(match[1]), 
        type: match[2] as 'old' | 'new' 
      })
    },
    { 
      pattern: /^semester-(\d+)$/, 
      handler: (match: RegExpMatchArray) => ({ 
        number: parseInt(match[1]), 
        type: 'regular' as const 
      })
    }
  ]
  
  for (const { pattern, handler } of patterns) {
    const match = slug.match(pattern)
    if (match) {
      const result = handler(match)
      return {
        ...result,
        displayName: result.type === 'regular' 
          ? `Semester ${result.number}`
          : `Semester ${result.number} (${result.type.toUpperCase()})`,
        slug
      }
    }
  }
  
  return null
}

export function createSemesterSlug(number: number, type: 'old' | 'new' | 'regular' = 'regular'): string {
  if (type === 'regular') {
    return `semester-${number}`
  }
  return `semester-${number}-${type}`
}

export const AVAILABLE_SEMESTERS: SemesterInfo[] = [
  { number: 1, type: 'old', displayName: 'Semester 1 (OLD)', slug: 'semester-1-old' },
  { number: 1, type: 'new', displayName: 'Semester 1 (NEP)', slug: 'semester-1-new' },
  { number: 2, type: 'old', displayName: 'Semester 2 (OLD)', slug: 'semester-2-old' },
  { number: 2, type: 'new', displayName: 'Semester 2 (NEP)', slug: 'semester-2-new' },
  { number: 3, type: 'old', displayName: 'Semester 3 (OLD)', slug: 'semester-3-old' },
  { number: 3, type: 'new', displayName: 'Semester 3 (NEP)', slug: 'semester-3-new' },
  { number: 4, type: 'regular', displayName: 'Semester 4', slug: 'semester-4' },
  { number: 5, type: 'regular', displayName: 'Semester 5', slug: 'semester-5' },
  { number: 6, type: 'regular', displayName: 'Semester 6', slug: 'semester-6' },
  // { number: 7, type: 'regular', displayName: 'Semester 7', slug: 'semester-7' },
  // { number: 8, type: 'regular', displayName: 'Semester 8', slug: 'semester-8' },
]