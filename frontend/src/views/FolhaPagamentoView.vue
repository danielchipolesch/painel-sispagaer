<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h6 font-weight-bold">Folha de Pagamento</h1>
        <p class="text-caption text-medium-emphasis mb-0">Detalhamento mensal por competência</p>
      </div>
    </div>

    <!-- Filters -->
    <PeriodFilter
      v-model:year="appStore.selectedYear"
      v-model:month="appStore.selectedMonth"
      class="mb-5"
      @search="fetchAll"
    />

    <!-- Summary cards -->
    <v-row class="mb-5">
      <v-col cols="12" md="4">
        <KpiCard
          label="Competência"
          :value="summary?.competencia ?? '—'"
          format="text"
          icon="mdi-calendar-month"
          color="primary"
          :loading="!summary"
        />
      </v-col>
      <v-col cols="12" md="4">
        <KpiCard
          label="Total Bruto da Folha"
          :value="summary?.totalBruto"
          format="currency"
          icon="mdi-cash-multiple"
          color="primary"
          :trend="summary?.variacaoMensal"
          :loading="!summary"
        />
      </v-col>
      <v-col cols="12" md="4">
        <KpiCard
          label="Total Líquido da Folha"
          :value="summary?.totalLiquido"
          format="currency"
          icon="mdi-cash-check"
          color="success"
          :loading="!summary"
        />
      </v-col>
    </v-row>

    <!-- Evolution chart full width -->
    <v-row class="mb-4">
      <v-col cols="12">
        <ChartCard
          title="Evolução da Folha no Ano"
          :subtitle="`Bruto × Líquido × Descontos — ${appStore.selectedYear}`"
          :loading="!monthlyEvolution.length"
          :height="360"
        >
          <BaseChart :option="fullEvolutionOption" :height="340" />
        </ChartCard>
      </v-col>
    </v-row>

    <!-- Category breakdown + headcount -->
    <v-row>
      <v-col cols="12" md="6">
        <ChartCard
          title="Composição por Categoria de Verba"
          :loading="!byCategory.length"
          :height="340"
        >
          <BaseChart :option="categoryBarOption" :height="320" />
        </ChartCard>
      </v-col>
      <v-col cols="12" md="6">
        <ChartCard
          title="Evolução do Quadro de Pessoal"
          subtitle="Total de militares na folha por mês"
          :loading="!monthlyEvolution.length"
          :height="340"
        >
          <BaseChart :option="headcountOption" :height="320" />
        </ChartCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePayrollData } from '@/composables/usePayrollData'
import { abbreviateNumber, formatCurrency } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import KpiCard from '@/components/cards/KpiCard.vue'
import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

const appStore = useAppStore()
const { summary, monthlyEvolution, byCategory, fetchAll } = usePayrollData()

// Full 3-series area chart
const fullEvolutionOption = computed(() => ({
  legend: { data: ['Bruto', 'Líquido', 'Descontos'], bottom: 0 },
  xAxis: {
    type: 'category',
    data: monthlyEvolution.value.map((d) => d.label),
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 30 }],
  series: [
    {
      name: 'Bruto',
      type: 'line',
      smooth: true,
      data: monthlyEvolution.value.map((d) => d.bruto),
      areaStyle: { opacity: 0.15 },
      itemStyle: { color: PAG_CHART_COLORS[0] },
    },
    {
      name: 'Líquido',
      type: 'line',
      smooth: true,
      data: monthlyEvolution.value.map((d) => d.liquido),
      areaStyle: { opacity: 0.15 },
      itemStyle: { color: PAG_CHART_COLORS[1] },
    },
    {
      name: 'Descontos',
      type: 'line',
      smooth: true,
      data: monthlyEvolution.value.map((d) => d.bruto - d.liquido),
      areaStyle: { opacity: 0.1 },
      itemStyle: { color: PAG_CHART_COLORS[3] },
    },
  ],
}))

const categoryBarOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)}`,
  },
  xAxis: {
    type: 'category',
    data: byCategory.value.map((d) => d.category),
    axisLabel: { fontSize: 11, interval: 0, rotate: 15 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
    {
      type: 'bar',
      data: byCategory.value.map((d, i) => ({
        value: d.value,
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

const headcountOption = computed(() => ({
  xAxis: {
    type: 'category',
    data: monthlyEvolution.value.map((d) => d.label),
  },
  yAxis: {
    type: 'value',
    min: (v) => Math.floor(v.min * 0.97),
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: monthlyEvolution.value.map((d) => d.pessoal),
      itemStyle: { color: PAG_CHART_COLORS[4] },
      areaStyle: { color: PAG_CHART_COLORS[4], opacity: 0.12 },
      markLine: {
        data: [{ type: 'average', name: 'Média' }],
        lineStyle: { color: PAG_CHART_COLORS[2] },
        label: { formatter: 'Média: {c}' },
      },
    },
  ],
}))
</script>
