<template>
    <div>
        <div class="mb-5">
            <h1 class="text-h6 font-weight-bold">Militares x Quadro</h1>
            <p class="text-caption text-medium-emphasis mb-0">
                Consultar período escolhido.
            </p>
        </div>

        <PeriodFilter
        v-model:year="appStore.selectedYear"
        v-model:month="appStore.selectedMonth"
        class="mb-5"
        @search="fetchAll"
        />

        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE MÉDIA ANUAL DE MILITARES DE CARREIRA x TEMPORÁRIOS."
                    :subtitle="`${yearA} X ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionMilCarTemp" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE MENSAL DE MILITARES DE CARREIRA x TEMPORÁRIOS."
                    :subtitle="`${yearA} X ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionMilCarTempY" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE MENSAL DE MILITARES POR QUADRO."
                    :subtitle="`${yearA} X ${yearB}`"
                    :loading="!byQuantMilQuad.length"
                    >
                    <BaseChart :option="barComparationOptionMilxQuad" :width="360" :height="byQuantMilQuad.length * 20" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="CUSTO MENSAL POR QUADRO DE MILITARES."
                    :subtitle="`${yearA} X ${yearB}`"
                    :loading="!byCustMilQuad.length"
                    >
                    <BaseChart :option="barComparationOptionCustMilQuad" :width="360" :height="byCustMilQuad.length * 20" />
                </ChartCard>

            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePayrollData } from '@/composables/usePayrollData'
import { abbreviateNumber, formatCurrency, formatPercent, abbreviateNumberSimple } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

import { useAppStore } from '@/store/app'
import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes } from '../utils/formatters'

const appStore = useAppStore()

const { comparativeData, fetchComparative, byQuantMilQuad, byCustMilQuad } = usePayrollData()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i)
const yearA = ref(currentYear - 1)
const yearB = ref(currentYear)

const janeiro = new Date(new Date().getFullYear(), 0, 1);
const monthAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const monthInicio = janeiro.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const meses = computed(() => gerarMeses() || []);
const yearsNew = computed(() => gerarAnos());

const seriesDataFinal = computed(() => {
    const real = comparativeData.value?.series;

  if (Array.isArray(real) && real.length) {
    return real;
  }
  return gerarSeriesFake(meses.value, yearA.value, yearB.value);
});

async function loadComparative() {
  await fetchComparative(yearA.value, yearB.value)
}

onMounted(() => loadComparative())

const seriesData = computed(() => comparativeData.value?.series ?? [])

const lineComparationOptionMilCarTemp = computed(() => ({
  legend: { data: ['Carreira', 'Temporários'], position: 'top' },
  xAxis: {
    type: 'category',
    data: yearsNew.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
    min: (value) => Math.min(value.min, 15000),
    max: (value) => Math.max(value.max, 140000),
    axisLabel: { formatter: (value) => value.toLocaleString('pt-BR') },
  },
  series: [
      {
        name: 'Carreira',
        type: 'line',
        data: seriesDataFinal.value.map((d) => Number(d?.[yearA.value]) || 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
        
      },
      {
        name: 'Temporários',
        type: 'line',
        data: seriesDataFinal.value.map((d) => Number(d?.[yearB.value]) || 0),
        itemStyle: { color: PAG_CHART_COLORS[1] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },

      },
  ],
}))
const lineComparationOptionMilCarTempY = computed(() => ({
  legend: { data: ['Carreira', 'Temporários'], position: 'top' },
  xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
    min: (value) => Math.min(value.min, 15000),
    max: (value) => Math.max(value.max, 140000),
    axisLabel: { formatter: (value) => value.toLocaleString('pt-BR') },
  },
  series: [
      {
        name: 'Carreira',
        type: 'line',
        data: seriesDataFinal.value.map((d) => Number(d?.[yearA.value]) || 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
        
      },
      {
        name: 'Temporários',
        type: 'line',
        data: seriesDataFinal.value.map((d) => Number(d?.[yearB.value]) || 0),
        itemStyle: { color: PAG_CHART_COLORS[1] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },

      },
  ],
}))
const barComparationOptionMilxQuad = computed(() => {
  return {
    grid: {
      left: 25,
      right: 40,
      top: 20,
      bottom: 20,
      containLabel: true,
    },

    xAxis: { type: 'value', axisLabel: { formatter: (v) => abbreviateNumberSimple(v) } },
    yAxis: {
      type: 'category',
      data: byQuantMilQuad.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        barCategoryGap: '80%', // aumenta espaço entre grupos
        data: byQuantMilQuad.value.map((d, i) => ({
          value: d.value,
          itemStyle: { color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length], borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right',
          formatter: (p) => abbreviateNumberSimple(p.value),
          fontSize: 11,
        },
      },
    ],
  }
})
const barComparationOptionCustMilQuad = computed(() => {
  return {
    grid: {
      left: 25,
      right: 40,
      top: 20,
      bottom: 20,
      containLabel: true,
    },

    xAxis: { type: 'value', axisLabel: { formatter: (v) => abbreviateNumber(v) } },
    yAxis: {
      type: 'category',
      data: byCustMilQuad.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        barCategoryGap: '80%', // aumenta espaço entre grupos
        data: byCustMilQuad.value.map((d, i) => ({
          value: d.value,
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
  }
})
</script>