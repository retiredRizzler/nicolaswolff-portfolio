export default defineAppConfig({
  ui: {
    colors: {
      // Monochrome zinc palette for admin/client pages
      primary: 'zinc',      // Main CTAs, active navigation, brand elements
      secondary: 'zinc',    // Secondary buttons, alternative actions
      success: 'green',     // Success messages, completed states
      info: 'zinc',         // Info alerts, tooltips, help text
      warning: 'yellow',    // Warning messages, pending states
      error: 'red',         // Error messages, validation errors
      neutral: 'zinc'       // Text, borders, backgrounds, disabled states
    }
  }
})
