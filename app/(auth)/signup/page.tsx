"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const signupSchema = z.z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Sign up
      await api.post("/auth/signup", data);

      // 2. Log in automatically after signup
      const loginFormData = new URLSearchParams();
      loginFormData.append("username", data.email);
      loginFormData.append("password", data.password);

      const response = await api.post("/auth/login", loginFormData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const userResponse = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });

      login(response.data.access_token, userResponse.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 grid-glow" />
      <div className="pointer-events-none absolute inset-0 noise opacity-60" />

      {/* Nav Link */}
      <div className="absolute top-0 left-0 right-0 z-50 border-b border-transparent bg-background/70 backdrop-blur">
        <div className="container-tight flex h-14 items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2"
            data-testid="link-home"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              IdeaLLD
            </span>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card Container */}
        <div className="shine-border rounded-3xl border border-white/10 bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-white/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl mb-6 shadow-lg dark:bg-white">
              <Sparkles className="w-7 h-7 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Create Account
            </h1>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed dark:text-slate-300">
              Join IdeaLLD to level up your design skills
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("full_name")}
                  className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="John Doe"
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              className="shine-border w-full bg-slate-900 hover:shadow-float text-white font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 group shadow-lg active:scale-[0.99] dark:bg-white dark:text-slate-900"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Terms Note */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
