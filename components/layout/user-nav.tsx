"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  RiDashboardLine,
  RiLogoutCircleLine,
  RiSettings4Line,
  RiShieldUserLine,
} from "@remixicon/react"
import { User } from "better-auth"
import { ChevronDownIcon } from "lucide-react"

import { signOut } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps {
  user: User & { role?: string }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 cursor-pointer px-2 hover:bg-transparent hover:text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:hover:text-white"
        >
          <Avatar className="h-6 w-6">
            {user.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name || "User avatar"}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <AvatarFallback className="">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <ChevronDownIcon size={14} className="hidden opacity-60 md:block" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 overflow-y-auto" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex cursor-pointer items-center">
            <RiDashboardLine className="focus:text-primary mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {/* Lien vers le dashboard admin, visible uniquement pour les administrateurs */}
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex cursor-pointer items-center">
              <RiShieldUserLine className="focus:text-primary mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex cursor-pointer items-center">
            <RiSettings4Line className="focus:text-primary mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <RiLogoutCircleLine className="focus:text-primary mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
