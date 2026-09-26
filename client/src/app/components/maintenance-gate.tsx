"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";
import siteService from "@/app/services/site";

// Re-checked periodically so an already-open tab lands on the maintenance
// screen shortly after an admin turns it on, not only on the next visit.
const RECHECK_MS = 30_000;

// Guests and non-admin users can still reach the login page while the site
// is suspended — that's how an admin who isn't logged in yet gets in to
// turn it back off.
const EXEMPT_PATHS = ["/login"];

// The last state we saw, kept for the session so a reload while the site is
// suspended shows the maintenance screen straight away instead of flashing
// the real page until the first check returns.
const CACHE_KEY = "maintenanceStatus";

type Status = { maintenanceMode: boolean; message: string };

const readCache = (): Status | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Status) : null;
  } catch {
    return null;
  }
};

const writeCache = (status: Status) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(status));
  } catch {
    // storage unavailable: the check below still works, just without the cache
  }
};

function MaintenanceScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="relative h-24 w-24">
          <Image
            src="/brand/icpep-logo.png"
            alt="ICpEP Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-amber-700">
          <Wrench size={14} />
          <span className="font-raleway text-xs font-semibold uppercase tracking-wide">
            Under Maintenance
          </span>
        </div>

        <h1 className="font-rubik text-2xl font-bold text-primary3">
          We&apos;ll be right back
        </h1>
        <p className="font-raleway text-gray-500">{message}</p>

        <Link
          href="/login"
          className="font-raleway text-sm font-semibold text-primary1 underline underline-offset-2 hover:text-primary2"
        >
          Admin? Log in
        </Link>
      </div>
    </div>
  );
}

export default function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus((current) => current ?? readCache());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const settings = await siteService.getSettings();
        if (cancelled) return;

        const next = {
          maintenanceMode: settings.maintenanceMode,
          message: settings.maintenanceMessage,
        };
        writeCache(next);
        setStatus(next);
      } catch {
        // Can't reach the API — don't block the whole site over that; let
        // the page's own error handling (ApiErrorNotice) surface it instead.
        if (!cancelled) setStatus({ maintenanceMode: false, message: "" });
      }
    };

    check();
    const interval = setInterval(check, RECHECK_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const exempt = EXEMPT_PATHS.some((p) => pathname === p || pathname?.startsWith(`${p}/`));

  // Read fresh on every render (pathname changes on navigation) so logging in
  // as an admin lifts the screen immediately instead of after the next recheck.
  // status is only set after mount, so this never runs during server render.
  const isAdmin = status !== null && localStorage.getItem("userRole") === "admin";

  if (status?.maintenanceMode && !isAdmin && !exempt) {
    return <MaintenanceScreen message={status.message} />;
  }

  return <>{children}</>;
}
