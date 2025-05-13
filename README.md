# Open-Launch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org)
[![Contributors](https://img.shields.io/github/contributors/drdruide/open-launch)](https://github.com/drdruide/open-launch/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/drdruide/open-launch)](https://github.com/drdruide/open-launch/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/drdruide/open-launch)](https://github.com/drdruide/open-launch/pulls)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Open%20Launch-FFDD00?logo=buymeacoffee)](https://buymeacoffee.com/drdruide)

**The first complete open source alternative to Product Hunt. Built with modern web technologies.**

<div align="center">
  <a href="https://productlaunch.com.br" target="_blank">
    <img src="https://img.shields.io/badge/Launch_Your_Project_NOW-2563EB?style=for-the-badge&logo=&logoColor=white" alt="Launch Your Project NOW" />
  </a>
</div>

<div align="center">
  <img src="https://productlaunch.com.br/og.png" alt="Open Launch Screenshot" width="800px" />
</div>

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Project Stats](#project-stats)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support](#support)
- [Sponsoring](#sponsoring)

## Features

### Platform Capabilities

- **Product Discovery**: Explore the latest launches and trends
- **Voting System**: Upvote your favorite products
- **Categories**: Browse by thematic categories
- **Dashboard**: Personalized user interface
- **Admin Panel**: Administration system
- **Payment System**: Stripe integration for premium features
- **Comments**: Built-in commenting system powered by [Fuma Comment](https://github.com/fuma-nama/fuma-comment)
- **Trending**: Dedicated section for popular products
- **Winners**: Showcase of the best products

### Security & Anti-Spam Features

- **Rate Limiting**
- **Comment Rate Limiting**
- **Vote Rate Limiting**
- **API Rate Limiting**
- **Action Cooldown**
- **Anti-Spam Protection**

### Notification System

- **Discord Integration**

## Quick Start

```bash
# Clone the repository
git clone https://github.com/drdruide/open-launch.git
cd open-launch

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize the database
bun run db:generate
bun run db:migrate
bun run db:push

# Seed the categories
bun scripts/categories.ts

# Start the development server
bun run dev
```

Visit `http://localhost:3000` to see your app running.

## Tech Stack

### Frontend

| Technology                              | Description                            |
| --------------------------------------- | -------------------------------------- |
| [Next.js 15](https://nextjs.org)        | React framework for production         |
| [React 19](https://reactjs.org)         | UI library                             |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework            |
| [Shadcn/ui](https://ui.shadcn.com)      | Accessible and customizable components |

### Backend

| Technology                                                            | Description          |
| --------------------------------------------------------------------- | -------------------- |
| [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) | Serverless API       |
| [Drizzle ORM](https://orm.drizzle.team)                               | TypeScript ORM       |
| [PostgreSQL](https://www.postgresql.org)                              | Database             |
| [Redis](https://redis.io)                                             | Caching and sessions |
| [Stripe](https://stripe.com)                                          | Payment processing   |
| [UploadThing](https://uploadthing.com)                                | File uploads         |
| [Resend](https://resend.com)                                          | Transactional emails |

### Security

| Technology                                                            | Description      |
| --------------------------------------------------------------------- | ---------------- |
| [Better Auth](https://better-auth.com)                                | Authentication   |
| [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile) | Bot protection   |
| [Next.js Middleware](https://nextjs.org/docs/middleware)              | Route protection |
| [Zod](https://zod.dev)                                                | Data validation  |

## Deployment

Open Launch is optimized for deployment on Vercel but can be deployed on any platform that supports Next.js.

```bash
# Build the application
bun run build

# Start the production server
bun run start
```

## Project Stats

[![Star History Chart](https://api.star-history.com/svg?repos=drdruide/open-launch&type=Date)](https://star-history.com/#drdruide/open-launch&Date)

## Contributing

We welcome contributions to Open Launch! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Product Hunt](https://www.producthunt.com) for inspiration
- The open source community for their valuable tools and libraries

## Support

- [X/Twitter](https://x.com/ericbn09)
- [GitHub Issues](https://github.com/drdruide/open-launch/issues)

## Sponsoring

Open Launch is an open source project that relies on community support to continue its development. If you find this project useful, please consider supporting it:

- [Buy Me a Coffee](https://buymeacoffee.com/drdruide)

<div align="center">
  <a href="https://open-launch.com" target="_blank">
    <img src="https://img.shields.io/badge/Launch_Your_Project_NOW-2563EB?style=for-the-badge&logo=&logoColor=white" alt="Launch Your Project NOW" />
  </a>
</div>

---

Made by [Eric](https://x.com/Ericbn09) | [GitHub](https://github.com/drdruide)
