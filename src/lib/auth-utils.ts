// Owner emails that get admin role
export const OWNER_EMAILS = [
  "liujaneyan@gmail.com",
  "leeharvad@gmail.com",
]

// Check if a user is an owner
export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false
  return OWNER_EMAILS.includes(email.toLowerCase())
}

// Check if user has owner role or is in owner emails list
export function hasOwnerAccess(user: { email?: string | null; role?: string | null } | null): boolean {
  if (!user) return false
  return user.role === "owner" || isOwner(user.email)
}
