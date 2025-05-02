"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiPencilLine } from "@remixicon/react";
import { EditProjectForm } from "./edit-project-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditButtonProps {
  projectId: string;
  initialDescription: string;
  initialCategories: { id: string; name: string }[];
  isOwner: boolean;
  isScheduled: boolean;
}

export function EditButton({
  projectId,
  initialDescription,
  initialCategories,
  isOwner,
  isScheduled,
}: EditButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ne pas afficher le bouton si l'utilisateur n'est pas propriétaire ou si la chaîne n'est pas scheduled
  if (!isOwner || !isScheduled) {
    return null;
  }

  const handleUpdate = () => {
    // Fermer le dialogue et rafraîchir la page pour afficher les changements
    setIsDialogOpen(false);
    window.location.reload();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => setIsDialogOpen(true)}
      >
        <RiPencilLine className="h-4 w-4 mr-1" />
        Edit Project Details
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Project Information</DialogTitle>
          </DialogHeader>

          <EditProjectForm
            projectId={projectId}
            initialDescription={initialDescription}
            initialCategories={initialCategories}
            onUpdate={handleUpdate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
