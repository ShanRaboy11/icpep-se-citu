"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./loading";

// Keeps a page's UI from rendering for people who shouldn't see it. This is
// only a convenience: the real enforcement lives server-side on each
// endpoint, since a client check can always be bypassed by calling the API
// directly. Omit `roles` to allow any logged-in user.
export default function RequireRole({
  roles,
  redirectTo,
  children,
}: {
  roles?: string[];
  redirectTo: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || !role || (roles && !roles.includes(role))) {
      router.replace(redirectTo);
      return;
    }

    setAuthorized(true);
  }, [router, roles, redirectTo]);

  if (!authorized) {
    return <LoadingScreen showEntrance={false} />;
  }

  return <>{children}</>;
}
