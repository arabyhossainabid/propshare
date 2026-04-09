<div align="center">
  <img src="assets/hero-banner.png" alt="PropShare Header" width="840">

  <br />

  # PropShare
  **Institutional-Grade Fractional Real Estate Platform**

  <br />

  **[Live Demo](https://propsphere.vercel.app)** &nbsp; • &nbsp; **[API Reference](https://prop-share.onrender.com)**

  <br />
</div>

---

### Description

PropShare is a high-performance investment ecosystem built to democratize access to premium real estate. By leveraging fractional ownership models, it allows users to invest in high-value commercial and residential assets with minimal capital, providing a transparent, liquid, and secure digital investment experience.

### Technologies

Developed with a modern, industry-standard stack for scalability and performance:

- **Frontend** — Next.js 15, React 19, TypeScript
- **Styling** — Tailwind CSS, CSS Variables
- **Animations** — GSAP, Framer Motion
- **Backend Infrastructure** — Node.js, Express, Prisma ORM
- **Database** — PostgreSQL
- **Media Management** — Cloudinary

### Project Architecture

The codebase follows a modular, scalable structure optimized for Next.js 15:

```text
src/
├── app/             # Application routes and server components
├── components/      # Reusable UI modules & layouts
├── contexts/        # Global state and authentication logic
├── hooks/           # Custom React hooks for business logic
├── lib/             # API clients and utility functions
├── types/           # Global TypeScript definitions
└── assets/          # Static media and graphic resources
```

### Installation & Setups

Ensure you have **Node.js 18+** and **pnpm** installed.

```bash
# 1. Clone & Dependencies
git clone https://github.com/arabyhossainabid/propshare.git
cd propshare
pnpm install

# 2. Environment Configuration
# Copy .env.example to .env.local and configure your keys:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 3. Running the Platform
pnpm run dev
```

### Demo Credentials

For testing purposes, you can use the following accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@propshare.com` | `admin123` |
| **User** | `user@propshare.com` | `user123` |

### Key Features Checklist

- [x] **Premium UI/UX**: Over 10+ homepage sections with GSAP & Framer Motion.
- [x] **Fractional Ownership**: Invest in shares of verified real estate.
- [x] **AI-Powered**: Smart property recommendations and search suggestions.
- [x] **Real-time Analytics**: Live portfolio tracking and platform metrics.
- [x] **Secure Auth**: Social logins (Google, Facebook) and JWT protection.
- [x] **Support System**: Integrated AIChatbot, Help Center, and Contact system.

---

<div align="center">
  <img src="assets/dashboard-preview.png" alt="Portfolio Dashboard" width="840">
  <br />
  <sub>Designed and Developed by <b>Araby Hossain Abid</b></sub>
</div>
