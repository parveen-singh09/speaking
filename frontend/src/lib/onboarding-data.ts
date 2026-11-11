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

export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', 'Côte d’Ivoire',
  'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other',
] as const

const MEN = Array.from({ length: 14 }, (_, i) => `/avatars/man${i + 1}_adult.svg`)
const WOMEN = Array.from({ length: 14 }, (_, i) => `/avatars/woman${i + 1}_adult.svg`)

export function avatarsFor(gender: string): string[] {
  return gender === 'female' ? WOMEN : MEN
}
