import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailSuccess() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] max-w-sm mx-auto">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <CircleCheck className="h-12 w-12 text-green-600" />
          <CardTitle className="text-2xl font-heading">
            Email Verified
          </CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. You can now sign in to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/sign-in">Continue to Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
