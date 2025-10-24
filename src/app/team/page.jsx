"use client";

import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import ProfileCard from "@/app/components/ProfileCard/ProfileCard";
import TextType from "@/app/components/TextType/TextType"; // ✅ Typing effect component

const Glow = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute inset-0 -z-10 opacity-60 blur-2xl 
      [background:radial-gradient(60%_60%_at_20%_0%,rgba(0,255,255,.15),transparent_60%),radial-gradient(50%_50%_at_90%_20%,rgba(0,255,200,.12),transparent_60%),radial-gradient(40%_40%_at_50%_120%,rgba(0,200,255,.1),transparent_60%)] ${className}`}
  />
);

const members = [
  {
    name: "Kunal Kushwaha",
    title: "President",
    handle: "kunal",
    avatarUrl: "/team/president.png",
    linkedin: "https://linkedin.com/in/kunal",
    gmail: "mailto:kunal@nitrkl.ac.in",
    zoom: 1,              // 🔹 Normal size
    disableAura: true,   // 🔹 Keep glow animation
  },
  {
    name: "Rishi Das",
    title: "Vice President",
    handle: "rishi",
    avatarUrl: "/team/vp.png",
    linkedin: "https://linkedin.com/in/rishi",
    gmail: "mailto:rishi@nitrkl.ac.in",
    zoom: 1,
    disableAura: true,
  },
  {
    name: "Bibhu",
    title: "Secretary",
    handle: "bibhu",
    avatarUrl: "/team/secretary.png",
    linkedin: "https://linkedin.com/in/bibhu",
    gmail: "mailto:bibhu@nitrkl.ac.in",
    zoom: 1,
    disableAura: true,
  },
  {
    name: "Arko Pravo Dey",
    title: "Treasurer",
    handle: "arko",
    avatarUrl: "/team/treasurer.png",
    linkedin: "https://linkedin.com/in/arko",
    gmail: "mailto:arko@nitrkl.ac.in",
    zoom: 1.5,           // 🔹 Slightly larger photo
    disableAura: true,    // 🔹 Turn off rainbow animation
  },
  {
    name: "Risabh Anand",
    title: "ML Lead",
    handle: "risabh",
    avatarUrl: "/team/mllead.png",
    linkedin: "https://linkedin.com/in/risabh",
    gmail: "mailto:risabh@nitrkl.ac.in",
    zoom: 1.5,
    disableAura: true,
  },
];

export default function TeamPage() {
  return (
    <main
      className="
        relative z-30 w-full overflow-hidden border-t border-cyan-500/20
        bg-[#0b1117] text-slate-200 isolate flex flex-col items-center
      "
    >
      <Glow />

      {/* ⚡ Neon Typing Heading */}
      <div className="relative text-center pt-12 pb-8">
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-wide text-cyan-200 drop-shadow-[0_0_18px_rgba(0,255,255,.45)]">
          <TextType
            text={["Executive Body", "Team ML4E"]}
            className="text-cyan-200 drop-shadow-[0_0_18px_rgba(0,255,255,.45)]"
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </h1>
      </div>

      {/* Team Member Grid */}
      <div
        className="
          relative z-10
          max-w-7xl mx-auto
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-6 p-6 md:p-8 lg:p-10
          place-items-center
        "
      >
        {members.map((m) => (
          <div key={m.handle} className="flex flex-col items-center gap-3">
            <ProfileCard
              className="pc-variant-bits"
              name={m.name}
              title={m.title}
              handle={m.handle}
              status=""
              contactText=""
              avatarUrl={m.avatarUrl}
              enableTilt={false}
              showUserInfo={false}
              showBehindGradient={false}
              zoom={m.zoom}               // ✅ Apply per-member zoom
              disableAura={m.disableAura} // ✅ Apply per-member aura toggle
            />

            {/* Social Links */}
            <div className="flex gap-4 mt-2">
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-100 transition-transform transform hover:scale-110"
                aria-label={`${m.name} LinkedIn`}
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href={m.gmail}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-100 transition-transform transform hover:scale-110"
                aria-label={`Email ${m.name}`}
              >
                <FaEnvelope size={22} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}