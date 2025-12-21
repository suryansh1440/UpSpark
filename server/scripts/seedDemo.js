import 'dotenv/config'
import { connectDB } from '../lib/db.js'
import User from '../modals/user.modal.js'
import Startup from '../modals/startup.modal.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
  try {
    await connectDB()

    console.log('Seeding demo users...')
    const password = await bcrypt.hash('password123', 10)

    const demoEmails = ['admin@demo.com', 'founder1@demo.com', 'founder2@demo.com', 'investor1@demo.com', 'collab1@demo.com']

    // remove existing demo users
    await User.deleteMany({ email: { $in: demoEmails } })

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password,
      roles: ['admin'],
      activeRole: 'admin',
      isVerified: true,
    })

    const founder1 = await User.create({
      name: 'Aisha Khan',
      email: 'founder1@demo.com',
      password,
      roles: ['founder'],
      activeRole: 'founder',
      isVerified: true,
    })

    const founder2 = await User.create({
      name: 'Ravi Patel',
      email: 'founder2@demo.com',
      password,
      roles: ['founder'],
      activeRole: 'founder',
      isVerified: true,
    })

    const collaborator = await User.create({
      name: 'Sam Collab',
      email: 'collab1@demo.com',
      password,
      roles: ['collaborator'],
      activeRole: 'collaborator',
    })

    const investor = await User.create({
      name: 'Investor One',
      email: 'investor1@demo.com',
      password,
      roles: ['investor'],
      activeRole: 'investor',
    })

    console.log('Seeding demo startups...')

    // remove previous demo startups
    await Startup.deleteMany({ name: /Demo/ })

    const startups = [
      {
        name: 'Demo AI Tutor',
        tagline: 'Personalized AI Tutor for Students',
        industry: 'EdTech',
        stage: 'mvp',
        location: 'Bengaluru, India',
        problem: 'Students lack personalization',
        solution: 'AI-based learning plans that adapt per student',
        fundingRequired: 2000000,
        equityOffered: 10,
        founder: founder1._id,
        isVerified: false,
        traction: { users: 1200, revenue: 5000, growthRate: 12 },
      },
      {
        name: 'Demo FarmLink',
        tagline: 'Market access for small farmers',
        industry: 'AgriTech',
        stage: 'seed',
        location: 'Punjab, India',
        problem: 'Small farmers lack reliable market access',
        solution: 'An end-to-end marketplace and logistics',
        fundingRequired: 500000,
        equityOffered: 12,
        founder: founder2._id,
        isVerified: true,
        traction: { users: 3400, revenue: 25000, growthRate: 24 },
      },
      {
        name: 'Demo HealthBridge',
        tagline: 'Telehealth for rural clinics',
        industry: 'HealthTech',
        stage: 'idea',
        location: 'Kerala, India',
        problem: 'Rural clinics lack specialist access',
        solution: 'Tele-consult platform with offline sync',
        fundingRequired: 150000,
        equityOffered: 8,
        founder: founder1._id,
        isVerified: false,
        traction: { users: 200, revenue: 0, growthRate: 0 },
      },
      {
        name: 'Demo FinSight',
        tagline: 'Financial analytics for SMBs',
        industry: 'FinTech',
        stage: 'seed',
        location: 'Mumbai, India',
        problem: 'Small businesses lack actionable financial insights',
        solution: 'Ledger+ gives real-time KPIs and forecasting',
        fundingRequired: 750000,
        equityOffered: 9,
        founder: founder2._id,
        isVerified: true,
        traction: { users: 4200, revenue: 48000, growthRate: 18 },
      },
      {
        name: 'Demo HealConnect',
        tagline: 'Patient coordination platform',
        industry: 'HealthTech',
        stage: 'mvp',
        location: 'Delhi, India',
        problem: 'Fragmented patient records slow care',
        solution: 'Unified records and appointment workflows',
        fundingRequired: 350000,
        equityOffered: 11,
        founder: founder1._id,
        isVerified: true,
        traction: { users: 980, revenue: 12000, growthRate: 9 },
      },
      {
        name: 'Demo FarmSense',
        tagline: 'Soil & crop analytics for smallholders',
        industry: 'AgriTech',
        stage: 'seed',
        location: 'Maharashtra, India',
        problem: 'Farmers lack actionable crop insights',
        solution: 'Low-cost sensors + ML recommendations',
        fundingRequired: 600000,
        equityOffered: 10,
        founder: founder2._id,
        isVerified: false,
        traction: { users: 2100, revenue: 19000, growthRate: 14 },
      },
      {
        name: 'Demo GreenCharge',
        tagline: 'EV charging infrastructure optimization',
        industry: 'CleanTech',
        stage: 'series-a',
        location: 'Bengaluru, India',
        problem: 'Inefficient charger utilization and payments',
        solution: 'Smart routing and dynamic pricing for chargers',
        fundingRequired: 3000000,
        equityOffered: 15,
        founder: founder1._id,
        isVerified: true,
        traction: { users: 15000, revenue: 320000, growthRate: 30 },
      },
      {
        name: 'Demo BlockPay',
        tagline: 'Cross-border payments for SMEs',
        industry: 'FinTech',
        stage: 'mvp',
        location: 'Hyderabad, India',
        problem: 'High fees and slow settlements for cross-border transfers',
        solution: 'Low-cost rails + instant settlement for SMEs',
        fundingRequired: 450000,
        equityOffered: 12,
        founder: founder2._id,
        isVerified: false,
        traction: { users: 430, revenue: 2000, growthRate: 6 },
      },
      {
        name: 'Demo CleanAir',
        tagline: 'Air quality monitoring & remediation',
        industry: 'EnviroTech',
        stage: 'idea',
        location: 'Ahmedabad, India',
        problem: 'Lack of localized air quality data',
        solution: 'Affordable monitors and community dashboards',
        fundingRequired: 120000,
        equityOffered: 6,
        founder: founder1._id,
        isVerified: false,
        traction: { users: 75, revenue: 0, growthRate: 0 },
      },
      {
        name: 'Demo MarketPulse',
        tagline: 'Real-time market intelligence for retailers',
        industry: 'RetailTech',
        stage: 'seed',
        location: 'Gurgaon, India',
        problem: 'Retailers lack live signals for pricing and demand',
        solution: 'Realtime signals from POS + competitor data',
        fundingRequired: 900000,
        equityOffered: 10,
        founder: founder2._id,
        isVerified: true,
        traction: { users: 2700, revenue: 60000, growthRate: 16 },
      },
    ]

    const created = await Startup.insertMany(startups)

    // add collaborator to one startup
    const farmLink = created.find((s) => s.name.includes('FarmLink'))
    if (farmLink) {
      farmLink.teamMembers = [collaborator._id]
      await farmLink.save()
    }

    console.log(`Seeded ${[admin, founder1, founder2, collaborator, investor].length} users and ${created.length} startups.`)
    console.log('Demo credentials: password for all demo users is: password123')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()
