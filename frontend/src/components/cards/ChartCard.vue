<template>
  <v-card class="chart-card" v-bind="$attrs">
    <v-card-title class="chart-card-title d-flex align-center justify-space-between pa-4 pb-0">
      <div>
        <div class="text-subtitle-2 font-weight-bold text-on-surface">{{ title }}</div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis mt-0.5">{{ subtitle }}</div>
      </div>
      <div class="d-flex align-center gap-2">
        <slot name="actions" />
        <v-btn
          v-if="expandable"
          icon="mdi-arrow-expand"
          variant="text"
          density="compact"
          color="medium-emphasis"
          @click="$emit('expand')"
        />
      </div>
    </v-card-title>

    <v-divider class="mt-3 mb-0" />

    <v-card-text class="pa-3">
      <!-- Loading state -->
      <div v-if="loading" class="d-flex align-center justify-center" :style="{ height: `${height}px` }">
        <v-progress-circular indeterminate color="primary" size="40" />
      </div>

      <!-- No data state -->
      <div
        v-else-if="empty"
        class="d-flex flex-column align-center justify-center text-medium-emphasis"
        :style="{ height: `${height}px` }"
      >
        <v-icon icon="mdi-chart-timeline-variant-shimmer" size="48" class="mb-2 opacity-40" />
        <span class="text-caption">Nenhum dado disponível</span>
      </div>

      <!-- Chart slot -->
      <slot v-else />
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  empty: { type: Boolean, default: false },
  height: { type: Number, default: 300 },
  expandable: { type: Boolean, default: false },
})

defineEmits(['expand'])
</script>

<style scoped>
.chart-card {
  transition: box-shadow 0.2s;
}

.chart-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.chart-card-title {
  min-height: 56px;
}
</style>
