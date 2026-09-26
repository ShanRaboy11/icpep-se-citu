// Student numbers of the chapter's own dev team. These accounts are
// self-healing: every successful login re-checks role and isActive, and
// if either ever drifted (e.g. an accidental role change via the Users
// admin page, or a roster sync deactivating them for not being on the
// student list), silently restores "admin" + active — see
// auth.controller.ts's `login`.
//
// To add a developer, just add their student number here.
export const DEVELOPER_STUDENT_NUMBERS: string[] = ["23-3403-881"];
