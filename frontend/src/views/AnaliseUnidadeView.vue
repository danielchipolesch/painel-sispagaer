<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h6 font-weight-bold">Análise por Unidade</h1>
      <p class="text-caption text-medium-emphasis mb-0">
        Distribuição da folha por organização militar
      </p>
    </div>

    <PeriodFilter
      v-model:year="appStore.selectedYear"
      v-model:month="appStore.selectedMonth"
      class="mb-5"
      @search="fetchAll"
    />

    <v-row class="mb-4">
      <v-col cols="12" lg="8">
        <ChartCard
          title="Total da Folha por Unidade"
          subtitle="Valor total pago (R$)"
          :loading="!byUnit.length"
          :height="380"
        >
          <BaseChart :option="unitBarOption" :height="360" />
        </ChartCard>
      </v-col>

      <v-col cols="12" lg="4">
        <ChartCard
          title="Participação por Unidade"
          :loading="!byUnit.length"
          :height="380"
        >
          <BaseChart :option="unitPieOption" :height="360" />
        </ChartCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ChartCard
          title="Custo Médio por Militar — por Unidade"
          subtitle="Total ÷ efetivo"
          :loading="!byUnit.length"
          :height="300"
        >
          <BaseChart :option="unitAvgOption" :height="280" />
        </ChartCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePayrollData } from '@/composables/usePayrollData'
import { formatCurrency, abbreviateNumber } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

const appStore = useAppStore()
const { byUnit, fetchAll } = usePayrollData()

const unitBarOption = computed(() => ({
  xAxis: {
    type: 'category',
    data: byUnit.value.map((d) => d.unit),
    axisLabel: { fontSize: 11, rotate: 15 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      type: 'bar',
      data: byUnit.value.map((d, i) => ({
        value: d.total,
        itemStyle: { color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length] },
      })),
      label: {
        show: true,
        position: 'top',
        formatter: (p) => abbreviateNumber(p.value),
        fontSize: 11,
      },
    },
  ],
}))

const unitPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)}<br/>${p.percent}%`,
  },
  legend: { bottom: 0, type: 'scroll' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '68%'],
      center: ['50%', '44%'],
      data: byUnit.value.map((d) => ({ name: d.unit, value: d.total })),
      label: { show: false },
    },
  ],
}))

const unitAvgOption = computed(() => ({
  xAxis: {
    type: 'category',
    data: byUnit.value.map((d) => d.unit),
    axisLabel: { fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      type: 'bar',
      data: byUnit.value.map((d, i) => ({
        value: d.pessoal ? Math.round(d.total / d.pessoal) : 0,
        itemStyle: { color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length] },
      })),
      label: {
        show: true,
        position: 'top',
        formatter: (p) => abbreviateNumber(p.value),
        fontSize: 11,
      },
    },
  ],
}))
</script>
