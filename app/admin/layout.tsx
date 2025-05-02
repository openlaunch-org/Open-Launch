import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifier si l'utilisateur est connecté et est admin
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session?.user.role !== "admin") {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas un administrateur
    redirect("/");
  }

  return <div>{children}</div>;
}
