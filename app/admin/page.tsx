"use client"

import { MouseEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Ban,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCog,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { admin } from "@/lib/auth-client"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  addNewCategory,
  deleteCategory,
  getAdminStatsAndUsers,
  getAllCategories,
} from "@/app/actions/projects"

type User = {
  id: string
  email: string
  name: string
  role?: string | undefined
  banned?: boolean | null
  createdAt?: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<
    { id: string; name: string; createdAt: Date; updatedAt: Date }[]
  >([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState<{
    totalLaunches: number
    premiumLaunches: number
    premiumPlusLaunches: number
    totalUsers: number
  }>({ totalLaunches: 0, premiumLaunches: 0, premiumPlusLaunches: 0, totalUsers: 0 })
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState<string | undefined>()
  const [newCategory, setNewCategory] = useState("")
  const router = useRouter()
  useIsMobile()

  // Fetch users and stats
  const fetchUsersAndStats = async () => {
    setLoading(true)
    try {
      const { users, stats } = await getAdminStatsAndUsers()
      const categories = await getAllCategories()

      const mappedUsers = users.map((u) => ({
        ...u,
        role: u.role ?? undefined,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
      }))
      setUsers(mappedUsers)
      setFilteredUsers(mappedUsers)
      setStats(stats)
      setCategories(categories)
    } catch {
      setUsers([])
      setFilteredUsers([])
      setStats({ totalLaunches: 0, premiumLaunches: 0, premiumPlusLaunches: 0, totalUsers: 0 })
      setCategories([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsersAndStats()
  }, [])

  // Filtres
  useEffect(() => {
    let result = [...users]
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query),
      )
    }
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }
    if (statusFilter !== "all") {
      if (statusFilter === "banned") {
        result = result.filter((user) => user.banned === true)
      } else if (statusFilter === "active") {
        result = result.filter((user) => user.banned !== true)
      }
    }
    setFilteredUsers(result)
    setCurrentPage(1)
  }, [searchQuery, roleFilter, statusFilter, users])

  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const uniqueRoles = Array.from(new Set(users.map((user) => user.role || "user")))

  const addCategoryHandler = async () => {
    if (!newCategory) return
    setIsLoading("add-category")
    try {
      await addNewCategory(newCategory)
      toast.success("Category added successfully")
      setNewCategory("")
      fetchUsersAndStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add category")
    } finally {
      setIsLoading(undefined)
    }
  }

  const deleteCategoryHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    const categoryId = e.currentTarget.getAttribute("data-category-id")
    if (!categoryId) return
    setIsLoading("delete-category")
    try {
      await deleteCategory(categoryId)
      toast.success("Category deleted successfully")
      fetchUsersAndStats()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category")
    } finally {
      setIsLoading(undefined)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-2 pt-8 pb-16 sm:px-6">
      <h1 className="mb-4 text-2xl font-bold">Admin dashboard</h1>
      <div className="bg-card divide-border mb-6 grid grid-cols-2 items-stretch justify-between gap-0 overflow-hidden rounded-md border sm:flex sm:flex-row sm:divide-x">
        <div className="flex flex-1 flex-col items-center justify-center px-1 py-2 sm:px-2 sm:py-3">
          <span className="text-muted-foreground mb-0.5 text-[10px] sm:mb-1 sm:text-xs">Users</span>
          <span className="text-base font-bold sm:text-xl">{stats.totalUsers}</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-1 py-2 sm:px-2 sm:py-3">
          <span className="text-muted-foreground mb-0.5 text-[10px] sm:mb-1 sm:text-xs">
            Projects
          </span>
          <span className="text-base font-bold sm:text-xl">{stats.totalLaunches}</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-1 py-2 sm:px-2 sm:py-3">
          <span className="text-muted-foreground mb-0.5 text-[10px] sm:mb-1 sm:text-xs">
            Premium
          </span>
          <span className="text-base font-bold sm:text-xl">{stats.premiumLaunches}</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-1 py-2 sm:px-2 sm:py-3">
          <span className="text-muted-foreground mb-0.5 text-[10px] sm:mb-1 sm:text-xs">
            Premium Plus
          </span>
          <span className="text-base font-bold sm:text-xl">{stats.premiumPlusLaunches}</span>
        </div>
      </div>
      <div className="mb-2 flex gap-1 sm:gap-2">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-24 max-w-[110px] rounded-md border pr-2 pl-8 text-xs sm:w-64 sm:max-w-full"
            />
            <Search className="text-muted-foreground absolute top-2 left-2 h-4 w-4" />
          </div>
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-xs [&>svg:last-child]:hidden">
            <Users className="text-muted-foreground h-5 w-5" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="all">All roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-xs [&>svg:last-child]:hidden">
            <Shield className="text-muted-foreground h-5 w-5" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(v) => {
            setItemsPerPage(Number(v))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-xs [&>svg:last-child]:hidden">
            <Filter className="text-muted-foreground h-5 w-5" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="5">5 / page</SelectItem>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchUsersAndStats}
          className="flex h-8 w-8 items-center justify-center rounded-md p-0"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="text-muted-foreground h-8 w-8 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <div className="overflow-hidden rounded-md border">
              <table className="bg-card min-w-full text-sm">
                <thead className="bg-muted/40 rounded-t-md">
                  <tr>
                    <th className="rounded-tl-md p-2 text-left font-semibold">User</th>
                    <th className="p-2 text-left font-semibold">Email</th>
                    <th className="p-2 text-center font-semibold">Role</th>
                    <th className="p-2 text-center font-semibold">Status</th>
                    <th className="rounded-tr-md p-2 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 border-t">
                      <td className="max-w-[120px] truncate p-2 font-medium">{user.name || "—"}</td>
                      <td className="text-muted-foreground max-w-[180px] truncate p-2">
                        {user.email}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                          {user.role || "user"}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        {user.banned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-600"
                          >
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <DropdownMenuUserActions
                          user={user}
                          onRefresh={fetchUsersAndStats}
                          router={router}
                          setIsLoading={setIsLoading}
                          isLoading={isLoading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-card divide-y overflow-hidden rounded-md border text-xs sm:hidden">
            <div className="bg-muted/40 text-muted-foreground flex font-semibold">
              <div className="w-1/3 px-2 py-2">User</div>
              <div className="w-1/3 px-2 py-2">Email</div>
              <div className="w-1/4 px-2 py-2 text-center">Status</div>
              <div className="w-1/6 px-2 py-2 text-right">Actions</div>
            </div>
            {currentUsers.map((user) => (
              <div key={user.id} className="flex items-center">
                <div className="w-1/3 truncate px-2 py-2 font-medium">{user.name || "—"}</div>
                <div className="text-muted-foreground w-1/3 truncate px-2 py-2">{user.email}</div>
                <div className="w-1/4 px-2 py-2 text-center">
                  {user.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-600"
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <div className="w-1/6 px-2 py-2 text-right">
                  <DropdownMenuUserActions
                    user={user}
                    onRefresh={fetchUsersAndStats}
                    router={router}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-xs font-medium">{currentPage}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Categories</h2>
        <div className="overflow-hidden rounded-md border">
          <table className="bg-card min-w-full text-sm">
            <thead className="bg-muted/40 rounded-t-md">
              <tr>
                <th className="rounded-tl-md p-2 text-left font-semibold">Category</th>
                <th className="p-2 text-left font-semibold">Created At</th>
                <th className="p-2 text-left font-semibold">Updated At</th>
                <th className="rounded-tr-md p-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-muted/10 border-t">
                  <td className="max-w-[120px] truncate p-2 font-medium">{category.name}</td>
                  <td className="text-muted-foreground max-w-[180px] truncate p-2">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-muted-foreground max-w-[180px] truncate p-2">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={deleteCategoryHandler}
                      data-category-id={category.id}
                      disabled={isLoading === "delete-category"}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="h-8 w-full max-w-sm rounded-md border pr-2 pl-2 text-sm"
          />
          <Button size="sm" onClick={addCategoryHandler} disabled={isLoading === "add-category"}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

function DropdownMenuUserActions({
  user,
  onRefresh,
  router,
  setIsLoading,
  isLoading,
}: {
  user: User
  onRefresh: () => Promise<void>
  router: any // eslint-disable-line @typescript-eslint/no-explicit-any
  setIsLoading: (value: string | undefined) => void
  isLoading: string | undefined
}) {
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
      onRefresh() // Refresh the list
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
      onRefresh() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unban user")
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

  // Delete user
  const handleDeleteUser = async (id: string) => {
    setIsLoading(`delete-${id}`)
    try {
      await admin.removeUser({ userId: id })
      toast.success("User deleted successfully")
      onRefresh() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setIsLoading(undefined)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-md">
        <DropdownMenuItem
          onClick={() => (user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id))}
          disabled={
            isLoading?.startsWith(`ban-${user.id}`) || isLoading?.startsWith(`unban-${user.id}`)
          }
          className="focus:bg-accent focus:text-accent-foreground group rounded-md"
        >
          <Ban className="text-muted-foreground mr-2 h-4 w-4 transition-colors group-hover:text-white group-focus:text-white" />
          <span>{user.banned ? "Unban" : "Ban"} User</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleImpersonateUser(user.id)}
          disabled={isLoading === `impersonate-${user.id}`}
          className="focus:bg-accent focus:text-accent-foreground group rounded-md"
        >
          <UserCog className="text-muted-foreground mr-2 h-4 w-4 transition-colors group-hover:text-white group-focus:text-white" />
          <span>Impersonate</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteUser(user.id)}
          disabled={isLoading === `delete-${user.id}`}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive group rounded-md"
        >
          <Trash2 className="group-focus:text-destructive group-hover:text-destructive text-muted-foreground mr-2 h-4 w-4 transition-colors" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
