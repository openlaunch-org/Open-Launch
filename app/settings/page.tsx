"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import {
  RiEditLine,
  RiLockPasswordLine,
  RiLogoutCircleLine,
  RiShieldUserLine,
  RiUserLine,
} from "@remixicon/react"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { changePassword, signOut, updateUser, useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Settings() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return null
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="mb-8 border-b pb-6 dark:border-zinc-800">
        <h1 className="font-heading text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-10">
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2.5">
              <RiUserLine className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Profile</h2>
              <p className="text-muted-foreground text-sm">
                Update your personal information and profile picture.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt="Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground max-w-[170px] truncate text-sm">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <EditProfileDialog />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2.5">
              <RiShieldUserLine className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Security</h2>
              <p className="text-muted-foreground text-sm">
                Manage your password and account security.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm dark:border-zinc-800">
            <h3 className="mb-1 text-base font-medium">Password</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Change your password to keep your account secure.
            </p>
            <ChangePasswordDialog />
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2.5">
              <RiLogoutCircleLine className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Session</h2>
              <p className="text-muted-foreground text-sm">
                Manage your current session and sign out.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm dark:border-zinc-800">
            <div>
              <h3 className="mb-1 text-base font-medium">Current Session</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Sign out from your current session.
              </p>
              <Button
                variant="destructive"
                className="hover:bg-destructive/90 cursor-pointer gap-2"
                onClick={() => {
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/")
                        router.refresh()
                      },
                    },
                  })
                }}
              >
                <RiLogoutCircleLine className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function EditProfileDialog() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="hover:bg-primary/5 cursor-pointer gap-2">
          <RiEditLine className="text-primary h-4 w-4" />
          <span className="hover:text-primary hidden md:block">Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border sm:max-w-[425px] dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold">Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-medium">
              Name
            </Label>
            <Input
              id="name"
              placeholder={session?.user.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border dark:border-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image" className="font-medium">
              Profile Image
            </Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="border-primary/10 relative h-16 w-16 overflow-hidden rounded-md border-2">
                  <Image src={imagePreview} alt="Profile preview" layout="fill" objectFit="cover" />
                </div>
              )}
              <div className="flex w-full items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer border dark:border-zinc-700"
                />
                {imagePreview && (
                  <X
                    className="hover:text-destructive cursor-pointer"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              try {
                await updateUser({
                  name: name || undefined,
                  image: image ? await convertImageToBase64(image) : undefined,
                })
                toast.success("Profile updated successfully")
                router.refresh()
                setOpen(false)
              } catch {
                toast.error("Failed to update profile")
              }
              setIsLoading(false)
              setName("")
              setImage(null)
              setImagePreview(null)
            }}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ChangePasswordDialog() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-primary/5 hover:text-primary max-w-fit cursor-pointer justify-start gap-2"
        >
          <RiLockPasswordLine className="text-primary h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border sm:max-w-[425px] dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold">Change Password</DialogTitle>
          <DialogDescription>Enter your current password and choose a new one</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="current" className="font-medium">
              Current Password
            </Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border dark:border-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new" className="font-medium">
              New Password
            </Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border dark:border-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm" className="font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border dark:border-zinc-700"
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button
            disabled={loading}
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match")
                return
              }
              if (newPassword.length < 8) {
                toast.error("Password must be at least 8 characters")
                return
              }
              setLoading(true)
              try {
                await changePassword({
                  currentPassword,
                  newPassword,
                })
                toast.success("Password changed successfully")
                setOpen(false)
              } catch {
                toast.error("Failed to change password")
              }
              setLoading(false)
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
            }}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
