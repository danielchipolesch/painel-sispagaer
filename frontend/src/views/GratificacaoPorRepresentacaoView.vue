<template>
    <div>
        <div class="mb-5">
        <h1 class="text-h6 font-weight-bold">Gratificação por Representação Eventual</h1>
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

        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESA COM GRAT. REP. EVENTUAL"
                    :subtitle="`2013 X ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionGratRep" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="GRAT. LOCALIDADE ESPECIAL POR ODGSA"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!byGratRepODGSA"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionGratRepODGSA" :width="360" />
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

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes } from '../utils/formatters'

const { comparativeData, fetchComparative, byGratRepODGSA } = usePayrollData()

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

const barComparationOptionGratRep = computed(() => ({
  xAxis: {
    type: 'category',
    data: yearsNew.value,
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
        itemStyle: { color: PAG_CHART_COLORS[17] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))
const barComparationOptionGratRepODGSA = computed(() => {
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
      data: byGratRepODGSA.value.map((d) => d.category),
      axisLabel: { fontSize: 12, interval: 0 },
    },
    series: [
      {
        type: 'bar',
        data: byGratRepODGSA.value.map((d, i) => ({
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