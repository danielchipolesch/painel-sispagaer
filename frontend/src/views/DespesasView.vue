<template>
    <div>
        <div class="mb-5">
            <h1 class="text-h6 font-weight-bold">Despesas: Auxílio Alimentação / Transporte / Grat. de Localidade Especial / Fardamento</h1>
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
                    title="DESPESA COM AUXÍLIO ALIMENTAÇÃO"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxAliment" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESA COM AUXÍLIO TRANSPORTE"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxTransp" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESEPESA COM GRAT. DE LOCALIDADE ESPECIAL"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionGratLocEsp" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESA COM AUXÍLIO FARDAMENTO"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxFard" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="AUXÍLIO ALIMENTAÇÃO POR ODGSA"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!byAuxAlimentODGSA"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxAlimentODGSA" :width="500" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="AUXÍLIO TRANSPORTE POR ODGSA"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!byAuxTranspODGSA"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxTranspODGSA" :width="500" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="AUXÍLIO FARDAMENTO POR ODGSA"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!byAuxFardODGSA"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxFardODGSA" :width="500" />
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

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes } from '../utils/formatters'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const { comparativeData, fetchComparative, byAuxAlimentODGSA, byAuxTranspODGSA, byAuxFardODGSA } = usePayrollData()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i)
const yearA = ref(currentYear - 1)
const yearB = ref(currentYear)

const janeiro = new Date(new Date().getFullYear(), 0, 1);
const monthAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const monthInicio = janeiro.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const meses = computed(() => gerarMeses() || []);
const yearsNew = computed(() => gerarAnos());
const fakeData = gerarSeriesFake(meses, yearA.value, yearB.value);

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

const barComparationOptionAuxAliment = computed(() => ({
  xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 60000,
     interval: 15000,
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
      {
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))

const barComparationOptionAuxTransp = computed(() => ({
  xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 60000,
     interval: 15000,
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
      {
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))

const barComparationOptionGratLocEsp = computed(() => ({
  xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 60000,
     interval: 15000,
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
      {
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))

const barComparationOptionAuxFard = computed(() => ({
  xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 60000,
     interval: 15000,
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
      {
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))

const barComparationOptionAuxAlimentODGSA = computed(() => {
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
      data: byAuxAlimentODGSA.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        data: byAuxAlimentODGSA.value.map((d, i) => ({
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
const barComparationOptionAuxTranspODGSA = computed(() => {
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
      data: byAuxTranspODGSA.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        data: byAuxTranspODGSA.value.map((d, i) => ({
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
const barComparationOptionAuxFardODGSA = computed(() => {
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
      data: byAuxFardODGSA.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        data: byAuxFardODGSA.value.map((d, i) => ({
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
</script>