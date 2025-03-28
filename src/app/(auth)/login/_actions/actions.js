"use server";

import { signIn } from "@/lib/auth";

import { schema } from "@/lib/schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function login(prevState, formData) {
  const credentials = schema.safeParse(Object.fromEntries(formData.entries()));
  if (credentials.success === false) {
    return credentials.error.formErrors.fieldErrors;
  }
  const data = credentials.data;

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    switch (error.type) {
      case "CredentialsSignin":
        return { error: "Invalid credentials" };

      default:
        return { error: "Something went wrong" };
    }
  }
}
