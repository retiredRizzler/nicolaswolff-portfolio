export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only protect the /view route
  if (!to.path.endsWith('/view')) {
    return
  }

  const slug = to.params.slug as string

  try {
    // Check if gallery session is valid by trying to fetch metadata
    await $fetch(`/api/galleries/${slug}`)
  } catch (error: any) {
    // If unauthorized, redirect to password page
    if (error.statusCode === 401) {
      return navigateTo(`/client/galleries/${slug}`)
    }

    // For other errors (404, expired, etc.), let the page handle it
  }
})
