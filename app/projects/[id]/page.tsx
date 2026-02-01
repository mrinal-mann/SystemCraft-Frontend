"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  projectService,
  Project,
  SuggestionStatus,
  ProjectEvolution,
} from "@/services/projectService";
import { Logo } from "@/components/ui/Logo";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "editor" | "suggestions" | "history"
  >("editor");
  const [evolution, setEvolution] = useState<ProjectEvolution | null>(null);
  const [statusFilter, setStatusFilter] = useState<SuggestionStatus | "ALL">(
    "ALL",
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const data = await projectService.getById(id as string);
      setProject(data);
      setContent(data.design_details?.content || "");
    } catch (err) {
      console.error("Failed to fetch project", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchEvolution = useCallback(async () => {
    try {
      const data = await projectService.getEvolution(id as string);
      setEvolution(data);
    } catch {
      console.log("No evolution data yet");
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
    fetchEvolution();
  }, [id, fetchProject, fetchEvolution]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await projectService.updateDesign(id as string, content);
      await fetchProject();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await handleSave();
      await projectService.analyze(id as string);
      await fetchProject();
      await fetchEvolution();
      setActiveTab("suggestions");
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusChange = async (
    suggestionId: number,
    newStatus: SuggestionStatus,
  ) => {
    setUpdatingId(suggestionId);
    try {
      await projectService.updateSuggestionStatus(suggestionId, newStatus);
      await fetchProject();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getFilteredSuggestions = () => {
    if (!project?.suggestions) return [];
    if (statusFilter === "ALL") return project.suggestions;
    return project.suggestions.filter((s) => s.status === statusFilter);
  };

  const counts = project?.suggestions
    ? {
        open: project.suggestions.filter((s) => s.status === "OPEN").length,
        addressed: project.suggestions.filter((s) => s.status === "ADDRESSED")
          .length,
        ignored: project.suggestions.filter((s) => s.status === "IGNORED")
          .length,
      }
    : { open: 0, addressed: 0, ignored: 0 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-inter">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-[#0B1220] border-b border-white/5 h-16 shrink-0 z-20">
          <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-slate-800 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="h-8 w-px bg-white/5" />
              <Logo size={24} showText={false} />
              <div>
                <h1 className="text-sm font-semibold text-gray-100 flex items-center gap-2 tracking-tight">
                  {project.title}
                  <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md font-black uppercase tracking-widest">
                    v{evolution?.versions.length || 1}
                  </span>
                </h1>
                <p className="text-xs text-gray-500 truncate max-w-[300px] font-medium">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end mr-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black">
                    Score
                  </span>
                  <span className="text-xs font-black text-green-400">
                    {project.maturity_score || 0}/5
                  </span>
                </div>
                <div className="w-32 h-1 bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)] transition-all duration-1000"
                    style={{
                      width: `${((project.maturity_score || 0) / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 bg-slate-800/50 border border-white/5 rounded-xl hover:bg-slate-800 hover:text-gray-200 disabled:opacity-50 transition-all font-mono"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Editor Area */}
          <div className="flex-1 flex flex-col bg-slate-900 border-r border-white/5">
            {/* Nav Tabs Bar */}
            <div className="px-6 h-14 bg-[#0B1220]/80 backdrop-blur-md border-b border-white/5 flex items-center gap-1">
              {[
                { id: "editor", label: "Design Editor", count: null },
                { id: "suggestions", label: "AI Feedback", count: counts.open },
                { id: "history", label: "Timeline", count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`relative px-5 h-full text-[13px] font-bold flex items-center gap-2.5 transition-all tracking-tight ${
                    activeTab === tab.id
                      ? "text-indigo-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeTab === tab.id
                          ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                          : "bg-slate-800 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden p-8 relative">
              {/* Distinct Surface Editor container */}
              <div className="h-full border border-white/10 rounded-2xl overflow-hidden bg-[#0F172A] shadow-2xl relative flex flex-col transition-all">
                {activeTab === "editor" && (
                  <div className="h-full flex flex-col">
                    {/* Editor Header Label */}
                    <div className="shrink-0 px-6 py-3 bg-[#0B1220]/40 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/20" />
                        </div>
                        <div className="h-4 w-px bg-white/5 mx-1" />
                        <span className="text-[11px] text-indigo-400 font-mono font-bold tracking-widest uppercase">
                          design.ll
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] font-black">
                        Architecture Descriptor
                      </span>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="flex-1 w-full p-10 text-[15px] text-gray-300 font-mono bg-transparent border-none resize-none focus:outline-none focus:ring-0 leading-[1.8] custom-scrollbar selection:bg-indigo-500/20 selection:text-indigo-200"
                      placeholder="Define your software architecture, classes, and logic flows here..."
                      spellCheck={false}
                    />
                  </div>
                )}

                {activeTab === "suggestions" && (
                  <div className="h-full flex flex-col bg-transparent overflow-hidden">
                    {/* Filters Header */}
                    <div className="shrink-0 p-5 border-b border-white/5 flex items-center gap-3 bg-[#0B1220]/20">
                      {["ALL", "OPEN", "ADDRESSED", "IGNORED"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() =>
                            setStatusFilter(filter as typeof statusFilter)
                          }
                          className={`px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                            statusFilter === filter
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                              : "bg-slate-800/50 text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10"
                          }`}
                        >
                          {filter}
                          {filter === "OPEN" && counts.open > 0 && (
                            <span className="ml-2 opacity-50">
                              ({counts.open})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Suggestions List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      {getFilteredSuggestions().length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                            <Sparkles className="w-8 h-8 text-slate-700" />
                          </div>
                          <p className="text-base font-bold text-gray-300 mb-2 tracking-tight">
                            {statusFilter === "ALL"
                              ? "Design hasn't been analyzed yet."
                              : `No feedbacks marked as ${statusFilter.toLowerCase()}.`}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            Run a scan to see architecture suggestions.
                          </p>
                        </div>
                      ) : (
                        getFilteredSuggestions().map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className={`bg-slate-800/40 rounded-2xl border border-white/5 overflow-hidden group transition-all duration-300 hover:border-white/10 ${
                              suggestion.status === "ADDRESSED"
                                ? "opacity-60"
                                : ""
                            } ${suggestion.status === "IGNORED" ? "opacity-30 grayscale" : ""}`}
                          >
                            <div className="flex h-full">
                              <div
                                className="w-1.5 shrink-0"
                                style={{
                                  backgroundColor:
                                    suggestion.status === "ADDRESSED"
                                      ? "#22C55E"
                                      : suggestion.status === "IGNORED"
                                        ? "#4B5563"
                                        : suggestion.severity === "CRITICAL"
                                          ? "#EF4444"
                                          : suggestion.severity === "WARNING"
                                            ? "#F59E0B"
                                            : "#6366F1",
                                }}
                              />
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between gap-6 mb-4">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">
                                        {suggestion.category}
                                      </span>
                                      {suggestion.status === "ADDRESSED" && (
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                      )}
                                    </div>
                                    <h4
                                      className={`text-lg font-bold text-gray-100 tracking-tight ${suggestion.status === "ADDRESSED" ? "line-through text-gray-500" : ""}`}
                                    >
                                      {suggestion.title}
                                    </h4>
                                  </div>
                                  <span
                                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                                      suggestion.status === "ADDRESSED"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : suggestion.severity === "CRITICAL"
                                          ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                                          : suggestion.severity === "WARNING"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                    }`}
                                  >
                                    {suggestion.status === "ADDRESSED"
                                      ? "Resolved"
                                      : suggestion.severity}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-400 leading-relaxed mb-8 font-medium">
                                  {suggestion.description}
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                  {suggestion.status === "OPEN" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            suggestion.id,
                                            "ADDRESSED",
                                          )
                                        }
                                        disabled={updatingId === suggestion.id}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-green-400 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-colors"
                                      >
                                        Mark Resolved
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            suggestion.id,
                                            "IGNORED",
                                          )
                                        }
                                        disabled={updatingId === suggestion.id}
                                        className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-600 bg-transparent border border-white/5 rounded-xl hover:bg-white/5 hover:text-gray-400 transition-colors"
                                      >
                                        Ignore
                                      </button>
                                    </>
                                  )}
                                  {suggestion.status !== "OPEN" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          suggestion.id,
                                          "OPEN",
                                        )
                                      }
                                      disabled={updatingId === suggestion.id}
                                      className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 rounded-xl hover:bg-indigo-500/10 transition-colors"
                                    >
                                      Reopen Feedback
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="h-full bg-transparent p-10 flex flex-col items-center">
                    <div className="w-full max-w-2xl">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                          <Clock className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-100 tracking-tight">
                            Timeline
                          </h2>
                          <p className="text-xs text-gray-500 font-medium tracking-wide">
                            Evolutionary track of your design decisions.
                          </p>
                        </div>
                      </div>

                      {evolution && evolution.versions.length > 0 ? (
                        <div className="relative border-l border-white/5 pl-10 ml-5 space-y-12">
                          {evolution.versions
                            .slice()
                            .reverse()
                            .map((version, idx) => (
                              <div key={version.id} className="relative">
                                {/* Dot */}
                                <div
                                  className={`absolute -left-[51px] w-5 h-5 rounded-full border-[3px] border-[#0B1220] z-10 ${
                                    idx === 0
                                      ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                      : "bg-slate-700"
                                  }`}
                                >
                                  {idx === 0 && (
                                    <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500 opacity-20" />
                                  )}
                                </div>

                                <div className="bg-[#0B1220]/40 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group">
                                  <div className="flex items-start justify-between mb-6">
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-2">
                                        Version {version.version_number}
                                      </p>
                                      <p className="text-xs text-gray-500 font-bold">
                                        {new Date(
                                          version.created_at,
                                        ).toLocaleString([], {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-2xl font-black text-white italic">
                                        {version.maturity_score}
                                        <span className="text-slate-700 not-italic">
                                          /5
                                        </span>
                                      </span>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mt-1">
                                        Maturity
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-300 transition-colors">
                                      <Sparkles className="w-3 h-3 text-indigo-500" />
                                      {version.suggestions_count} Feedback
                                      points
                                    </div>
                                    {idx === 0 && (
                                      <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        Active Master
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-[#0B1220]/20 rounded-3xl border border-white/5">
                          <p className="text-gray-500 font-medium">
                            No versions detected yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
