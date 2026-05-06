<template>
  <div class="notifications-container">
    <v-snackbar
      v-for="notification in appStore.notifications"
      :key="notification.id"
      :model-value="true"
      :timeout="notification.timeout"
      :color="snackbarColor(notification.type)"
      location="bottom right"
      multi-line
      @update:model-value="appStore.dismissNotification(notification.id)"
    >
      <v-icon :icon="snackbarIcon(notification.type)" class="mr-2" />
      {{ notification.message }}

      <template #actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="appStore.dismissNotification(notification.id)"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

function snackbarColor(type) {
  const map = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return map[type] ?? 'info'
}

function snackbarIcon(type) {
  const map = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }
  return map[type] ?? 'mdi-information'
}
</script>
