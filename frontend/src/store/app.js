import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Global application state.
 * Controls sidebar, loading overlay, notifications, and global filters.
 */
export const useAppStore = defineStore('app', () => {
  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const sidebarOpen = ref(true)
  const sidebarRail = ref(false)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleSidebarRail() {
    sidebarRail.value = !sidebarRail.value
  }

  // ─── Loading ──────────────────────────────────────────────────────────────
  const loadingCount = ref(0)
  const isLoading = computed(() => loadingCount.value > 0)

  function startLoading() {
    loadingCount.value++
  }

  function stopLoading() {
    if (loadingCount.value > 0) loadingCount.value--
  }

  // ─── Notifications (snackbar queue) ───────────────────────────────────────
  const notifications = ref([])

  function notify({ message, type = 'info', timeout = 4000 }) {
    const id = Date.now()
    notifications.value.push({ id, message, type, timeout })
  }

  function dismissNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  // ─── Global date filter ───────────────────────────────────────────────────
  const selectedYear = ref(new Date().getFullYear())
  const selectedMonth = ref(new Date().getMonth() + 1)

  return {
    sidebarOpen,
    sidebarRail,
    toggleSidebar,
    toggleSidebarRail,
    isLoading,
    startLoading,
    stopLoading,
    notifications,
    notify,
    dismissNotification,
    selectedYear,
    selectedMonth,
  }
})
