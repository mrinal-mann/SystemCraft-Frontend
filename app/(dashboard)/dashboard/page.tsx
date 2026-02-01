"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, FolderOpen, ArrowRight } from "lucide-react";
import { projectService, Project } from "@/services/projectService";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = project.title?.toLowerCase().includes(query) ?? false;
    const descriptionMatch =
      project.description?.toLowerCase().includes(query) ?? false;
    return titleMatch || descriptionMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 pt-16 pb-24">
      {/* Header Row - Title + New Project Button */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-100 italic tracking-tight underline decoration-indigo-500/30 underline-offset-8">
            Projects
          </h1>
          <p className="text-sm text-gray-500 mt-3 font-medium">
            Manage and analyze your system designs
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search - Full Width */}
      <div className="mb-12">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-800/30 rounded-[32px] border border-white/5 p-20 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
            <FolderOpen className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-lg font-bold text-gray-200 mb-3">
            {searchQuery ? "No matching projects" : "No projects yet"}
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto font-medium leading-relaxed">
            {searchQuery
              ? "Try adjusting your search query to find what you're looking for."
              : "Kickstart your design journey by creating your first system design project."}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-gray-300 text-sm font-bold rounded-xl border border-white/5 hover:bg-slate-700 transition-all shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group bg-[#0F172A] border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all duration-500 w-full max-w-[520px] relative overflow-hidden flex flex-col shadow-2xl hover:shadow-indigo-500/5"
            >
              {/* Subtle hover background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all" />

              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all duration-500">
                    <FolderOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                      project.status === "ANALYZED"
                        ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.1)]"
                        : project.status === "IN_PROGRESS"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                          : "bg-slate-800/50 text-gray-500 border-white/5"
                    }`}
                  >
                    {project.status === "ANALYZED"
                      ? "Analyzed"
                      : project.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Draft"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors mb-3 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-8 flex-1 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">
                  {project.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-2.5 flex-1 max-w-[160px]">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                      <span>Maturity</span>
                      <span className="text-gray-400">
                        {project.maturity_score || 0}/5
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-all duration-1000"
                        style={{
                          width: `${((project.maturity_score || 0) / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="ml-4 w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 border border-indigo-500/20">
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
