<template>
    <div>
        <div class="mb-5">
        <h1 class="text-h6 font-weight-bold">Prestação de Tarefa por Tempo Certo - PTTC</h1>
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
                    title="DESPESA ANUAL COM PTTC"
                    :subtitle="`2013 X ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionPTTC" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE DE PTTC"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionPTTC" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE MÉDIA ANUAL DE PTTC"
                    :subtitle="`2013 X ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionPTTCMxA" :width="360" />
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

const { comparativeData, fetchComparative } = usePayrollData()

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

const barComparationOptionPTTC = computed(() => ({
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
        itemStyle: { color: PAG_CHART_COLORS[2] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
        markLine: {
           symbol: ['none', 'none'],
           data: [
                {
                    yAxis: 50000,
                    name: 'Projeção 2026'
                }
            ],
                lineStyle: {
                    color: PAG_CHART_COLORS[1],
                    type: 'dashed'
            },
            label: {
                formatter: 'Proj. 2026'
            }
        },
      },
  ],
}))

const lineComparationOptionPTTC = computed(() => ({
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
        type: 'line',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[2] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
      },
  ],
}))

const lineComparationOptionPTTCMxA = computed(() => ({
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
        type: 'line',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[2] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
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