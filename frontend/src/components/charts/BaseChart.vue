<template>
  <v-chart
    :option="mergedOption"
    :theme="'pagTheme'"
    :style="{ height: `${height}px`, width: '100%' }"
    :autoresize="true"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { registerPagTheme, baseChartOption } from '@/utils/chartTheme'

// Register custom theme once
onMounted(() => registerPagTheme())

const props = defineProps({
  /**
   * ECharts option object.
   * Will be deep-merged on top of baseChartOption defaults.
   */
  option: {
    type: Object,
    required: true,
  },
  height: {
    type: Number,
    default: 300,
  },
})

/**
 * Simple recursive deep merge (no external dependency).
 */
function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key] ?? {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

const mergedOption = computed(() => deepMerge(baseChartOption, props.option))
</script>
