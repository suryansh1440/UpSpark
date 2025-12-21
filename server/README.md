# Server - Demo Seed Script

This repository includes a demo seed script to populate the development database with sample users and startups.

Usage

1. Copy `.env.example` to `.env` and set `MONGO_URI` (and Cloudinary vars if needed).
2. Install dependencies: `npm install`
3. Run the seed script:

```
npm run seed
```

Default demo credentials: `password123` for all seeded users (emails: `admin@demo.com`, `founder1@demo.com`, `founder2@demo.com`, `collab1@demo.com`, `investor1@demo.com`).
