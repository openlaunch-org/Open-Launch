import { db } from "@/drizzle/db"
import { category } from "@/drizzle/db/schema"

const TECH_PROJECT_CATEGORIES = [
  // Development & IT
  { id: "developer-tools", name: "Ferramentas de Desenvolvimento" },
  { id: "api", name: "APIs e Integrações" },
  { id: "open-source", name: "Código Aberto" },
  { id: "web-dev", name: "Desenvolvimento web" },
  { id: "mobile-dev", name: "Desenvolvimento mobile" },
  { id: "devops", name: "DevOps e Cloud" },
  { id: "databases", name: "Bancos de Dados" },
  { id: "testing-qa", name: "Testes e QA" },
  { id: "crm", name: "CRM" },
  { id: "cms", name: "CMS" },
  { id: "no-code", name: "No-Code" },

  // AI & Data Science
  { id: "ai", name: "Inteligência Artificial" },
  { id: "machine-learning", name: "Machine Learning" },
  { id: "data-science", name: "Ciência de Dados" },
  { id: "data-analytics", name: "Análise de Dados" },
  { id: "nlp", name: "Processamento de Linguagem Natural" },

  // Design & UX
  { id: "design-tools", name: "Ferramentas de Design" },
  { id: "ui-ux", name: "UI/UX" },
  { id: "prototyping", name: "Prototipação" },
  { id: "graphics", name: "Gráficos e Ilustrações" },

  // Business & Marketing
  { id: "saas", name: "SaaS" },
  { id: "microsaas", name: "Micro-SaaS" },
  { id: "marketing-tools", name: "Ferramentas de Marketing" },
  { id: "sales-tools", name: "Ferramentas de Vendas" },
  { id: "productivity", name: "Produtividade e Colaboração" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "analytics", name: "Análise e BI" },

  // Hardware & IoT
  { id: "hardware", name: "Hardware" },
  { id: "iot", name: "Internet of Things (IoT)" },
  { id: "robotics", name: "Robótica" },
  { id: "wearables", name: "Wearables" },

  // Niche & Emerging Tech
  { id: "blockchain", name: "Blockchain e Criptomoedas" },
  { id: "ar-vr", name: "AR/VR" },
  { id: "gaming", name: "Jogos e Entretenimento" },
  { id: "edtech", name: "Educação" },
  { id: "healthtech", name: "Saúde" },
  { id: "agritech", name: "Agricultura" },
  { id: "fintech", name: "Finanças e Investimentos" },
  { id: "legaltech", name: "Jurídico" },

  // Platforms & Infrastructure
  { id: "platform", name: "Platformas" },
  { id: "serverless", name: "Serverless" },
  { id: "security", name: "Segurança da Informação" },
]

const initializeCategories = async () => {
  const data = await db
  const categories = await data.query.category.findMany()
  if (categories.length === 0) {
    await data.insert(category).values(TECH_PROJECT_CATEGORIES)
  }
}

try {
  initializeCategories().then(() => {
    console.log("✅ Inicialização das categorias bem-sucedida!")
  })
} catch (error) {
  console.error("❌ Erreur lors de l'initialisation des catégories :", error)
}
