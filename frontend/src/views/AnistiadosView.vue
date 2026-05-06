<template>
    <div>
        <div class="mb-5">
        <h1 class="text-h6 font-weight-bold">Anistiados</h1>
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
                    title="DESPESA COM ANISTIADOS"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionAnistiados" :width="360" />
                </ChartCard>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE DE ANISTIADOS"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="lineComparationOptionAnistiadosQuantidade" :width="360" />
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
import { useAppStore } from '@/store/app'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes } from '../utils/formatters'

const { comparativeData, fetchComparative } = usePayrollData()

const appStore = useAppStore()
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

const lineComparationOptionAnistiados = computed(() => ({
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
            data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value || [], 0),
            itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
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
                    formatter: 'Média'
                }
            },
      },
  ],
}))

const lineComparationOptionAnistiadosQuantidade = computed(() => ({
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
    axisLabel: { formatter: (v) => abbreviateNumberSimple(v) },
  },
  series: [
        {
            type: 'line',
            data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value || [], 0),
            itemStyle: { color: PAG_CHART_COLORS[0] },
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