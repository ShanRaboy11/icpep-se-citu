"use client";

import RequireRole from "./require-role";

// Guards every /create/* and /users page — only council officers and
// admins/developers (who bypass via the server's own role check) get in.
const ALLOWED_ROLES = ["council-officer", "admin"];

export default function RequireOfficer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole roles={ALLOWED_ROLES} redirectTo="/home">
      {children}
    </RequireRole>
  );
}
