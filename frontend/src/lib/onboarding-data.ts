export const LEVELS = [
  { value: 'beginner', label: 'Beginner', hint: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', hint: 'Can hold a basic conversation' },
  { value: 'advanced', label: 'Advanced', hint: 'Comfortable most of the time' },
  { value: 'fluent', label: 'Fluent', hint: 'Near-native, polishing' },
] as const

export const OCCUPATIONS = [
  { value: 'student', label: 'Student', icon: '🎓', desc: 'School or college' },
  { value: 'working_professional', label: 'Professional', icon: '💼', desc: 'Employed full-time' },
  { value: 'freelancer', label: 'Freelancer', icon: '🧑‍💻', desc: 'Self-employed / gigs' },
  { value: 'business_owner', label: 'Business Owner', icon: '🏪', desc: 'Run my own business' },
  { value: 'job_seeker', label: 'Job Seeker', icon: '🔍', desc: 'Looking for work' },
  { value: 'teacher', label: 'Teacher', icon: '📚', desc: 'Educator / tutor' },
  { value: 'engineer', label: 'Engineer', icon: '⚙️', desc: 'Tech / engineering' },
  { value: 'doctor', label: 'Healthcare', icon: '🩺', desc: 'Doctor / nurse / medical' },
  { value: 'designer', label: 'Designer', icon: '🎨', desc: 'Design / creative' },
  { value: 'content_creator', label: 'Creator', icon: '🎬', desc: 'Content / media' },
  { value: 'lawyer', label: 'Lawyer', icon: '⚖️', desc: 'Law / legal' },
  { value: 'marketer', label: 'Marketing', icon: '📈', desc: 'Marketing / sales' },
  { value: 'government', label: 'Govt. Employee', icon: '🏛️', desc: 'Public sector' },
  { value: 'scientist', label: 'Researcher', icon: '🔬', desc: 'Science / research' },
  { value: 'artist', label: 'Artist', icon: '🎭', desc: 'Art / performance' },
  { value: 'homemaker', label: 'Homemaker', icon: '🏠', desc: 'Managing a home' },
  { value: 'retired', label: 'Retired', icon: '🌴', desc: 'Enjoying retirement' },
  { value: 'other', label: 'Other', icon: '✨', desc: 'Something else' },
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh',
] as const

const MEN = Array.from({ length: 14 }, (_, i) => `/avatars/man${i + 1}_adult.svg`)
const WOMEN = Array.from({ length: 14 }, (_, i) => `/avatars/woman${i + 1}_adult.svg`)

export function avatarsFor(gender: string): string[] {
  return gender === 'female' ? WOMEN : MEN
}
