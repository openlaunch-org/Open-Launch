"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RiDashboardLine,
  RiLogoutCircleLine,
  RiSettings4Line,
  RiShieldUserLine,
} from "@remixicon/react";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "better-auth";

interface UserNavProps {
  user: User & { role?: string };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-transparent hover:text-black dark:hover:text-white cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <AvatarFallback className="">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <ChevronDownIcon
            size={14}
            className="opacity-60 hidden md:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 overflow-y-auto"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer flex items-center">
            <RiDashboardLine className="mr-2 h-4 w-4 focus:text-primary" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {/* Lien vers le dashboard admin, visible uniquement pour les administrateurs */}
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer flex items-center">
              <RiShieldUserLine className="mr-2 h-4 w-4 focus:text-primary" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center">
            <RiSettings4Line className="mr-2 h-4 w-4 focus:text-primary" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <RiLogoutCircleLine className="mr-2 h-4 w-4 focus:text-primary" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
