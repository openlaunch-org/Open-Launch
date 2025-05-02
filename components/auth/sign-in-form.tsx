"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { oneTap, signIn } from "@/lib/auth-client";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData, signInSchema } from "@/lib/validations/auth";
import { TurnstileCaptcha } from "./turnstile-captcha";
import { toast } from "sonner";

export function SignInForm() {
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
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
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

  const handleLoginEmail = async (data: SignInFormData) => {
    if (!turnstileToken) {
      setGeneralError("Please complete the security verification");
      return;
    }

    const options = {
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken,
        },
      },
    };

    try {
      setLoadingButtons((prevState) => ({ ...prevState, email: true }));
      setGeneralError(null);

      await signIn.email(options);
      router.push("/dashboard");
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form
            onSubmit={handleSubmit(handleLoginEmail)}
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
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
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
                {loadingButtons.email ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="hover:underline underline-offset-4 text-primary"
              >
                Sign up
              </Link>
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
