// src/app/clients/layout.tsx

"use client";

import AppNavbar from "@/components/AppNavbar";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      <main className="pt-10" role="main">
        {children}
      </main>
    </>
  );
}
