"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  Clock,
  ChevronRight,
  Search,
  Loader2,
  Target,
  Sparkles,
  LogOut,
  Layers,
} from "lucide-react";
import { projectService, Project } from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

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

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-400">
                Hello,{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.full_name?.split(" ")[0] || "User"}
                </span>
              </span>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/85 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-tight relative z-10 py-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Your Projects
            </h1>
            <p className="text-slate-600 mt-2 dark:text-slate-300">
              Manage and analyze your system designs
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="shine-border inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-float active:scale-[0.99] dark:bg-white dark:text-slate-900"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {projects.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Projects
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {projects.filter((p) => p.status === "ANALYZED").length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Analyzed
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {projects.filter((p) => p.status === "DRAFT").length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Progress
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {projects.reduce(
                    (acc, p) => acc + (p.suggestions?.length || 0),
                    0,
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Insights
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/60 border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-dashed border-slate-300 bg-white/50 p-16 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <LayoutGrid className="w-14 h-14 text-slate-300 mx-auto mb-6 dark:text-slate-600" />
            <h3 className="text-xl font-bold text-slate-950 mb-3 dark:text-white">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto dark:text-slate-400">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by creating your first system design project and let AI help you refine it."}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/new"
                className="shine-border inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-float active:scale-[0.99] dark:bg-white dark:text-slate-900"
              >
                <Plus className="w-4 h-4" />
                Create your first project
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="group rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "grid h-12 w-12 place-items-center rounded-2xl",
                            project.status === "ANALYZED"
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-500",
                          )}
                        >
                          {project.status === "ANALYZED" ? (
                            <Target className="w-6 h-6" />
                          ) : (
                            <Clock className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-950 group-hover:text-primary transition-colors dark:text-white">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-1 dark:text-slate-400">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                          <span
                            className={cn(
                              "text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full mb-1",
                              project.status === "ANALYZED"
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
                            )}
                          >
                            {project.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono dark:text-slate-500">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-primary transition-all dark:text-slate-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
