"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CornerDownLeft,
  Layers,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";

function useRevealOnScroll() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.revealed = "true";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" },
    );

    for (const el of els) io.observe(el);

    return () => io.disconnect();
  }, []);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-[12px] font-medium text-slate-700 shadow-sm backdrop-blur dark:bg-white/5 dark:text-slate-200"
      data-testid="badge-pill"
    >
      {children}
    </span>
  );
}

function Nav() {
  return (
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
          <span className="text-sm font-semibold tracking-tight">IdeaLLD</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#how"
            className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            data-testid="link-how"
          >
            How it works
          </a>

        </div>

        <Link
          href="/signup"
          className="shine-border group inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-float active:scale-[0.99] dark:bg-white dark:text-slate-900"
          data-testid="button-cta-nav"
        >
          Try it free
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-glow" />
      <div className="pointer-events-none absolute inset-0 noise opacity-60" />

      <div className="container-tight relative w-full">
        <div
          className="reveal"
          data-reveal
          style={{
            // @ts-expect-error CSS custom property
            "--delay": "0ms",
          }}
        >
          <Pill>
            <span className="inline-flex items-center gap-2">
              <Wand2 className="h-3.5 w-3.5" />
              Beta Launch
            </span>
          </Pill>
        </div>

        <div
          className="mt-10 grid items-center gap-12 md:mt-16 lg:grid-cols-2"
          data-testid="section-hero"
        >
          <div className="max-w-2xl">
            <h1
              className="reveal text-balance text-4xl font-bold tracking-tight text-slate-950 md:text-6xl lg:text-7xl dark:text-white"
              data-reveal
              style={{
                // @ts-expect-error CSS custom property
                "--delay": "80ms",
              }}
              data-testid="text-hero-title"
            >
              Master Low-Level Design with{" "}
              <span className="text-primary">AI Precision</span>.
            </h1>
            <p
              className="reveal mt-6 text-pretty text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300"
              data-reveal
              style={{
                // @ts-expect-error CSS custom property
                "--delay": "140ms",
              }}
              data-testid="text-hero-subtitle"
            >
              The first AI-powered mentor specifically designed for Low-Level
              Design. Identify bottlenecks, handle edge cases, and learn
              production-grade patterns.
            </p>

            <div
              className="reveal mt-10 flex flex-wrap items-center gap-4"
              data-reveal
              style={{
                // @ts-expect-error CSS custom property
                "--delay": "220ms",
              }}
            >
              <Link
                href="/signup"
                className="shine-border inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:shadow-float active:scale-[0.99] dark:bg-white dark:text-slate-900"
                data-testid="button-cta-primary"
              >
                Start Building Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-8 py-4 text-base font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white/85 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                data-testid="link-secondary"
              >
                See the Workflow
                <CornerDownLeft className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div
            className="reveal relative hidden lg:block"
            data-reveal
            style={{
              // @ts-expect-error CSS custom property
              "--delay": "300ms",
            }}
          >
            <div className="shine-border relative rounded-3xl bg-slate-900/5 p-6 transition-transform hover:scale-[1.01] dark:bg-white/5">
              <div className="relative rounded-2xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden">
                <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-white/5 px-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  <span className="ml-auto text-[10px] uppercase tracking-widest text-slate-500">
                    Analysis Engine
                  </span>
                </div>
                <div className="p-6 font-mono text-sm text-slate-400">
                  <div>
                    <span className="text-emerald-400">class</span>{" "}
                    <span className="text-blue-400">PaymentGateway</span>{" "}
                    {"{"}{" "}
                  </div>
                  <div className="ml-4 mt-2 text-slate-500">
                    {"// Decision: Stripe SDK"}
                  </div>
                  <div className="ml-4">
                    <span className="text-emerald-400">private</span>{" "}
                    retryPolicy:{" "}
                    <span className="text-yellow-400">Exponential</span>;
                  </div>
                  <div className="mt-2">{"}"} </div>

                  <div className="mt-6 rounded-xl bg-primary/10 p-4 border border-primary/30">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="h-4 w-4" />
                      Mentor Feedback
                    </div>
                    <div className="mt-3 text-slate-200 text-sm leading-relaxed">
                      Missing circuit breaker for external API calls. Add
                      fallback for payment processing timeout.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24" data-testid="divider-hero">
          <div className="hairline h-px w-full" />
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  title,
  desc,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}) {
  const stepNumber = String(index + 1).padStart(2, "0");
  return (
    <div
      className="reveal reveal-stagger group relative rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
      data-reveal
      style={{
        // @ts-expect-error CSS custom property
        "--delay": `${index * 100}ms`,
      }}
      data-testid={`card-step-${index}`}
    >
      <div className="absolute -top-4 -left-2 text-6xl font-black text-slate-100 dark:text-slate-800 select-none">
        {stepNumber}
      </div>
      <div className="relative">
        <div
          className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
          data-testid={`icon-step-${index}`}
        >
          {icon}
        </div>
        <div
          className="text-xl font-bold text-slate-950 dark:text-white"
          data-testid={`text-step-title-${index}`}
        >
          {title}
        </div>
        <div
          className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          data-testid={`text-step-desc-${index}`}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-tight w-full py-24 md:py-32">
        <div
          className="reveal text-center"
          data-reveal
          data-testid="section-how"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Layers className="h-3.5 w-3.5" />
            Analysis Engine
          </div>
          <h2
            className="mt-8 text-balance text-4xl font-bold tracking-tight text-slate-950 md:text-5xl dark:text-white"
            data-testid="text-how-title"
          >
            A Workflow Built for Engineers.
          </h2>
          <p
            className="mt-6 mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            data-testid="text-how-subtitle"
          >
            Our backend runs rule-based static analysis combined with
            LLM-powered context awareness to push your design to production
            readiness.
          </p>
        </div>

        <div
          className="mt-20 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-between"
          data-testid="grid-steps"
        >
          <Step
            icon={<BookOpen className="h-6 w-6" />}
            title="Define"
            desc="Outline your classes, attributes, and methods. Mention your technology choices like Redis or Kafka."
            index={0}
          />

          {/* Arrow Connector */}
          <div className="hidden lg:flex items-center justify-center text-slate-300 dark:text-slate-600">
            <ChevronRight className="h-8 w-8" />
          </div>

          <Step
            icon={<Layers className="h-6 w-6" />}
            title="Scan"
            desc="Our system analyzes your design against patterns for caching, scalability, and security."
            index={1}
          />

          {/* Arrow Connector */}
          <div className="hidden lg:flex items-center justify-center text-slate-300 dark:text-slate-600">
            <ChevronRight className="h-8 w-8" />
          </div>

          <Step
            icon={<Sparkles className="h-6 w-6" />}
            title="Augment"
            desc="AI provides 'Interview Perspective' and 'Production Reality' insights to enrich your design."
            index={2}
          />

          {/* Arrow Connector */}
          <div className="hidden lg:flex items-center justify-center text-slate-300 dark:text-slate-600">
            <ChevronRight className="h-8 w-8" />
          </div>

          <Step
            icon={<Wand2 className="h-6 w-6" />}
            title="Iterate"
            desc="Refine your LLD based on feedback and re-scan until it's interview-ready."
            index={3}
          />
        </div>
      </div>
    </section>
  );
}

function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 120, damping: 30, mass: 0.35 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      style={
        {
          background:
            "radial-gradient(600px 420px at var(--x) var(--y), rgba(59, 130, 246, 0.10), transparent 55%)",
          "--x": sx,
          "--y": sy,
        } as React.CSSProperties
      }
      aria-hidden
      data-testid="bg-cursor-glow"
    />
  );
}

export default function Home() {
  useRevealOnScroll();

  return (
    <div className="relative min-h-screen">
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
      </main>
    </div>
  );
}
