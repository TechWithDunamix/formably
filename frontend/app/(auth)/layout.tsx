import { Suspense } from "react";
import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading auth page...</div>}>
      {children}
    </Suspense>
  );
}
