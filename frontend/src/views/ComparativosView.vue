<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h6 font-weight-bold">Comparativos</h1>
      <p class="text-caption text-medium-emphasis mb-0">
        Comparação entre períodos distintos
      </p>
    </div>

    <!-- Year picker for comparison -->
    <v-card color="white" elevation="2" class="comparativo-filter px-4 py-3 mb-5">
      <div class="d-flex flex-wrap align-center">
        <div class="filter-label mx-3">
          <v-icon icon="mdi-swap-horizontal" size="15" class="mr-1" />
          Comparar períodos
        </div>

        <v-divider vertical style="height: 28px; align-self: center" class="mx-2" />

        <v-select
          v-model="yearA"
          :items="years"
          label="Ano A"
          density="compact"
          hide-details
          class="mx-3"
          style="max-width: 110px; flex-shrink: 0"
        />

        <v-icon icon="mdi-arrow-left-right" color="medium-emphasis" class="mx-1" />

        <v-select
          v-model="yearB"
          :items="years"
          label="Ano B"
          density="compact"
          hide-details
          class="mx-3"
          style="max-width: 110px; flex-shrink: 0"
        />

        <v-spacer />

        <div class="mx-2">
          <v-btn
            prepend-icon="mdi-chart-areaspline"
            color="primary"
            variant="flat"
            density="comfortable"
            @click="loadComparative"
          >
            Comparar
          </v-btn>
        </div>
      </div>
    </v-card>

    <v-row class="mb-4">
      <!-- Grouped bar comparison -->
      <v-col cols="12">
        <ChartCard
          title="Evolução Comparativa da Folha"
          :subtitle="`${yearA} vs ${yearB} — valor bruto mensal`"
          :loading="!comparativeData"
          :height="380"
        >
          <BaseChart :option="groupedBarOption" :height="360" />
        </ChartCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Delta chart -->
      <v-col cols="12" lg="7">
        <ChartCard
          title="Variação Absoluta (R$)"
          :subtitle="`${yearB} − ${yearA}`"
          :loading="!comparativeData"
          :height="320"
        >
          <BaseChart :option="deltaBarOption" :height="300" />
        </ChartCard>
      </v-col>

      <!-- Percentual variation -->
      <v-col cols="12" lg="5">
        <ChartCard
          title="Variação Percentual (%)"
          :loading="!comparativeData"
          :height="320"
        >
          <BaseChart :option="percentVariationOption" :height="300" />
        </ChartCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePayrollData } from '@/composables/usePayrollData'
import { abbreviateNumber, formatCurrency, formatPercent } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber, gerarMeses } from '../utils/formatters'

const { comparativeData, fetchComparative } = usePayrollData()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i)
const yearA = ref(currentYear - 1)
const yearB = ref(currentYear)
const janeiro = new Date(new Date().getFullYear(), 0, 1);
const monthAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const monthInicio = janeiro.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const meses = computed(() => gerarMeses());

async function loadComparative() {
  await fetchComparative(yearA.value, yearB.value)
}

onMounted(() => loadComparative())

const seriesData = computed(() => comparativeData.value?.series ?? [])

const groupedBarOption = computed(() => ({
  legend: { data: [String(yearA.value), String(yearB.value)], position: 'top' },
  xAxis: {
    type: 'category',
    data: seriesData.value.map((d) => d.label),
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      name: String(yearA.value),
      type: 'bar',
      data: seriesData.value.map((d) => d[yearA.value]),
      itemStyle: { color: PAG_CHART_COLORS[0] },
    },
    {
      name: String(yearB.value),
      type: 'bar',
      data: seriesData.value.map((d) => d[yearB.value]),
      itemStyle: { color: PAG_CHART_COLORS[1] },
    },
  ],
}))

const deltaBarOption = computed(() => ({
  xAxis: {
    type: 'category',
    data: seriesData.value.map((d) => d.label),
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      type: 'bar',
      data: seriesData.value.map((d) => {
        const delta = (d[yearB.value] ?? 0) - (d[yearA.value] ?? 0)
        return {
          value: delta,
          itemStyle: { color: delta >= 0 ? PAG_CHART_COLORS[1] : PAG_CHART_COLORS[3] },
        }
      }),
      label: {
        show: true,
        position: 'top',
        formatter: (p) => abbreviateNumber(p.value),
        fontSize: 10,
      },
    },
  ],
}))

const percentVariationOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const p = params[0]
      return `${p.name}<br/>Variação: ${(p.value > 0 ? '+' : '') + p.value.toFixed(2)}%`
    },
  },
  xAxis: {
    type: 'category',
    data: seriesData.value.map((d) => d.label),
    axisLabel: { fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => `${v.toFixed(1)}%` },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: seriesData.value.map((d) => {
        const a = d[yearA.value] ?? 0
        const b = d[yearB.value] ?? 0
        return a ? parseFloat((((b - a) / a) * 100).toFixed(2)) : 0
      }),
      itemStyle: { color: PAG_CHART_COLORS[4] },
      areaStyle: { opacity: 0.1 },
      markLine: {
        data: [{ yAxis: 0 }],
        lineStyle: { color: '#BDBDBD', type: 'dashed' },
        label: { show: false },
      },
    },
  ],
}))
</script>

<style scoped>
.comparativo-filter {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #757575;
  white-space: nowrap;
}
</style>
