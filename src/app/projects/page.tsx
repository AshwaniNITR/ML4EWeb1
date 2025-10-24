"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ===== Types =====
interface Project {
  _id?: string;
  name: string;
  description?: string;
  techStack?: string;
  imageUrl?: string;
  deployedLink?: string;
  githubLink?: string;
}

interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

type InfiniteMenuProps = {
  items: MenuItem[];
  onSelect?: (item: MenuItem, index: number) => void;
};

// Lazy import keeps this page client-only
const InfiniteMenu = React.lazy(
  () => import("@/app/components/InfiniteMenu/InfiniteMenu")
);

// ===== Demo/Fallback projects =====
const DUMMY_PROJECTS: Project[] = [
  {
    name: "Neon Vision",
    description:
      "A sleek landing page template with neon accents and buttery animations.",
    techStack: "Next.js, Tailwind, Framer Motion",
    imageUrl: "https://picsum.photos/seed/neon/1200/700?grayscale",
    deployedLink: "#",
    githubLink: "#",
  },
  {
    name: "Aqua Notes",
    description:
      "Minimal note app concept focused on speed and delightful micro-interactions.",
    techStack: "React, Zustand, Vite",
    imageUrl: "https://picsum.photos/seed/aqua/1200/700?grayscale",
    deployedLink: "#",
    githubLink: "#",
  },
  {
    name: "Glass Board",
    description:
      "Glassmorphism dashboard with realtime charts and adaptive theming.",
    techStack: "Next.js, Recharts, Tailwind",
    imageUrl: "https://picsum.photos/seed/glass/1200/700?grayscale",
    deployedLink: "#",
    githubLink: "#",
  },
  {
    name: "Pulse API",
    description:
      "Tiny REST wrapper with caching and a playful API explorer UI.",
    techStack: "Node, Express, Redis",
    imageUrl: "https://picsum.photos/seed/pulse/1200/700?grayscale",
    deployedLink: "#",
    githubLink: "#",
  },
];

// ===== Loading Screen =====
function LoadingScreen() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b1117] text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 blur-2xl opacity-70 [background:radial-gradient(50%_50%_at_20%_0%,rgba(34,211,238,.16),transparent_60%),radial-gradient(45%_45%_at_85%_15%,rgba(20,184,166,.14),transparent_60%),radial-gradient(40%_40%_at_50%_120%,rgba(56,189,248,.12),transparent_60%)]" />
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-[spin_1.2s_linear_infinite] rounded-full border-4 border-cyan-300/30 border-t-cyan-300 shadow-[0_0_24px_rgba(34,211,238,.35)]" />
          <div className="absolute inset-2 grid place-items-center rounded-full bg-black/40 backdrop-blur-xl">
            <Image
              src="/ml4e.svg"
              alt="ML4E"
              width={44}
              height={44}
              priority
              className="opacity-95 drop-shadow-[0_0_12px_rgba(34,211,238,.45)] animate-[pulse_1.8s_ease-in-out_infinite]"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-wide text-cyan-200 drop-shadow-[0_0_16px_rgba(0,255,255,.35)]">
            Loading Projects
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Fetching the latest curated projects…
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ViewProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch from API or fallback
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load projects");
        if (!alive) return;
        setProjects(data as Project[]);
        setUsingFallback(false);
      } catch {
        if (!alive) return;
        setProjects(DUMMY_PROJECTS);
        setUsingFallback(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const menuItems: MenuItem[] = useMemo(
    () =>
      projects.map((p) => ({
        image: p.imageUrl || "https://picsum.photos/600/600?grayscale",
        link: p.deployedLink || p.githubLink || "#",
        title: p.name || "Untitled",
        description:
          p.description ||
          (p.techStack ? `Built with ${p.techStack}` : "Explore this project"),
      })),
    [projects]
  );

  const activeItem = menuItems[activeIndex] || menuItems[0];

  if (loading) return <LoadingScreen />;

  return (
    <main className="min-h-screen w-full bg-[#0b1117] text-slate-200">
      {/* ===== Infinite Menu Section ===== */}
      <section className="relative h-[62vh] w-full overflow-hidden">
        <React.Suspense fallback={<LoadingScreen />}>
          <InfiniteMenu
            items={menuItems}
            onSelect={(_, i) => {
              console.log("Selected project:", i, menuItems[i]?.title);
              setActiveIndex(i);
            }}
          />
        </React.Suspense>

        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 blur-2xl [background:radial-gradient(50%_50%_at_50%_15%,rgba(34,211,238,.18),transparent_60%)]" />
      </section>

      {/* ===== Bottom iOS-style detail section ===== */}
      <section className="relative -mt-6 flex w-full items-start justify-center px-4 pb-16">
        <div
          key={activeIndex} // 🟢 re-render every time active project changes
          className="
            w-full max-w-5xl rounded-3xl border border-white/10
            bg-white/5 px-6 py-6 sm:px-8 sm:py-8
            shadow-[0_10px_40px_rgba(0,0,0,0.35)]
            backdrop-blur-xl transition-all duration-500 ease-in-out
            animate-fadeIn
          "
        >
          {/* Header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              {activeItem.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                Project
              </span>
              {usingFallback && (
                <span className="inline-flex items-center rounded-full border border-yellow-300/30 bg-yellow-300/10 px-2.5 py-1 text-[10px] font-medium text-yellow-200">
                  Demo Data
                </span>
              )}
            </div>
          </div>

          {/* Description — now animated */}
          <p
            key={`${activeIndex}-desc`}
            className="text-pretty text-base leading-relaxed text-slate-300/90 sm:text-lg transition-opacity duration-500 ease-in-out animate-fadeIn"
          >
            {activeItem.description}
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={activeItem.link}
              target="_blank"
              className="
                inline-flex items-center gap-2 rounded-xl
                bg-cyan-500/20 px-4 py-2 text-cyan-100
                ring-1 ring-cyan-400/30 transition
                hover:bg-cyan-500/25 hover:text-white
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
              "
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                <path
                  fill="currentColor"
                  d="M14 3h7v7h-2V6.41l-9.29 9.3l-1.42-1.42l9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5z"
                />
              </svg>
              Open
            </Link>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              {projects[activeIndex]?.techStack && (
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                  {projects[activeIndex].techStack}
                </span>
              )}
            </div>
          </div>

          <hr className="my-6 border-white/10" />

          {/* Image + meta */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              key={`img-${activeIndex}`}
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner transition-all duration-500 ease-in-out"
            >
              {projects[activeIndex]?.imageUrl ? (
                <Image
                  src={projects[activeIndex].imageUrl!}
                  alt={activeItem.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${activeItem.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>

            {/* Meta Info */}
            <div
              key={`meta-${activeIndex}`}
              className="flex flex-col justify-center gap-2 text-sm text-slate-300/90 animate-fadeIn"
            >
              <p>
                This panel updates as you browse the circular menu above. Smooth blur,
                subtle glow and rounded corners give it a modern iOS vibe.
              </p>
              {usingFallback ? (
                <p className="text-slate-400">
                  You’re viewing demo data because the database couldn’t be reached.
                  Once connectivity is restored, real projects will load here
                  automatically.
                </p>
              ) : (
                <p className="text-slate-400">
                  Tip: You can open the live project or repository using the links
                  above.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}