import 'dotenv/config'
import { connectDB } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

import User from '../modals/user.modal.js'
import Startup from '../modals/startup.modal.js'
import FundingRequest from '../modals/funding.modal.js'
import CollaborationPost from '../modals/collaborationPost.modal.js'
import Notification from '../modals/notification.modal.js'

const FORCE = process.env.FORCE === 'true' || process.argv.includes('--force')

// Configurable sizes (tweak as needed)
const NUM_USERS = parseInt(process.env.SEED_USERS) || 300
const NUM_STARTUPS = parseInt(process.env.SEED_STARTUPS) || 120
const NUM_FUNDING = parseInt(process.env.SEED_FUNDING) || 400
const NUM_COLLABS = parseInt(process.env.SEED_COLLABS) || 220

const industries = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'RetailTech', 'SaaS', 'AI/ML', 'Marketplaces'
]

const stages = ['idea', 'mvp', 'seed', 'series-a']
const roles = ['founder', 'investor', 'collaborator']
const skills = ['React', 'Node.js', 'Python', 'UI/UX', 'Growth', 'Data Science', 'Product', 'Go', 'Rust']

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const seed = async () => {
  if (!FORCE) {
    console.log('\nThis seeder will DELETE and recreate collections for a high-volume demo dataset.')
    console.log('To run it, set environment variable FORCE=true or pass --force')
    console.log('Example (Windows Powershell): $env:FORCE = "true"; node scripts/seedRealistic.js')
    process.exit(0)
  }

  try {
    await connectDB()

    console.log('\nWiping existing demo collections...')
    await Promise.all([
      Notification.deleteMany({}),
      FundingRequest.deleteMany({}),
      CollaborationPost.deleteMany({}),
      Startup.deleteMany({}),
      User.deleteMany({}),
    ])

    const commonPassword = 'Password123!'
    const hashed = await bcrypt.hash(commonPassword, 10)

    console.log('\nCreating admin user (email: suryansh1440@gmail.com) ...')
    const admin = await User.create({
      name: 'Suryansh Sharma',
      email: 'suryansh1440@gmail.com',
      password: hashed,
      roles: ['admin', 'founder', 'investor', 'collaborator'],
      activeRole: 'admin',
      isVerified: true,
      bio: 'Platform admin and power user.',
      location: 'India',
    })

    // Build users pool
    console.log(`\nCreating ${NUM_USERS} users ...`)
    const userDocs = []

    // ensure some founders/investors/collaborators exist in reasonable numbers
    for (let i = 0; i < NUM_USERS; i++) {
      const fullName = faker.person.fullName()
      const email = faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] }).toLowerCase()
      const userRoles = []
      // bias towards founder role first, then others
      if (Math.random() < 0.55) userRoles.push('founder')
      if (Math.random() < 0.45) userRoles.push('investor')
      if (Math.random() < 0.45) userRoles.push('collaborator')
      if (userRoles.length === 0) userRoles.push(randomItem(roles))

      const createdAt = faker.date.recent({ days: rand(7, 180) })

      userDocs.push({
        name: fullName,
        email: `${email.split('@')[0]}+${i}@${email.split('@')[1]}`,
        password: hashed,
        roles: [...new Set(userRoles)],
        activeRole: userRoles[0],
        isVerified: Math.random() < 0.75,
        location: `${faker.location.city()}, ${faker.location.country()}`,
        bio: faker.lorem.sentence(12),
        createdAt,
        updatedAt: createdAt,
      })
    }

    const createdUsers = await User.insertMany(userDocs)
    // include admin in pool for assignments
    createdUsers.push(admin)

    // Helper pools
    const founders = createdUsers.filter(u => u.roles.includes('founder'))
    const investors = createdUsers.filter(u => u.roles.includes('investor'))
    const collaborators = createdUsers.filter(u => u.roles.includes('collaborator'))

    // Create startups
    console.log(`\nCreating ${NUM_STARTUPS} startups ...`)
    const startupDocs = []
    for (let i = 0; i < NUM_STARTUPS; i++) {
      const founder = randomItem(founders) || admin
      // faker v8 does not expose company.suffix(); use a safe suffix fallback
      const rawName = faker.company.name()
      const suffixFallback = ['Labs', 'Solutions', 'Systems', 'Works', 'Studios', 'Labs', 'Ventures']
      const name = `${rawName.split(' ')[0]} ${randomItem(suffixFallback)}`
      const createdAt = faker.date.recent({ days: rand(7, 360) })
      startupDocs.push({
        name: `${name}`,
        tagline: faker.company.catchPhrase(),
        industry: randomItem(industries),
        stage: randomItem(stages),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        problem: faker.lorem.sentence(8),
        solution: faker.lorem.sentence(10),
        fundingRequired: rand(50000, 5000000),
        equityOffered: rand(5, 25),
        founder: founder._id,
        isVerified: Math.random() < 0.6,
        traction: {
          users: rand(0, 50000),
          revenue: rand(0, 2000000),
          growthRate: rand(0, 60),
        },
        teamMembers: Math.random() < 0.4 ? [randomItem(collaborators)?._id].filter(Boolean) : [],
        createdAt,
        updatedAt: createdAt,
      })
    }

    const createdStartups = await Startup.insertMany(startupDocs)

    // Create funding requests
    console.log(`\nCreating ${NUM_FUNDING} funding requests ...`)
    const fundingDocs = []
    for (let i = 0; i < NUM_FUNDING; i++) {
      const investor = randomItem(investors) || admin
      const startup = randomItem(createdStartups)
      const amount = rand(10000, Math.max(50000, Math.floor(startup.fundingRequired || 100000)))
      const statusRoll = Math.random()
      const status = statusRoll < 0.7 ? 'pending' : statusRoll < 0.85 ? 'accepted' : 'rejected'
      const createdAt = faker.date.recent({ days: rand(1, 180) })
      fundingDocs.push({ investor: investor._id, startup: startup._id, amount, message: faker.lorem.sentences(2), status, createdAt, updatedAt: createdAt })
    }

    const createdFunding = await FundingRequest.insertMany(fundingDocs)

    // Create collaboration posts and applications
    console.log(`\nCreating ${NUM_COLLABS} collaboration posts with applications ...`)
    const collabDocs = []
    const collabApplications = []
    for (let i = 0; i < NUM_COLLABS; i++) {
      const startup = randomItem(createdStartups)
      const postedBy = createdUsers.find(u => u._id.toString() === startup.founder.toString()) || randomItem(founders) || admin
      const roleNeeded = randomItem(['developer', 'designer', 'marketer', 'co-founder', 'other'])
      const createdAt = faker.date.recent({ days: rand(1, 180) })
      const applications = []
      const numApps = rand(0, 8)
      for (let a = 0; a < numApps; a++) {
        const applicant = randomItem(collaborators) || admin
        const statusRoll = Math.random()
        const status = statusRoll < 0.85 ? 'pending' : statusRoll < 0.925 ? 'accepted' : 'rejected'
        applications.push({ applicant: applicant._id, message: faker.lorem.sentences(2), status })
      }

      collabDocs.push({
        startup: startup._id,
        postedBy: postedBy._id,
        title: `${roleNeeded} needed: ${faker.company.bsBuzz()} ${faker.lorem.words(2)}`,
        description: faker.lorem.paragraphs(2),
        roleNeeded,
        skillsRequired: faker.helpers.arrayElements(skills, rand(1, 4)),
        commitment: randomItem(['full-time', 'part-time', 'freelance']),
        location: Math.random() < 0.4 ? `${faker.location.city()}, ${faker.location.country()}` : 'remote',
        isActive: Math.random() < 0.9,
        applications,
        createdAt,
        updatedAt: createdAt,
      })
    }

    const createdCollabs = await CollaborationPost.insertMany(collabDocs)

    // Create notifications for interesting events (some examples)
    console.log('\nCreating notifications for created events ...')
    const notifications = []

    // Notify founders about received funding requests and accepted ones
    for (const fr of createdFunding) {
      const startup = createdStartups.find(s => s._id.toString() === fr.startup.toString())
      if (!startup) continue
      notifications.push({ user: startup.founder, title: 'New funding interest', message: `An investor expressed interest in ${startup.name} for ₹${fr.amount}.`, type: 'funding', link: `/funding/${fr._id}`, createdAt: fr.createdAt })
      if (fr.status === 'accepted') {
        notifications.push({ user: fr.investor, title: 'Funding accepted', message: `Your funding for ${startup.name} was accepted.`, type: 'funding', link: `/funding/${fr._id}`, createdAt: fr.createdAt })
      }
    }

    // Notify applicants about application results
    for (const cp of createdCollabs) {
      for (const app of cp.applications) {
        if (app.status !== 'pending') {
          notifications.push({ user: app.applicant, title: `Application ${app.status}`, message: `Your application for "${cp.title}" was ${app.status}.`, type: 'collaboration', link: `/collaboration/${cp._id}`, createdAt: cp.createdAt })
        }
      }
    }

    // Add a system notification for the admin about totals
    notifications.push({ user: admin._id, title: 'Seeding finished', message: 'A large demo dataset was seeded successfully.', type: 'admin', createdAt: new Date() })

    if (notifications.length) await Notification.insertMany(notifications)

    console.log('\nSummary:')
    console.log(` - Admin user: ${admin.email} (password: ${commonPassword})`)
    console.log(` - Created users: ${createdUsers.length}`)
    console.log(` - Created startups: ${createdStartups.length}`)
    console.log(` - Created funding requests: ${createdFunding.length}`)
    console.log(` - Created collaboration posts: ${createdCollabs.length}`)
    console.log(` - Created notifications: ${notifications.length}`)

    console.log('\nSeeder finished successfully. Restart your server to use the new data.')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()
