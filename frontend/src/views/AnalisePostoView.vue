<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h6 font-weight-bold">Análise por Posto/Graduação</h1>
      <p class="text-caption text-medium-emphasis mb-0">
        Distribuição da folha por nível hierárquico
      </p>
    </div>

    <PeriodFilter
      v-model:year="appStore.selectedYear"
      v-model:month="appStore.selectedMonth"
      class="mb-5"
      @search="fetchAll"
    />

    <v-row class="mb-4">
      <!-- Horizontal bar: total por posto -->
      <v-col cols="12" lg="7">
        <ChartCard
          title="Total da Folha por Posto/Graduação"
          subtitle="Valor total pago (R$)"
          :loading="!byRank.length"
          :height="420"
        >
          <BaseChart :option="rankTotalBarOption" :height="400" />
        </ChartCard>
      </v-col>

      <!-- Pie: distribuição percentual -->
      <v-col cols="12" lg="5">
        <ChartCard
          title="Distribuição Percentual"
          subtitle="Participação de cada posto no total"
          :loading="!byRank.length"
          :height="420"
        >
          <BaseChart :option="rankPieOption" :height="400" />
        </ChartCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Scatter: custo médio por pessoa -->
      <v-col cols="12" lg="6">
        <ChartCard
          title="Custo Médio por Militar"
          subtitle="Relação entre total e efetivo por posto"
          :loading="!byRank.length"
          :height="340"
        >
          <BaseChart :option="averageCostOption" :height="320" />
        </ChartCard>
      </v-col>

      <!-- Data table -->
      <v-col cols="12" lg="6">
        <ChartCard
          title="Tabela Resumo"
          :loading="!byRank.length"
          :height="340"
        >
          <v-data-table
            :headers="rankTableHeaders"
            :items="rankTableItems"
            density="compact"
            :items-per-page="10"
            class="rank-table"
          >
            <template #item.total="{ item }">
              {{ formatCurrency(item.total) }}
            </template>
            <template #item.mediaIndividual="{ item }">
              {{ formatCurrency(item.mediaIndividual) }}
            </template>
          </v-data-table>
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
const { byRank, fetchAll } = usePayrollData()

const rankTotalBarOption = computed(() => ({
  xAxis: { type: 'value', axisLabel: { formatter: (v) => abbreviateNumber(v) } },
  yAxis: {
    type: 'category',
    data: byRank.value.map((d) => d.rank),
    axisLabel: { fontSize: 12 },
  },
  series: [
    {
      type: 'bar',
      data: byRank.value.map((d, i) => ({
        value: d.total,
        itemStyle: { color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length], borderRadius: [0, 4, 4, 0] },
      })),
      label: {
        show: true,
        position: 'right',
        formatter: (p) => abbreviateNumber(p.value),
        fontSize: 11,
      },
    },
  ],
}))

const rankPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)}<br/>${p.percent}%`,
  },
  legend: { orient: 'vertical', right: 0, top: 'center', type: 'scroll' },
  series: [
    {
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['38%', '50%'],
      data: byRank.value.map((d) => ({ name: d.rank, value: d.total })),
      label: { show: false },
    },
  ],
}))

const averageCostOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const p = params[0]
      return `${p.name}<br/>Custo médio: ${formatCurrency(p.value)}`
    },
  },
  xAxis: {
    type: 'category',
    data: byRank.value.map((d) => d.rank),
    axisLabel: { fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      type: 'bar',
      data: byRank.value.map((d, i) => ({
        value: d.pessoal ? Math.round(d.total / d.pessoal) : 0,
        itemStyle: { color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length] },
      })),
    },
  ],
}))

const rankTableHeaders = [
  { title: 'Posto/Grad.', key: 'rank', sortable: true },
  { title: 'Efetivo', key: 'pessoal', sortable: true },
  { title: 'Total (R$)', key: 'total', sortable: true },
  { title: 'Média Individual', key: 'mediaIndividual', sortable: true },
]

const rankTableItems = computed(() =>
  byRank.value.map((d) => ({
    rank: d.rank,
    pessoal: d.pessoal,
    total: d.total,
    mediaIndividual: d.pessoal ? Math.round(d.total / d.pessoal) : 0,
  }))
)
</script>

<style scoped>
.rank-table :deep(.v-data-table__td) {
  font-size: 0.8rem;
}
</style>
