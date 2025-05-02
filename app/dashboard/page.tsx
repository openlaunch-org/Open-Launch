import Image from "next/image";
import Link from "next/link";
import {
  getUserUpvotedProjects,
  getUserCreatedProjects,
} from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RiAddLine,
  RiCalendarLine,
  RiThumbUpLine,
  RiRocketLine,
  RiFireLine,
  RiHashtag,
} from "@remixicon/react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card";

// Base project type that matches the actual structure from the database
interface BaseProject {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  launchStatus: string;
  scheduledLaunchDate?: string | Date | null;
  upvoteCount?: string | number | null;
  commentCount?: string | number | null;
  websiteUrl?: string | null;
  createdAt: string | Date;
  createdBy?: string | null;
}

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is not logged in, we shouldn't be here
  if (!session?.user?.id) {
    return null;
  }

  // Get data from actions
  const upvotedProjectsData = await getUserUpvotedProjects();
  const createdProjectsData = await getUserCreatedProjects();

  // Process the data to match our expected formats
  const upvotedProjects = upvotedProjectsData.map(
    (item) => item.project
  ) as BaseProject[];

  const createdProjects = createdProjectsData as BaseProject[];

  const upcomingLaunches = createdProjects.filter(
    (project) => project.launchStatus === "scheduled"
  );

  const activeLaunches = createdProjects.filter(
    (project) => project.launchStatus === "ongoing"
  );

  const previousLaunches = createdProjects.filter(
    (project) => project.launchStatus === "launched"
  );

  return (
    <div className="py-6 sm:py-8 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome, {session?.user?.name || "User"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link href="/">Explore Launches</Link>
              </Button>
              <Button asChild>
                <Link
                  href="/projects/submit"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <RiAddLine className="h-4 w-4" />
                  Submit a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - My Projects */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-heading font-semibold">
                    My Projects
                  </CardTitle>
                </div>
                <CardDescription>
                  Manage your submitted tech projects
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                <Tabs defaultValue="active">
                  <TabsList className="grid grid-cols-3 mb-4 w-full">
                    <TabsTrigger
                      value="active"
                      className="cursor-pointer text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-1 "
                    >
                      Active ({activeLaunches.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="upcoming"
                      className="cursor-pointer text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-1"
                    >
                      Upcoming ({upcomingLaunches.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="cursor-pointer text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-1"
                    >
                      Past ({previousLaunches.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-0">
                    {upcomingLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                          <RiCalendarLine className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">
                          No upcoming launches
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don&apos;t have any scheduled project launches yet
                        </p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">Submit a Project</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="mt-0">
                    {activeLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {activeLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                          <RiRocketLine className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">No active launches</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don&apos;t have any active project launches at the
                          moment
                        </p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">Submit a Project</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-0">
                    {previousLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {previousLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                          <RiRocketLine className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">No past launches</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You haven&apos;t launched any projects yet
                        </p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">Submit a Project</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Upvotes Section */}
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-heading font-semibold">
                    Recent Upvotes
                  </CardTitle>
                </div>
                <CardDescription>
                  Projects you&apos;ve recently upvoted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upvotedProjects.length > 0 ? (
                    upvotedProjects
                      .slice(0, 4)
                      .map((project) => (
                        <DashboardProjectCard key={project.id} {...project} />
                      ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                        <RiThumbUpLine className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">No upvotes yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven&apos;t upvoted any projects yet
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/trending">Explore Projects</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile and Actions */}
          <div className="space-y-6">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-heading font-semibold">
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border">
                    {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name || "User"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="object-cover w-full h-full flex items-center justify-center text-2xl font-bold">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">
                      {session?.user?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button variant="outline" asChild className="w-full">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 justify-center"
                  >
                    <RiRocketLine className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-heading font-semibold">
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" asChild className="justify-start">
                  <Link
                    href="/projects/submit"
                    className="flex items-center gap-2"
                  >
                    <RiAddLine className="h-4 w-4" />
                    Submit a Project
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/" className="flex items-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    Explore Launches
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/winners" className="flex items-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    Winners
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/trending" className="flex items-center gap-2">
                    <RiFireLine className="h-4 w-4" />
                    Trending Projects
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/categories" className="flex items-center gap-2">
                    <RiHashtag className="h-4 w-4" />
                    Explore categories
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
