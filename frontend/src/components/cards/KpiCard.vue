<template>
  <v-card class="kpi-card" v-bind="$attrs">
    <v-card-text class="pa-4 kpi-card-body">
      <div class="d-flex align-start justify-space-between">
        <!-- Left: label + value -->
        <div class="flex-grow-1">
          <div class="text-caption text-medium-emphasis font-weight-medium text-uppercase mb-1" style="letter-spacing: 0.8px">
            {{ label }}
          </div>

          <div v-if="loading" class="mt-1">
            <v-skeleton-loader type="text" width="120" />
          </div>
          <div v-else class="kpi-value">
            {{ formattedValue }}
          </div>

          <!-- Trend indicator -->
          <div v-if="trend !== null && !loading" class="d-flex align-center mt-2 gap-1">
            <v-icon
              :icon="trendIcon"
              :color="trendColor"
              size="16"
            />
            <span class="text-caption font-weight-medium" :style="{ color: trendColorHex }">
              {{ Math.abs(trend) }}%
            </span>
            <span class="text-caption text-medium-emphasis">
              vs. mês anterior
            </span>
          </div>
        </div>

        <!-- Right: icon badge -->
        <div
          class="kpi-icon-badge d-flex align-center justify-center"
          :style="{ background: iconBadgeBg }"
        >
          <v-icon :icon="icon" :color="color" size="28" />
        </div>
      </div>

      <!-- Optional small chart sparkline slot -->
      <slot name="sparkline" />
    </v-card-text>

    <!-- Colored bottom border accent -->
    <div class="kpi-accent-bar" :style="{ background: accentColor }" />
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  format: {
    type: String,
    default: 'currency',
    validator: (v) => ['currency', 'number', 'percent', 'text'].includes(v),
  },
  icon: { type: String, default: 'mdi-cash' },
  color: { type: String, default: 'primary' },
  trend: { type: Number, default: null },
  loading: { type: Boolean, default: false },
})

const colorHexMap = {
  primary: '#1976D2',
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',
  info: '#0277BD',
}

const accentColor = computed(() => colorHexMap[props.color] ?? props.color)
const iconBadgeBg = computed(() => `${accentColor.value}18`)

const formattedValue = computed(() => {
  if (props.format === 'currency') return formatCurrency(props.value)
  if (props.format === 'number') return formatNumber(props.value)
  if (props.format === 'percent') return formatPercent(props.value / 100)
  return props.value
})

const trendIcon = computed(() => {
  if (props.trend > 0) return 'mdi-trending-up'
  if (props.trend < 0) return 'mdi-trending-down'
  return 'mdi-trending-neutral'
})

const trendColor = computed(() => {
  if (props.trend > 0) return 'success'
  if (props.trend < 0) return 'error'
  return 'medium-emphasis'
})

const trendColorHex = computed(() => {
  if (props.trend > 0) return '#2E7D32'
  if (props.trend < 0) return '#C62828'
  return '#757575'
})
</script>

<style scoped>
.kpi-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s;
  /* Fixed height garante que todos os KPI cards tenham o mesmo tamanho,
     independentemente de terem ou não o indicador de tendência */
  height: 120px;
}

.kpi-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

/* O v-card-text precisa preencher toda a altura disponível (descontando a barra inferior) */
.kpi-card-body {
  height: calc(100% - 3px);
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212121;
  line-height: 1.2;
}

.kpi-icon-badge {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  flex-shrink: 0;
  margin-left: 12px;
}

.kpi-accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}
</style>
