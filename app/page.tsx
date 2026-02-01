"use client";

import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

function Nav() {
  return (
    <nav className="max-w-5xl mx-auto px-6 h-24 flex items-center justify-between relative z-10">
      <Link href="/">
        <Logo size={24} />
      </Link>
      <div className="flex items-center gap-8">
        <Link
          href="/login"
          className="text-[13px] font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-indigo-500 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/10"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="py-40 px-6 relative">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-10 max-w-4xl mx-auto">
          Master <span className="text-slate-500">System Design</span> Thinking.{" "}
          <br />
          Let AI <span className="text-slate-500">guide</span> the structure.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
          SystemCraft analyzes your design, remembers your decisions, and tells
          you exactly what to improve next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/signup"
            className="px-10 py-4 bg-indigo-500 text-white text-sm font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            Start Building Free
          </Link>
          <a
            href="#how"
            className="px-10 py-4 bg-transparent text-slate-300 text-sm font-bold rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

function WorkflowStep({
  number,
  title,
  desc,
  isLeft,
}: {
  number: string;
  title: string;
  desc: string;
  isLeft: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-between w-full mt-24 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Card */}
      <div
        className={`w-[420px] p-8 bg-[#0F172A] border border-white/10 rounded-xl relative z-10 transition-all hover:border-indigo-500/30 group`}
      >
        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest block mb-3 group-hover:translate-x-1 transition-transform">
          {number}
        </span>
        <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Dot */}
      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 border-4 border-[#0B1220] z-20" />

      {/* Empty Spacer for the other side */}
      <div className="w-[420px]" />
    </div>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      className="py-40 px-6 border-t border-white/5 relative bg-[#0B1220] grid-lines"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10 mb-32">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
          How SystemCraft Works
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          From rough design to production-grade thinking.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative px-4">
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

        <div className="flex flex-col relative">
          <WorkflowStep
            number="01"
            title="Describe your system design"
            desc="Input your classes, relationships, and technical requirements in clear text. Our interface supports markdown for rich structural details."
            isLeft={true}
          />
          <WorkflowStep
            number="02"
            title="SystemCraft analyzes gaps using rules + AI"
            desc="Our engine scans for architectural smells, scalability bottlenecks, and missing components using advanced LLD patterns."
            isLeft={false}
          />
          <WorkflowStep
            number="03"
            title="Get guided suggestions and iterate"
            desc="Follow step-by-step guidance to refine your architecture until it reaches production maturity and catches edge cases."
            isLeft={true}
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-loose">
          Built for engineers learning system design. <br />
          SystemCraft &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1220] grid-lines selection:bg-indigo-500/30 selection:text-indigo-200">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
