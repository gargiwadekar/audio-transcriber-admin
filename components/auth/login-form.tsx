"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isPending, startTransition] = useTransition();

  function validate() {
    if (!identifier.trim()) {
      return "Please enter your email or username.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errorMessage = validate();
    setValidationError(errorMessage);

    if (errorMessage) {
      return;
    }

    startTransition(async () => {
      try {
        const isEmail = identifier.includes("@");
        const response = isEmail
          ? await authClient.signIn.email({
              email: identifier,
              password,
              rememberMe: true,
            })
          : await authClient.signIn.username({
              username: identifier,
              password,
            });

        if (response.error) {
          setValidationError(response.error.message || "Invalid credentials.");
          return;
        }

        toast.success("Welcome back.");
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to sign in right now.";
        setValidationError(message);
      }
    });
  }

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white shadow-[0_18px_70px_rgba(37,99,235,0.08)]">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Admin Login
        </div>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to open the audio transcription dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or username</Label>
            <Input
              id="identifier"
              autoComplete="username"
              placeholder="Email or username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-700"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
          </div>
          {validationError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {validationError}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={isPending}>
            <LogIn className="h-4 w-4" />
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
