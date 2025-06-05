// src/components/AppNavbar.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppNavbar() {
  const { data: session } = useSession();

  const router = useRouter();
  if (!session) return null;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/"); // or '/login' if we have a custom login page
  };

  return (
    // <nav className="fixed top-0 left-0 w-full bg-blue-950/90 border-b border-blue-900 shadow z-50 flex items-center justify-between px-4 py-2">
    <nav className="fixed top-0 left-0 w-full bg-gray-800/90 border-b border-gray-600 shadow z-50 flex items-center justify-between px-4 py-2">
      {/* L */}
      <Link
        href="/clients"
        className="flex items-center gap-2 hover:bg-gray-700"
      >
        <div className="relative w-30 h-10">
          <Image
            src="/EBCONT_Logo.svg"
            alt="Logo"
            fill // <-- fills the whole container
            sizes="60px"
            style={{ objectFit: "contain", background: "white" }}
            priority
          />
        </div>

        <span className="font-bold text-white text-lg tracking-wide hidden sm:inline">
          Logo Canvas
        </span>
      </Link>

      {/* User and Sign Out */}
      {session?.user ? (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-gray-600"
            />
          )}
          <div className="flex flex-col text-right text-white text-sm">
            <span>{session.user.name}</span>
            <span className="text-xs opacity-60">{session.user.email}</span>
          </div>
          <button
            //onClick={() => signOut()}
            onClick={handleSignOut}
            className="ml-2 px-3 py-2 bg-pink-700 hover:bg-pink-800 rounded text-xs font-semibold shadow"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </nav>
  );
}
