"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface MobileCategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string
  sortParam?: string
}

export function MobileCategorySelector({
  categories,
  selectedCategoryId,
  sortParam = "",
}: MobileCategorySelectorProps) {
  const router = useRouter()

  // Trouver le nom de la catégorie sélectionnée
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)

  return (
    <div className="mt-3 w-full md:hidden">
      <Select
        value={selectedCategoryId}
        onValueChange={(value) => {
          router.push(`/categories?category=${value}${sortParam ? `&sort=${sortParam}` : ""}`)
        }}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder={selectedCategory?.name || "Sélectionner une catégorie"} />
        </SelectTrigger>
        <SelectContent className="max-h-[60vh]">
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
