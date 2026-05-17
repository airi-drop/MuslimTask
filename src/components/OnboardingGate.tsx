"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Redirects to /onboarding if user hasn't completed onboarding.
 * Renders nothing. Checks localStorage on mount.
 */
export function OnboardingGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on onboarding page
    if (pathname === "/onboarding") return;
    // Don't redirect if already on offline page
    if (pathname === "/offline") return;

    const onboarded = localStorage.getItem("mihrab-onboarded");
    if (!onboarded) {
      router.replace("/onboarding");
    }
  }, [pathname, router]);

  return null;
}
