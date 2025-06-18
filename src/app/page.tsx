// app/page.tsx

"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import dynamic from "next/dynamic";
import Image from "next/image";

// dynamic import framer-motion
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);
const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.h1),
  { ssr: false }
);
const MotionP = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.p),
  { ssr: false }
);

export default function HomePage() {
  // const { data: session, status } = useSession();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/clients");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-pink-900 text-white">
        <Spinner />
      </main>
    );
  }

  // User not logged in – show welcome screen
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-pink-900 text-white relative overflow-hidden">
      <Image
        src="/background_logos_ebcont.png"
        alt="Background logos"
        fill
        className="object-cover opacity-10 pointer-events-none"
        priority
      />

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 p-6"
      >
        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
          {/* SVG */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full z-0"
          >
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="white"
              stroke="#64baaa"
              strokeWidth="3"
              // style={{ filter: "drop-shadow(0 4px 24px #0004)" }}
            />
          </svg>
          {/* Logo */}
          <Image
            src="/EBCONT_Logo.svg"
            alt="Logo"
            width={120}
            height={60}
            style={{ width: "80%", height: "auto" }}
            className="relative z-10 object-contain"
            priority
          />
        </div>

        <MotionH1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Welcome to Logo Canvas
        </MotionH1>

        <MotionP
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl max-w-xl mx-auto mb-8"
        >
          Manage and showcase your clients&apos; logos with ease.
        </MotionP>
        <MotionDiv
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-lg transition hover:bg-blue-100 text-lg"
          >
            Sign in with Google
          </button>
        </MotionDiv>
      </MotionDiv>
    </main>
  );
}
