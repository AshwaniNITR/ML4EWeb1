'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Orbitron } from "next/font/google";
import { FaGithub } from "react-icons/fa";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cardThemes = [
  {
    bg: "from-[#0F172A] to-[#1E293B]",
    headerBg: "bg-[#1E3A8A]",
    accent: "#60A5FA",
  },
  {
    bg: "from-[#0A0F1E] to-[#112240]",
    headerBg: "bg-[#0EA5E9]",
    accent: "#38BDF8",
  },
  {
    bg: "from-[#1E293B] to-[#0F172A]",
    headerBg: "bg-[#0284C7]",
    accent: "#7DD3FC",
  },
];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch projects");
        setProjects(data);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 text-2xl font-bold">
        Loading Projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#050816] via-[#0A0F1E] to-[#0F172A] py-16 px-4 sm:px-8">
      <h1
        className={`text-4xl sm:text-5xl font-bold text-center text-cyan-400 mb-12 ${orbitron.className}`}
      >
        PROJECTS
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => {
          const theme = cardThemes[index % cardThemes.length];
          return (
            <div
              key={project._id || index}
              className={`rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_25px_rgba(0,255,255,0.1)] hover:shadow-[0_0_35px_rgba(0,255,255,0.25)] transition duration-300 bg-gradient-to-br ${theme.bg}`}
            >
              <div className={`${theme.headerBg} py-4 px-6 text-center border-b border-cyan-400/30`}>
                <h2
                  className={`text-2xl font-bold text-white tracking-wide ${orbitron.className}`}
                >
                  {project.name}
                </h2>
              </div>

              {project.imageUrl && (
                <div className="relative w-full h-40 sm:h-48 border-b border-cyan-400/20">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                </div>
              )}

              <div className="p-6 text-white flex flex-col gap-3">
                <p className="text-gray-300">
                  <strong>Tech Stack:</strong> {project.techStack}
                </p>

                {project.description && (
                  <p className="text-gray-400 text-sm italic">{project.description}</p>
                )}

                <div className="flex items-center justify-between mt-4">
                  {project.deployedLink && (
                    <a
                      href={project.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.accent }}
                      className="underline hover:opacity-80 transition duration-200"
                    >
                      View Project
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl hover:scale-110 transition-transform"
                      style={{ color: theme.accent }}
                    >
                      <FaGithub />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;