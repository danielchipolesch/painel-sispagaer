<template>
    <div>
        <div class="mb-5">
        <h1 class="text-h6 font-weight-bold">Morte Ficta</h1>
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
                    title="QUANTIDADE DE PENSÃO POR MORTE FICTA POR POSTO"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!byMorteFicta"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionMorteFicta" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePayrollData } from '@/composables/usePayrollData'
import { useAppStore } from '@/store/app'
import { abbreviateNumber, formatCurrency, formatPercent, abbreviateNumberSimple } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes, gerarMesFolha, gerarArrayAleatorio } from '../utils/formatters'

const appStore = useAppStore()

const { comparativeData, fetchComparative, byMorteFicta } = usePayrollData()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i)
const yearA = ref(currentYear - 1)
const yearB = ref(currentYear)

const janeiro = new Date(new Date().getFullYear(), 0, 1);
const monthAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const monthInicio = janeiro.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
const meses = computed(() => gerarMeses() || []);
const mesesFolha = computed(() => gerarMesFolha() || []);
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

const barComparationOptionMorteFicta = computed(() => {
  return {
    grid: {
      left: 25,
      right: 40,
      top: 10,
      bottom: 20,
      containLabel: true,
    },

    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: (v) => abbreviateNumberSimple(v),
      },
    },

    yAxis: {
      type: 'category',
      data: byMorteFicta.value.map((d) => d.category),
      axisLabel: {
        fontSize: 12,
        interval: 0, // 👈 garante que TODAS aparecem
      },
    },

    series: [
      {
        type: 'bar',
        data: byMorteFicta.value.map((d, i) => ({
          value: d.value ?? 0, // 👈 evita falha silenciosa
          itemStyle: {
            color: PAG_CHART_COLORS[i % PAG_CHART_COLORS.length],
            borderRadius: [0, 4, 4, 0],
          },
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