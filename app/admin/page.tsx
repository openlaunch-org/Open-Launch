"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Ban,
  Loader2,
  LucideRefreshCcw,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  UserCircle,
  X,
} from "lucide-react"
import { toast, Toaster } from "sonner"

import { admin } from "@/lib/auth-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Types
type User = {
  id: string
  email: string
  name: string
  role?: string
  banned?: boolean | null
  createdAt?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<string | undefined>()
  const [isUsersLoading, setIsUsersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch users
  const fetchUsers = async () => {
    setIsUsersLoading(true)
    try {
      const response = await admin.listUsers({
        query: {
          limit: 100, // Fetch a larger number, we'll handle pagination on the client
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })

      // Vérification du format de la réponse et extraction des données
      if (response && response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users as User[])
        setFilteredUsers(response.data.users as User[])
        console.log("Users loaded:", response.data.users.length)
      } else {
        console.error("Unexpected response format:", response)
        setUsers([])
        setFilteredUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch users")
      setUsers([])
      setFilteredUsers([])
    } finally {
      setIsUsersLoading(false)
    }
  }

  // Filter users based on search query, role and status
  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "banned") {
        result = result.filter((user) => user.banned === true)
      } else if (statusFilter === "active") {
        result = result.filter((user) => user.banned !== true)
      }
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, roleFilter, statusFilter, users])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Delete user
  const handleDeleteUser = async (id: string) => {
    setIsLoading(`delete-${id}`)
    try {
      await admin.removeUser({ userId: id })
      toast.success("User deleted successfully")
      fetchUsers() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setIsLoading(undefined)
      setUserToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  // Confirm delete dialog
  const openDeleteDialog = (id: string) => {
    setUserToDelete(id)
    setShowDeleteDialog(true)
  }

  // Revoke user sessions
  const handleRevokeSessions = async (id: string) => {
    setIsLoading(`revoke-${id}`)
    try {
      await admin.revokeUserSessions({ userId: id })
      toast.success("Sessions revoked for user")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to revoke sessions")
    } finally {
      setIsLoading(undefined)
    }
  }

  // Impersonate user
  const handleImpersonateUser = async (id: string) => {
    setIsLoading(`impersonate-${id}`)
    try {
      await admin.impersonateUser({ userId: id })
      toast.success("Impersonated user")
      router.push("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to impersonate user")
    } finally {
      setIsLoading(undefined)
    }
  }

  // Ban user
  const handleBanUser = async (id: string) => {
    setIsLoading(`ban-${id}`)
    try {
      // Ban for 30 days
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
      await admin.banUser({
        userId: id,
        banReason: "Admin action",
        banExpiresIn: thirtyDaysInMs,
      })
      toast.success("User banned successfully")
      fetchUsers() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to ban user")
    } finally {
      setIsLoading(undefined)
    }
  }

  // Unban user
  const handleUnbanUser = async (id: string) => {
    setIsLoading(`unban-${id}`)
    try {
      await admin.unbanUser({
        userId: id,
      })
      toast.success("User unbanned successfully")
      fetchUsers() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unban user")
    } finally {
      setIsLoading(undefined)
    }
  }

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Get unique roles for filtering
  const uniqueRoles = Array.from(new Set(users.map((user) => user.role || "user")))

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setRoleFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-4 py-4">
      <Toaster richColors position="top-center" />

      <Card className="bg-card overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-card/80 space-y-2 border-b px-6 py-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-xl font-medium tracking-tight">User Management</CardTitle>
              <CardDescription className="text-sm">
                Manage users and their permissions
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchUsers()}
              className="flex h-9 items-center px-3"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Filters Section */}
          <div className="border-b px-6 pb-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform"
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Role Filter */}
              <div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters - only shown when filters are active */}
              {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="mt-2 h-9 text-xs sm:col-span-1 sm:mt-0 sm:justify-self-start lg:col-span-4 lg:justify-self-end"
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* User Table */}
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-muted-foreground w-[40%] py-3 pl-6 text-xs font-medium sm:w-[30%]">
                        User
                      </TableHead>
                      <TableHead className="text-muted-foreground hidden py-3 text-xs font-medium md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="text-muted-foreground py-3 text-center text-xs font-medium">
                        Role
                      </TableHead>
                      <TableHead className="text-muted-foreground py-3 text-center text-xs font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground w-[60px] py-3 pr-6 text-right text-xs font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentUsers.map((user) => (
                        <TableRow key={user.id} className="group">
                          <TableCell className="py-3 pl-6">
                            <div className="flex flex-col">
                              <span className="truncate text-sm font-medium">
                                {user.name || "—"}
                              </span>
                              <span className="text-muted-foreground mt-0.5 truncate text-xs md:hidden">
                                {user.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden truncate py-3 text-xs md:table-cell">
                            {user.email}
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <Badge
                              variant={user.role === "admin" ? "secondary" : "outline"}
                              className="px-2 py-0.5 text-xs font-normal"
                            >
                              {user.role || "user"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            {user.banned ? (
                              <Badge
                                variant="destructive"
                                className="px-2 py-0.5 text-xs font-normal"
                              >
                                Banned
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 px-2 py-0.5 text-xs font-normal text-green-600 dark:border-emerald-600/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                              >
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-3 pr-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                                  aria-label="Open actions menu"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs font-medium">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleImpersonateUser(user.id)}
                                  disabled={isLoading === `impersonate-${user.id}`}
                                  className="cursor-pointer text-xs"
                                >
                                  {isLoading === `impersonate-${user.id}` ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <UserCircle className="mr-2 h-3.5 w-3.5" />
                                  )}
                                  Impersonate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRevokeSessions(user.id)}
                                  disabled={isLoading === `revoke-${user.id}`}
                                  className="cursor-pointer text-xs"
                                >
                                  {isLoading === `revoke-${user.id}` ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                  )}
                                  Revoke Sessions
                                </DropdownMenuItem>
                                {!user.banned ? (
                                  <DropdownMenuItem
                                    onClick={() => handleBanUser(user.id)}
                                    disabled={isLoading === `ban-${user.id}`}
                                    className="cursor-pointer text-xs"
                                  >
                                    {isLoading === `ban-${user.id}` ? (
                                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Ban className="mr-2 h-3.5 w-3.5" />
                                    )}
                                    Ban
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleUnbanUser(user.id)}
                                    disabled={isLoading === `unban-${user.id}`}
                                    className="cursor-pointer text-xs"
                                  >
                                    {isLoading === `unban-${user.id}` ? (
                                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <LucideRefreshCcw className="mr-2 h-3.5 w-3.5" />
                                    )}
                                    Unban
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-xs"
                                  onClick={() => openDeleteDialog(user.id)}
                                >
                                  <Trash className="text-destructive mr-2 h-3.5 w-3.5" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="bg-card/50 flex items-center justify-between border-t px-6 py-3">
                <div className="text-muted-foreground text-xs">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span> users
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-xs">Per page</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="border-muted bg-background h-8 w-[70px] text-xs">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                          <SelectItem key={size} value={size.toString()} className="text-xs">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-input bg-background flex items-center overflow-hidden rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (currentPage > 1) paginate(currentPage - 1)
                      }}
                      disabled={currentPage === 1}
                      className="h-8 w-8 rounded-none border-r"
                    >
                      <PaginationPrevious className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Previous page</span>
                    </Button>

                    <div className="flex h-8 min-w-[40px] items-center justify-center text-xs font-medium">
                      {currentPage}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (currentPage < totalPages) paginate(currentPage + 1)
                      }}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-8 w-8 rounded-none border-l"
                    >
                      <PaginationNext className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone and will permanently delete the user and all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              disabled={isLoading === `delete-${userToDelete}`}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              {isLoading === `delete-${userToDelete}` ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash className="mr-2 h-3.5 w-3.5" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
