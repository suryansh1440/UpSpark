export const heroStats = [
  { label: 'Startups', value: '500+' },
  { label: 'Investors', value: '200+' },
  { label: 'Mentors', value: '100+' },
]

export const howItWorks = [
  {
    title: 'Create your profile',
    description: 'Tell us who you are and what you are looking for.',
    icon: 'user-plus',
  },
  {
    title: 'Discover & connect',
    description: 'Search startups, investors, mentors and collaborators.',
    icon: 'search',
  },
  {
    title: 'Raise or give funding',
    description: 'Share your pitch or shortlist startups to invest in.',
    icon: 'handshake',
  },
]

export const roles = [
  { title: "I'm a Startup Founder", cta: 'Sign up', role: 'founder', color: 'from-indigo-500 to-violet-500' },
  { title: "I'm an Investor", cta: 'Sign up', role: 'investor', color: 'from-emerald-500 to-teal-500' },
  { title: "I'm a Mentor", cta: 'Sign up', role: 'mentor', color: 'from-amber-500 to-orange-500' },
  { title: "I'm a Collaborator", cta: 'Sign up', role: 'collaborator', color: 'from-sky-500 to-cyan-500' },
]

export const startups = [
  {
    id: 's1',
    name: 'NovaAI',
    tagline: 'AI copilot for enterprise support teams',
    stage: 'Seed',
    industry: 'AI',
    location: 'Bangalore, India',
    fundingRequired: '₹1.2 Cr',
    teamSize: 12,
    tags: ['AI', 'B2B', 'Support'],
    highlight: '22% MoM growth',
    saved: false,
  },
  {
    id: 's2',
    name: 'FarmLink',
    tagline: 'Marketplace for sustainable agri produce',
    stage: 'MVP',
    industry: 'AgriTech',
    location: 'Pune, India',
    fundingRequired: '₹80L',
    teamSize: 8,
    tags: ['Agritech', 'Marketplace', 'Logistics'],
    highlight: 'Pilots with 3 FPOs',
    saved: false,
  },
  {
    id: 's3',
    name: 'FinSight',
    tagline: 'Realtime cashflow intelligence for SMBs',
    stage: 'Series A',
    industry: 'FinTech',
    location: 'Remote',
    fundingRequired: '₹5 Cr',
    teamSize: 30,
    tags: ['Fintech', 'SaaS', 'SMB'],
    highlight: 'ARR $1.2M',
    saved: false,
  },
  {
    id: 's4',
    name: 'HealConnect',
    tagline: 'Virtual-first clinics for chronic care',
    stage: 'Seed',
    industry: 'HealthTech',
    location: 'Delhi, India',
    fundingRequired: '₹2 Cr',
    teamSize: 18,
    tags: ['Health', 'Telemedicine', 'B2C'],
    highlight: '5k monthly patients',
    saved: false,
  },
]

export const testimonials = [
  {
    name: 'Aisha Khan',
    role: 'Founder, NovaAI',
    quote: 'We closed two investor meetings within a week of joining.',
  },
  {
    name: 'Rahul Verma',
    role: 'Partner, Horizon Capital',
    quote: 'The filters make it easy to spot founders with real traction.',
  },
  {
    name: 'Lisa Mathew',
    role: 'Mentor, Ex-Google',
    quote: 'Booking mentor sessions is frictionless and well structured.',
  },
]

export const messagesPreview = [
  { name: 'Investor ABC', role: 'Investor', lastMessage: 'Let’s schedule a call this Friday?', time: '2h ago' },
  { name: 'Mentor Priya', role: 'Mentor', lastMessage: 'Here is the deck feedback I promised.', time: '5h ago' },
  { name: 'Dev Akash', role: 'Collaborator', lastMessage: 'I can help with the mobile app.', time: '1d ago' },
]

export const fundingRequests = [
  {
    investor: 'Alpha Ventures',
    startup: 'AI Tutor',
    amount: '₹20L',
    status: 'Pending',
  },
  {
    investor: 'Horizon Fund',
    startup: 'FarmLink',
    amount: '₹50L',
    status: 'Meeting scheduled',
  },
]

export const adminHighlights = {
  users: 1240,
  startups: 320,
  funding: 148,
  reports: 28,
}

export const mockUsers = [
  {
    id: 'u1',
    name: 'Suryansh',
    email: 'founder@nexus.dev',
    role: 'founder',
    startup: 'NovaAI',
    stage: 'Seed',
    location: 'Bengaluru',
    avatar: '',
  },
  {
    id: 'u2',
    name: 'Rahul Verma',
    email: 'investor@horizon.cap',
    role: 'investor',
    firm: 'Horizon Capital',
    focus: ['AI', 'SaaS'],
    avatar: '',
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@int222.com',
    role: 'admin',
    avatar: '',
  },
]

