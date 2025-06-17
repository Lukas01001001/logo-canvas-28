// src/components/AppNavbar.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "@/store/useCanvasStore";

export default function AppNavbar() {
  const { data: session } = useSession();

  const router = useRouter();
  if (!session) return null;

  const handleLogoClick = () => {
    useCanvasStore.getState().resetCanvas([]);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/"); // or '/login' if we have a custom login page
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-ebcont-magnolia/80 border-b-4 border-ebcont-darkviolet shadow z-50 flex items-center justify-between px-4 py-2">
      {/* <nav className="fixed top-0 left-0 w-full bg-ebcont-turquoise/80 border-b-2 border-ebcont-darkviolet shadow z-50 flex items-center justify-between px-4 py-2 rounded-b-2xl"> */}
      {/* L */}
      <Link
        href="/clients"
        onClick={handleLogoClick}
        /* className="flex items-center gap-2 border-r-transparent hover:bg-ebcont-lightmint border-r-8 border-ebcont-mint" */
        className="flex items-center gap-2"
      >
        <div className="relative w-30 h-10">
          <Image
            src="/EBCONT_Logo.svg"
            alt="Logo"
            fill // <-- fills the whole container
            sizes="60px"
            style={{ objectFit: "contain", background: "transparent" }}
            priority
          />
        </div>

        <span className="font-bold text-ebcont-darkviolet text-lg tracking-wide hidden sm:inline">
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
              className="w-8 h-8 rounded-full border border-ebcont-darkviolet"
            />
          )}
          <div className="flex flex-col text-right text-ebcont-darkviolet text-sm">
            <span>{session.user.name}</span>
            <span className="text-xs opacity-60">{session.user.email}</span>
          </div>
          <button
            //onClick={() => signOut()}
            onClick={handleSignOut}
            className="ml-2 px-3 py-2 bg-ebcont-activviolet hover:bg-ebcont-fuchsia text-white text-xs font-semibold shadow"
          >
            Sign Out
          </button>
        </div>
      ) : null}
    </nav>
  );
}
