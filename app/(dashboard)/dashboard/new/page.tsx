"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  FileText,
  ChevronLeft,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { projectService } from "@/services/projectService";

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    design_content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const project = await projectService.create(formData);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Failed to create project", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 grid-glow opacity-50" />
      <div className="pointer-events-none fixed inset-0 noise opacity-40" />

      {/* Navbar */}
      <div className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
        <div className="container-tight flex h-14 items-center justify-between">
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

      {/* Main Content */}
      <div className="container-tight relative z-10 py-10">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 group dark:text-slate-400 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              New Project
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mb-3 dark:text-white">
              Initialize New Design
            </h1>
            <p className="text-slate-600 text-lg dark:text-slate-300">
              Describe your system architecture to start receiving AI-powered
              feedback.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="shine-border rounded-3xl border border-white/10 bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-white/5">
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Project Title
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        formData.title.length >= 250
                          ? "text-red-500"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {formData.title.length}/255
                    </span>
                  </div>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      required
                      maxLength={255}
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                      placeholder="e.g., URL Shortener Service"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                    Core Objective
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-sm dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                    placeholder="What is the high-level goal of this system?"
                  />
                </div>

                {/* Design Content Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                    Detailed System Architecture (LLD)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea
                      rows={10}
                      value={formData.design_content}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          design_content: e.target.value,
                        })
                      }
                      className="w-full bg-white/60 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none font-mono text-sm leading-relaxed dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
                      placeholder={`Paste your full design here...

Example:
• Database: PostgreSQL with sharding strategy
• Cache: Redis LRU for hot URLs
• Message Queue: Kafka for async processing
• API Gateway: Rate limiting with token bucket
• Scaling: Kubernetes HPA with Load Balancer`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="shine-border flex-1 bg-slate-900 hover:shadow-float text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 group shadow-lg active:scale-[0.99] dark:bg-white dark:text-slate-900"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Launch Design Mentor
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border bg-white/60 text-slate-700 font-medium shadow-sm backdrop-blur transition hover:bg-white/85 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:border-white/10"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
