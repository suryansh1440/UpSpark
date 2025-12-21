# UpSpark 🚀

**UpSpark** is a lightweight startup collaboration & funding platform built for founders, investors, and collaborators. It includes:

- Role-based dashboards (Founder / Investor / Collaborator / Admin)
- Startup profiles with traction and funding needs
- Funding requests & investor workflows
- Collaboration board with applications and owner management
- Notifications (backend-driven in-app notifications)
- Admin monitoring & moderation tools with charts and stats

Tech highlights: Node.js + Express (server), MongoDB + Mongoose (database), React + Vite (client), Tailwind CSS, Zustand (client state), Recharts (charts).

---

## 📦 Features

Below is a brief overview of the main features and how they behave:

- **Authentication & Roles** — Sign up and use role-based access control. Users can hold multiple roles (founder, investor, collaborator, admin) and switch contexts to access role-specific dashboards and actions.

- **Startup Management** — Founders can create and maintain startup profiles with basic info, problem / solution descriptions, traction metrics (users, revenue, growth), funding requirements, and media links (pitch deck, demo video). Startups can be marked verified by admins.

- **Funding Requests & Investor Workflows** — Investors can express interest or send funding requests to startups. Founders can review inbound requests and accept/reject them. Requests include amounts, messages, and status tracking for pending/accepted/rejected/withdrawn flows.

- **Collaboration Board** — Founders or startup owners can post collaboration opportunities (roles needed, skills, commitment, location). Other users can apply; owners review applications and accept/reject applicants. Posts support multiple applications and simple search via role/skills.

- **Notifications** — Events (funding interest, application updates, admin actions) generate notifications stored in the database and surfaced within the app UI with read/unread states and links to relevant resources.

- **Admin Tools & Moderation** — Admins can list and manage users (block/unblock/verify), moderate startups (verify/reject), review funding and collaboration content, send system notifications, and view aggregated statistics.

- **Dashboards & Charts** — Role-specific dashboards provide quick summaries; the Admin Dashboard includes charts for user distribution, startup growth over time, funding trends, and other KPIs (Recharts used for visualizations).

- **Search, Filters & UX** — App includes simple search, filters by industry/stage/location, basic pagination, and fallback UI for empty states to improve usability.

- **Security & Best Practices** — Passwords are hashed, APIs are protected with JWT-based middleware, and sensitive actions require role checks and authorization.

---

## 🛠️ Local setup

Requirements:
- Node.js >= 18
- MongoDB connection (local or hosted)

1. Clone the repo and install dependencies (server & client):

```pwsh
# from workspace root
cd server
npm install
cd ../client
npm install
```

2. Create a `.env` file in `server/` (copy `.env.example` if present) and set:

```
MONGO_URI=your_mongo_uri
JWT_SECRET=some_secret_key
PORT=5000
```

3. Run dev servers in two terminals:

```pwsh
# terminal 1 - server
cd server
npm run dev

# terminal 2 - client
cd client
npm run dev
```

---

## ⚡ Data & development

The application ships with APIs and UI flows to create users, startups, funding requests, and collaboration posts for development and testing. Use the app UI or API endpoints to create test accounts and sample content when exploring features locally.

---

## 📣 How to test / verify

- Create test users via the app registration or the `/api` endpoints and assign them appropriate roles (founder, investor, collaborator, admin).
- Use the UI to create sample startups, submit funding requests, make collaboration posts, and apply as collaborators to see end-to-end flows.
- Log in as an admin account (create one via the API or database) to verify moderation tools and dashboard charts. Check the Notifications UI for event messages and unread counts.

---

## 🧩 Project structure (high level)

- server/ — Express API, Mongoose models, controllers, routes, utilities/scripts
- client/ — React (Vite), Tailwind UI components, Zustand stores

---

## 📋 Contributing

Contributions are welcome. Please open issues or PRs for bugs, enhancements, or feature ideas. For significant changes, open an issue first to discuss scope.

Suggested workflow:

1. Fork & create a branch
2. Add tests where appropriate
3. Open a PR with a clear description and screenshots if UI changes

---

## 🧾 License & contact

This project is provided as-is. If you'd like help improving or extending the seeder, dashboards, or tests, open an issue or reach out to the repo owner.

---

If you'd like, I can add a quick verification script that runs a few API checks and prints basic counts — want that? ✅

