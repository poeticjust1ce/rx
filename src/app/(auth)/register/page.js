"use client";

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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Syringe } from "lucide-react";

const page = () => {
  const router = useRouter();

  const userSchema = z
    .object({
      first_name: z.string().min(1, "First name cannot be blank"),
      last_name: z.string().min(1, "Last name cannot be blank"),
      email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email cannot be blank"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      confirmed: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmed, {
      message: "Passwords do not match",
      path: ["confirmed"],
    });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmed: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validated = userSchema.safeParse(formData);

    try {
      if (!validated.success) {
        const newErrors = validated.error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong!");
        setIsSubmitting(false);
        return;
      }
      toast.success(
        "Successfully created an account. Wait for an activation from the admin.",
        { duration: 3000 }
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      toast(err);
    }
  };

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
            Create a new account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={submitHandle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    name="first_name"
                    id="first_name"
                    type="text"
                    placeholder="John"
                    className="pl-9"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-sm text-destructive">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  name="last_name"
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmed">Confirm Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  name="confirmed"
                  id="confirmed"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={formData.confirmed}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmed && (
                <p className="text-sm text-destructive">{errors.confirmed}</p>
              )}
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
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
                  Creating account...
                </>
              ) : (
                <>Sign Up</>
              )}
            </Button>
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
