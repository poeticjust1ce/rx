"use client";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "./_actions/actions";
import Link from "next/link";
import { Lock, Mail, Syringe } from "lucide-react";

const page = () => {
  const [error, action] = useActionState(login, {});

  return (
    <div className="w-full flex items-center justify-center h-[90%]">
      <Card className="w-full max-w-sm shadow-sm relative z-10 backdrop-blur-sm bg-background/90">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Syringe className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            RX Global SMC
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-9"
                />
              </div>
              {error.email && (
                <p className="text-sm text-destructive">{error.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
              {error.password && (
                <p className="text-sm text-destructive">{error.password}</p>
              )}
              {error.error && (
                <p className="text-sm text-destructive">{error.error}</p>
              )}
            </div>

            <LoginButton />
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Pharmaceutical Access
              </span>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );

  function LoginButton() {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Authenticating...
          </>
        ) : (
          <>Sign In</>
        )}
      </Button>
    );
  }
};

export default page;
