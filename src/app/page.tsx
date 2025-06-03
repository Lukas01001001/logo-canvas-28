// app/page.tsx

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

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
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-pink-900 text-white relative overflow-hidden">
      <Image
        src="/background-logos.png"
        alt="Background logos"
        fill
        className="object-cover opacity-10 pointer-events-none"
      />

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 p-6"
      >
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
          Design, manage, and showcase your client logos with ease. Beautiful.
          Efficient. Custom.
        </MotionP>

        {status === "loading" ? (
          <div className="text-white py-3">Loading...</div>
        ) : session ? (
          <>
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block mb-3"
            >
              <Link
                href="/clients"
                className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-lg transition hover:bg-blue-100"
              >
                Go to your Clients →
              </Link>
            </MotionDiv>
            <br />
            <button
              onClick={() => signOut()}
              className="text-sm text-white underline hover:text-blue-200"
            >
              Sign out ({session.user.email})
            </button>
          </>
        ) : (
          <MotionDiv
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={() => signIn("google")}
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-lg transition hover:bg-blue-100"
            >
              Sign in with Google
            </button>
          </MotionDiv>
        )}
      </MotionDiv>
    </main>
  );
}
