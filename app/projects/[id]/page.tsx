"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  Sparkles,
  AlertTriangle,
  Info,
  XCircle,
  ChevronLeft,
  Loader2,
  RefreshCcw,
  FileEdit,
  Activity,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { projectService, Project } from "@/services/projectService";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "suggestions">(
    "editor",
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const data = await projectService.getById(id as string);
      setProject(data);
      setContent(data.design_details?.content || "");
    } catch (error) {
      console.error("Failed to fetch project", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [id, fetchProject]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await projectService.updateDesign(id as string, content);
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // First save current content
      await handleSave();
      // Then trigger analysis
      await api.post(`/analysis/${id}`);
      // Refresh project to get new suggestions
      await fetchProject();
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 grid-glow opacity-30" />
      <div className="pointer-events-none fixed inset-0 noise opacity-40" />

      {/* Navbar */}
      <div className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
        <div className="container-tight flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                {project.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/85 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:border-white/10"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="shine-border inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-float active:scale-[0.99] dark:bg-white dark:text-slate-900"
            >
              {isAnalyzing ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Analyze Design</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-tight relative z-10 py-6">
        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {project.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-180px)]">
          {/* Editor Section */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Tab Switcher (Mobile) */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 self-start lg:hidden dark:bg-white/5">
              <button
                onClick={() => setActiveTab("editor")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                  activeTab === "editor"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
                )}
              >
                <FileEdit className="w-3.5 h-3.5" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                  activeTab === "suggestions"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
                )}
              >
                <Activity className="w-3.5 h-3.5" />
                Insights ({project.suggestions?.length || 0})
              </button>
            </div>

            {/* Editor Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "flex-1 flex flex-col rounded-2xl border bg-white/80 shadow-sm backdrop-blur overflow-hidden dark:border-white/10 dark:bg-white/5",
                activeTab === "suggestions" && "hidden lg:flex",
              )}
            >
              {/* Editor Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b bg-slate-50/50 dark:bg-white/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Blueprint Editor
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                  <span>{content.length} chars</span>
                  <span>
                    {content.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full bg-transparent p-6 text-slate-700 font-mono text-sm resize-none focus:outline-none leading-relaxed dark:text-slate-200"
                placeholder="Start drafting your system design details...

Example:
• We will use a sharded PostgreSQL database with a Redis write-through cache
• The API Gateway will use rate limiting with token bucket algorithm
• Message queue (Kafka) for async processing of heavy tasks"
              />
            </motion.div>
          </div>

          {/* Insights Sidebar */}
          <div
            className={cn(
              "lg:col-span-5 flex flex-col gap-4",
              activeTab === "editor" && "hidden lg:flex",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-white">
                  Analysis Insights
                </h2>
              </div>
              <span className="text-[10px] bg-primary/10 px-2.5 py-1 rounded-full text-primary font-semibold">
                {project.suggestions?.length || 0} FINDINGS
              </span>
            </div>

            {/* Suggestions List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 overflow-y-auto space-y-3 pr-1"
            >
              {!project.suggestions || project.suggestions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4 dark:text-slate-600" />
                  <p className="text-slate-500 text-sm dark:text-slate-400">
                    No analysis performed yet. Click{" "}
                    <span className="font-semibold text-primary">
                      &quot;Analyze Design&quot;
                    </span>{" "}
                    to start the review.
                  </p>
                </div>
              ) : (
                project.suggestions?.map((suggestion, idx) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div
                      className={cn(
                        "rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur transition-all cursor-pointer hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                        expandedId === suggestion.id &&
                          "ring-2 ring-primary/20 dark:ring-primary/30",
                      )}
                      onClick={() =>
                        setExpandedId(
                          expandedId === suggestion.id ? null : suggestion.id,
                        )
                      }
                    >
                      <div className="flex gap-3">
                        {/* Severity Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {suggestion.severity === "CRITICAL" && (
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 dark:bg-red-500/10">
                              <XCircle className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                          {suggestion.severity === "WARNING" && (
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </div>
                          )}
                          {suggestion.severity === "INFO" && (
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                              <Info className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide dark:text-slate-500">
                              {suggestion.category}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold",
                                suggestion.severity === "CRITICAL" &&
                                  "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
                                suggestion.severity === "WARNING" &&
                                  "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                                suggestion.severity === "INFO" &&
                                  "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                              )}
                            >
                              {suggestion.severity}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-slate-900 mb-2 dark:text-white">
                            {suggestion.title}
                          </h3>

                          <div
                            className={cn(
                              "text-xs text-slate-500 leading-relaxed overflow-hidden transition-all duration-300 dark:text-slate-400",
                              expandedId === suggestion.id
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0",
                            )}
                          >
                            <div className="pt-2 whitespace-pre-wrap border-t border-slate-100 dark:border-white/5">
                              {suggestion.description}
                            </div>
                          </div>

                          {expandedId !== suggestion.id && (
                            <div className="text-[10px] text-primary font-semibold uppercase tracking-wide mt-1">
                              Click to expand →
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
