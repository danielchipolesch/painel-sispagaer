<template>
  <div>
    <!-- Page header -->
    <div class="mb-4">
      <h1 class="text-h6 font-weight-bold text-on-background">Dashboard</h1>
      <p class="text-caption text-medium-emphasis mt-0.5 mb-0">
        Visão geral da folha de pagamento — competência {{ summary?.competencia ?? '...' }}
      </p>
    </div>

    <PeriodFilter
      v-model:year="appStore.selectedYear"
      v-model:month="appStore.selectedMonth"
      class="mb-5"
      @search="onSearch"
    />

    <!-- KPI cards row -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="3">
        <KpiCard
          label="Total Bruto"
          :value="summary?.totalBruto"
          format="currency"
          icon="mdi-cash-multiple"
          color="primary"
          :trend="summary?.variacaoMensal"
          :loading="!summary"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <KpiCard
          label="Total Descontos"
          :value="summary?.totalDescontos"
          format="currency"
          icon="mdi-cash-minus"
          color="error"
          :loading="!summary"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <KpiCard
          label="Total Líquido"
          :value="summary?.totalLiquido"
          format="currency"
          icon="mdi-cash-check"
          color="success"
          :trend="summary?.variacaoAnual"
          :loading="!summary"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <KpiCard
          label="Total de Pessoal"
          :value="summary?.totalPessoal"
          format="number"
          icon="mdi-account-group"
          color="info"
          :loading="!summary"
        />
      </v-col>
    </v-row>

    <!-- Charts row 1 -->
    <v-row class="mb-4">
      <!-- Monthly evolution line chart -->
      <v-col cols="12" lg="8">
        <ChartCard
          title="Evolução Mensal da Folha"
          :subtitle="`Ano ${appStore.selectedYear} — valores em R$`"
          :loading="!monthlyEvolution.length"
          :height="300"
        >
          <BaseChart :option="evolutionChartOption" :height="280" />
        </ChartCard>
      </v-col>

      <!-- Pie: by category -->
      <v-col cols="12" lg="4">
        <ChartCard
          title="Composição da Folha"
          subtitle="Por categoria de verba"
          :loading="!byCategory.length"
          :height="300"
        >
          <BaseChart :option="categoryPieOption" :height="280" />
        </ChartCard>
      </v-col>
    </v-row>

    <!-- Charts row 2 -->
    <v-row>
      <!-- Bar: by unit -->
      <v-col cols="12" lg="7">
        <ChartCard
          title="Folha por Unidade"
          subtitle="Top organizações militares"
          :loading="!byUnit.length"
          :height="320"
        >
          <BaseChart :option="unitBarOption" :height="300" />
        </ChartCard>
      </v-col>

      <!-- Bar: by rank -->
      <v-col cols="12" lg="5">
        <ChartCard
          title="Folha por Posto/Graduação"
          :loading="!byRank.length"
          :height="320"
        >
          <BaseChart :option="rankBarOption" :height="300" />
        </ChartCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="7">
        <ChartCard
          title="Conformidade da Folha de Pagamento - FOPAG"
          :loading=false
          :height="300"
        >
          <BaseChart :option="gaugeCategoryPieOption" :height="380" />
        </ChartCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/app'
import { usePayrollData } from '@/composables/usePayrollData'
import { abbreviateNumber, formatCurrency, getColor } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import KpiCard from '@/components/cards/KpiCard.vue'
import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

const gaugeValue = ref(10.00)
const appStore = useAppStore()
const { summary, monthlyEvolution, byUnit, byRank, byCategory, fetchAll, byCategoryEfetivoPago } = usePayrollData()

function onSearch({ year, month }) {
  appStore.selectedYear = year
  appStore.selectedMonth = month
  fetchAll()
}

// ─── Chart options ────────────────────────────────────────────────────────────

const evolutionChartOption = computed(() => ({
  legend: {
    data: ['Bruto', 'Líquido'],
    position: 'top',
  },
  xAxis: {
    type: 'category',
    data: monthlyEvolution.value.map((d) => d.label),
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (v) => abbreviateNumber(v),
    },
  },
  series: [
    {
      name: 'Bruto',
      type: 'line',
      data: monthlyEvolution.value.map((d) => d.bruto),
      smooth: true,
      areaStyle: { opacity: 0.1 },
      itemStyle: { color: PAG_CHART_COLORS[0] },
    },
    {
      name: 'Líquido',
      type: 'line',
      data: monthlyEvolution.value.map((d) => d.liquido),
      smooth: true,
      areaStyle: { opacity: 0.1 },
      itemStyle: { color: PAG_CHART_COLORS[1] },
    },
  ],
}))

const categoryPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
  },
  legend: { bottom: 0, type: 'scroll' },
  series: [
    {
      name: 'Categoria',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data: byCategory.value.map((d) => ({ name: d.category, value: d.value })),
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' },
      },
    },
  ],
}))

const unitBarOption = computed(() => ({
  xAxis: {
    type: 'value',
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  yAxis: {
    type: 'category',
    data: byUnit.value.map((d) => d.unit),
    axisLabel: { fontSize: 11 },
  },
  series: [
    {
      type: 'bar',
      data: byUnit.value.map((d) => d.total),
      itemStyle: { color: PAG_CHART_COLORS[0], borderRadius: [0, 4, 4, 0] },
      label: {
        show: true,
        position: 'right',
        formatter: (p) => abbreviateNumber(p.value),
        fontSize: 11,
      },
    },
  ],
}))

const rankBarOption = computed(() => ({
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
      data: byRank.value.map((d) => ({
        value: d.total,
        itemStyle: { color: PAG_CHART_COLORS[byRank.value.indexOf(d) % PAG_CHART_COLORS.length] },
      })),
    },
  ],
}))

const gaugeCategoryPieOption = computed(() => {
  const value = gaugeValue.value
  const color = getColor(value)

  return {
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '88%',
        children: [
          {
            type: 'text',
            left: 0,
            style: {
              text: '🔴 Ruim (<50)',
              fill: '#666',
              fontSize: 12,
            },
          },
          {
            type: 'text',
            left: 130,
            style: {
              text: '🟡 Regular (50-75)',
              fill: '#666',
              fontSize: 12,
            },
          },
          {
            type: 'text',
            left: 280,
            style: {
              text: '🟢 Bom (75-95)',
              fill: '#666',
              fontSize: 12,
            },
          },
          {
            type: 'text',
            left: 430,
            style: {
              text: '🔵 Excelente (95-100)',
              fill: '#666',
              fontSize: 12,
            },
          },
        ],
      },
    ],

    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,

        radius: '90%',
        center: ['50%', '55%'],

        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [0.5, '#ff4d4f'], //até 50%
              [0.75, '#faad14'], //até 75%
              [0.95, '#52c41a'],   //até 95%
              [1, '#1ab0c4'],   //até 100%
            ],
          },
        },

        progress: {
          show: true,
          width: 14,
          itemStyle: {
            color: color,
          },
        },

        pointer: {
          itemStyle: {
            color: color,
          },
          length: '70%',
        },

        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: color,
          fontSize: 24,
        },

        data: [
          {
            value: value,
          },
        ],
      },
    ],
  }
})
</script>
