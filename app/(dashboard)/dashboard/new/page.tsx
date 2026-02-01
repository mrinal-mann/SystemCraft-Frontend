"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, BookOpen, Layers, Sparkles } from "lucide-react";
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
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/dashboard"
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-100 italic tracking-tight underline decoration-indigo-500/30 underline-offset-4">
            SystemCraft
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Define your software architecture
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                    What are you building?
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                      placeholder="e.g., Global Payment System"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                    Brief Catchphrase
                  </label>
                  <div className="relative group">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                      placeholder="Scalable microservices for fiat/crypto"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">
                    Design Tip
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Be as descriptive as possible in your initial design. Mention
                  technologies like
                  <span className="text-gray-400 px-1 font-bold">
                    Redis, Kafka, or PostgreSQL
                  </span>
                  to help the AI provide more specific production pitfalls.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                Initial Architecture (Optional Markdown)
              </label>
              <textarea
                value={formData.design_content}
                onChange={(e) =>
                  setFormData({ ...formData, design_content: e.target.value })
                }
                rows={10}
                className="w-full px-5 py-4 text-sm font-mono bg-slate-900 border border-slate-700 rounded-2xl text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner"
                placeholder="Describe components, classes, and logic flows..."
              />
            </div>
          </div>

          <div className="px-10 py-6 bg-slate-900/50 border-t border-slate-700 flex items-center justify-end gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={
                isSubmitting || !formData.title || !formData.description
              }
              className="inline-flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest text-white bg-indigo-50 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/10"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
