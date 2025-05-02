import { db } from "@/drizzle/db";

import { category } from "@/drizzle/db/schema";

const TECH_PROJECT_CATEGORIES = [
  // Development & IT
  { id: "developer-tools", name: "Developer Tools" },
  { id: "api", name: "APIs & Integrations" },
  { id: "open-source", name: "Open Source" },
  { id: "web-dev", name: "Web Development" },
  { id: "mobile-dev", name: "Mobile Development" },
  { id: "devops", name: "DevOps & Cloud" },
  { id: "databases", name: "Databases" },
  { id: "testing-qa", name: "Testing & QA" },
  { id: "cms", name: "CMS & No-Code" },

  // AI & Data Science
  { id: "ai", name: "Artificial Intelligence" },
  { id: "machine-learning", name: "Machine Learning" },
  { id: "data-science", name: "Data Science & Analytics" },
  { id: "nlp", name: "Natural Language Processing" },

  // Design & UX
  { id: "design-tools", name: "Design Tools" },
  { id: "ui-ux", name: "UI/UX" },
  { id: "prototyping", name: "Prototyping" },
  { id: "graphics", name: "Graphics & Illustration" },

  // Business & Marketing
  { id: "saas", name: "SaaS" },
  { id: "marketing-tools", name: "Marketing Tools" },
  { id: "sales-tools", name: "Sales Tools" },
  { id: "productivity", name: "Productivity" },
  { id: "finance-tech", name: "Finance & FinTech" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "analytics", name: "Business Analytics" },

  // Hardware & IoT
  { id: "hardware", name: "Hardware" },
  { id: "iot", name: "Internet of Things (IoT)" },
  { id: "robotics", name: "Robotics" },
  { id: "wearables", name: "Wearables" },

  // Niche & Emerging Tech
  { id: "blockchain", name: "Blockchain & Crypto" },
  { id: "ar-vr", name: "AR/VR" },
  { id: "gaming", name: "Gaming Tech" },
  { id: "edtech", name: "Education Tech" },
  { id: "healthtech", name: "Health Tech" },
  { id: "greentech", name: "Green Tech" },

  // Platforms & Infrastructure
  { id: "platform", name: "Platforms" },
  { id: "serverless", name: "Serverless" },
  { id: "security", name: "Security" },
];

const initializeCategories = async () => {
  const data = await db;
  const categories = await data.query.category.findMany();
  if (categories.length === 0) {
    await data.insert(category).values(TECH_PROJECT_CATEGORIES);
  }
};

try {
  initializeCategories().then(() => {
    console.log("✅ Initialisation des catégories technologiques réussie !");
  });
} catch (error) {
  console.error("❌ Erreur lors de l'initialisation des catégories :", error);
}
