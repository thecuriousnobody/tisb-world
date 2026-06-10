// Google ID tokens expire ~1h after login. Admin API routes verify them
// server-side, so callers need a fresh one — this tells the UI when to
// send the user back through /admin/login.

export function getAdminCredential(): { token: string } | { expired: true } {
  const token = localStorage.getItem('admin-credential')
  if (!token) return { expired: true }
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 30_000) {
      return { token }
    }
  } catch {
    // fall through
  }
  return { expired: true }
}
