export default defineEventHandler(async (event) => {
  // Clear admin session cookie
  clearAdminSession(event)

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
