"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { oneTap, signIn, signUp } from "@/lib/auth-client";
import { RiGoogleFill, RiGithubFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth";
import { TurnstileCaptcha } from "./turnstile-captcha";
import { toast } from "sonner";

export function SignUpForm() {
  const router = useRouter();
  const [loadingButtons, setLoadingButtons] = useState({
    google: false,
    email: false,
    github: false,
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoadingButtons((prevState) => ({ ...prevState, [provider]: true }));
    try {
      await signIn.social({
        provider: provider as "google" | "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoadingButtons((prevState) => ({ ...prevState, [provider]: false }));
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    if (!turnstileToken) {
      setGeneralError("Please complete the security verification");
      return;
    }

    const options = {
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/verify-email/success",
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken,
        },
      },
    };

    try {
      setLoadingButtons((prevState) => ({ ...prevState, email: true }));
      setGeneralError(null);

      await signUp.email(options);
      router.push("/verify-email/sent");
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoadingButtons((prevState) => ({ ...prevState, email: false }));
    }
  };

  useEffect(() => {
    oneTap({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "An error occurred");
        },
        onSuccess: () => {
          toast.success("Successfully signed in");
          window.location.href = "/dashboard";
        },
      },
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 sm:px-0">
      <Card className="w-full shadow-none rounded-md">
        <CardHeader className="flex flex-col items-center gap-2 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="flex flex-col gap-4"
          >
            <Button
              className="cursor-pointer w-full"
              variant="outline"
              type="button"
              onClick={() => handleLogin("google")}
              disabled={loadingButtons.google}
            >
              <RiGoogleFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.google ? "Loading..." : "Login with Google"}
            </Button>
            <Button
              className="cursor-pointer w-full"
              variant="outline"
              type="button"
              onClick={() => handleLogin("github")}
              disabled={loadingButtons.github}
            >
              <RiGithubFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.github ? "Loading..." : "Login with GitHub"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Min. 8 characters"
                  className="w-full"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <TurnstileCaptcha
                onVerify={(token) => setTurnstileToken(token)}
              />

              {generalError && (
                <p className="text-sm text-red-500 text-center">
                  {generalError}
                </p>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loadingButtons.email || !turnstileToken}
              >
                {loadingButtons.email
                  ? "Creating account..."
                  : "Create account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground px-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="/legal/terms">Terms of Service</Link> and{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
