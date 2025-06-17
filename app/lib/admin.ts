// app/lib/admin.ts
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  // Get admin emails from environment variable
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  return adminEmails.includes(email);
}
