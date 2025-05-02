# Open-Launch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Open%20Launch-FFDD00?logo=buymeacoffee)](https://buymeacoffee.com/drdruide)

The first complete open source alternative to Product Hunt. Built with modern web technologies.

<div align="center">
  <a href="https://open-launch.com" target="_blank">
    <img src="https://img.shields.io/badge/Launch_Your_Project_NOW-2563EB?style=for-the-badge&logo=&logoColor=white" alt="Launch Your Project NOW" />
  </a>
</div>

## ✨ Features

- 🎯 **Product Discovery**: Explore the latest launches and trends
- ⭐ **Voting System**: Upvote your favorite products
- 📂 **Categories**: Browse by thematic categories
- 📊 **Dashboard**: Personalized user interface
- 🔐 **Admin Panel**: Administration system
- 💳 **Payment System**: Stripe integration for premium features
- 💬 **Comments**: Built-in commenting system powered by [Fuma Comment](https://github.com/fuma-nama/fuma-comment)
- 📈 **Trending**: Dedicated section for popular products
- 🏆 **Winners**: Showcase of the best products

### 🔒 Security & Anti-Spam Features

- 🛡️ **Rate Limiting**
- ⏱️ **Comment Rate Limiting**
- 👍 **Vote Rate Limiting**
- 🔄 **API Rate Limiting**
- ⏳ **Action Cooldown**: Minimum 2 seconds between actions on the same project
- 🚫 **Anti-Spam Protection**: Multiple layers of protection against spam and abuse

### 🔔 Notification System

- 📢 **Discord Integration**: Real-time notifications for:
  - New comments with user and project details
  - Scheduled launches with project information
  - Premium and Premium Plus launch notifications

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/drdruide/open-launch.git
cd open-launch

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize the database
npm run db:generate
npm run db:migrate

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see your app running.

## 🛠 Tech Stack

### Frontend

- [Next.js 15](https://nextjs.org) - React framework
- [React 19](https://reactjs.org) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com) - Accessible and customizable components

### Backend

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless API
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org) - Database
- [Redis](https://redis.io) - Caching and sessions
- [Stripe](https://stripe.com) - Payments
- [UploadThing](https://uploadthing.com) - File uploads
- [Resend](https://resend.com) - Transactional emails

### Security

- [Better Auth](https://better-auth.com) - Authentication
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile) - Bot protection
- [Middleware](https://nextjs.org/docs/middleware) - Route protection
- [Zod](https://zod.dev) - Data validation
- HTTPS - Secure communications

## 📦 Deployment

Open Launch is optimized for deployment on Vercel but can be deployed on any platform that supports Next.js.

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Product Hunt](https://www.producthunt.com) for inspiration
- The open source community

## 📞 Support

- [X](https://x.com/ericbn09)
- [GitHub Issues](https://github.com/drdruide/open-launch/issues)

## 💖 Sponsoring

Open Launch is an open source project that relies on community support to continue its development. If you find this project useful, please consider supporting it:

- [Buy Me a Coffee](https://buymeacoffee.com/drdruide) - Support the project with a one-time donation

<div align="center">
  <a href="https://open-launch.com" target="_blank">
    <img src="https://img.shields.io/badge/Launch_Your_Project_NOW-2563EB?style=for-the-badge&logo=&logoColor=white" alt="Launch Your Project NOW" />
  </a>
</div>

---

Made by Eric (X: @Ericbn09)
