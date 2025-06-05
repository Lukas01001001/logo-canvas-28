// app/components/UserBar.tsx

"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserBar() {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-blue-900/80 px-4 py-2 rounded-xl shadow-lg text-white">
      {session.user.image && (
        <img
          src={session.user.image}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex flex-col text-sm">
        <span>{session.user.name}</span>
        <span className="text-xs opacity-70">{session.user.email}</span>
      </div>
      <button
        onClick={() => signOut()}
        className="ml-2 px-2 py-1 bg-pink-700 hover:bg-pink-800 rounded text-xs"
      >
        Sign out
      </button>
    </div>
  );
}
