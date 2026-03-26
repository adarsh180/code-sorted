"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema, signInSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export type AuthResult = {
  success: boolean;
  error?: string;
};

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = signUpSchema.safeParse(raw);
  if (!validated.success) {
    const firstError = validated.error.issues[0];
    return { success: false, error: firstError.message };
  }

  const { name, email, password } = validated.data;
  const normalizedEmail = email.toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      hashedPassword,
    },
  });

  // Sign in immediately after creation
  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Failed to sign in after registration" };
    }
    // NextAuth redirect error — this is actually success
    return { success: true };
  }
}

export async function signInAction(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = signInSchema.safeParse(raw);
  if (!validated.success) {
    const firstError = validated.error.issues[0];
    return { success: false, error: firstError.message };
  }

  try {
    await signIn("credentials", {
      email: raw.email.toLowerCase(),
      password: raw.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Something went wrong. Please try again." };
      }
    }
    // Redirect error from NextAuth = success
    return { success: true };
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
