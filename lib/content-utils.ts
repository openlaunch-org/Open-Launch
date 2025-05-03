/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utilitaires pour traiter le contenu des commentaires
 */

/**
 * Extrait le texte à partir du contenu riche de Fuma Comment
 * @param content Contenu riche au format JSON
 * @returns Texte extrait du contenu
 */
export function extractTextFromContent(content: any): string {
  if (!content) return ""

  // Fonction récursive pour extraire le texte
  const extractText = (node: any): string => {
    if (typeof node === "string") return node
    if (!node) return ""

    // Si c'est un nœud texte
    if (node.text) return node.text

    // Si c'est un nœud image
    if (node.type === "image") {
      return "[Image]"
    }

    // Si c'est une mention
    if (node.type === "mention") {
      return `@${node.attrs?.label || node.attrs?.id || "unknown"}`
    }

    // Récursion pour les contenus imbriqués
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join("")
    }

    return ""
  }

  return extractText(content)
}
