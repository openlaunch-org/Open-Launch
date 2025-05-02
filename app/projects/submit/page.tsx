import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SubmitProjectForm } from "@/components/project/submit-form";

export default async function SubmitProject() {
  // Verify the user is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to login if no session
  if (!session?.user) {
    redirect("/sign-in?redirect=/projects/submit");
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-background/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Submit a Project
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share your project with the community. Fill in the details below.
          </p>
        </div>

        <div className="bg-card border rounded-lg sm:rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 md:p-8">
            <SubmitProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}
