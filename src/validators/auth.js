import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(254);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email,
  password: z.string().min(10).max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(72),
  newPassword: z.string().min(10).max(72),
});