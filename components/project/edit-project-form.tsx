"use client"

import { useEffect, useState } from "react"

import { RiCheckLine, RiCloseLine, RiHashtag, RiLoader4Line } from "@remixicon/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateProject } from "@/app/actions/project-details"
import { getAllCategories } from "@/app/actions/projects"

interface EditProjectFormProps {
  projectId: string
  initialDescription: string
  initialCategories: { id: string; name: string }[]
  onUpdate: () => void
  onCancel: () => void
}

export function EditProjectForm({
  projectId,
  initialDescription,
  initialCategories,
  onUpdate,
  onCancel,
}: EditProjectFormProps) {
  const [description, setDescription] = useState(initialDescription)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories.map((cat) => cat.id),
  )
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Charger toutes les catégories lors de l'initialisation
  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true)
      try {
        const allCategories = await getAllCategories()
        setCategories(allCategories)
      } catch (error) {
        console.error("Failed to load categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category")
      return
    }

    setIsSaving(true)

    try {
      const result = await updateProject(projectId, {
        description,
        categories: selectedCategories,
      })

      if (result.success) {
        toast.success("Project updated successfully")
        onUpdate()
      } else {
        toast.error(result.error || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Gérer l'ajout/suppression d'une catégorie
  const handleCategoryChange = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      // Limiter à 3 catégories maximum
      if (selectedCategories.length >= 3) {
        toast.error("Maximum 3 categories allowed")
        return
      }
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[150px]"
          placeholder="Enter project description"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Categories <span className="text-muted-foreground text-xs">(maximum 3)</span>
        </label>

        {/* Selected categories */}
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId)
            return cat ? (
              <Badge key={cat.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <RiHashtag className="h-3 w-3" />
                {cat.name}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground ml-1 cursor-pointer"
                  onClick={() => handleRemoveCategory(cat.id)}
                >
                  ×
                </button>
              </Badge>
            ) : null
          })}
        </div>

        {/* Category selector */}
        <Select
          onValueChange={handleCategoryChange}
          disabled={isLoading || selectedCategories.length >= 3}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoading
                  ? "Loading categories..."
                  : selectedCategories.length >= 3
                    ? "Maximum 3 categories reached"
                    : "Add a category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    disabled={selectedCategories.includes(cat.id)}
                  >
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          <RiCloseLine className="mr-1 h-4 w-4" />
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving || selectedCategories.length === 0}>
          {isSaving ? (
            <>
              <RiLoader4Line className="mr-1 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <RiCheckLine className="mr-1 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
