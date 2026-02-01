"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Logo } from "@/components/ui/Logo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex justify-center mb-6">
            <Logo size={48} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Continue your design journey
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[10px] mt-2 font-medium bg-red-400/10 px-2 py-1 rounded inline-block">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-[10px] mt-2 font-medium bg-red-400/10 px-2 py-1 rounded inline-block">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-black uppercase tracking-widest text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign Architecture
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 font-medium">
            New to SystemCraft?{" "}
            <Link
              href="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-bold border-b border-indigo-400/30"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
