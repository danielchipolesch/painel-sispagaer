<template>
    <div>
        <div class="mb-5">
        <h1 class="text-h6 font-weight-bold">Chamados</h1>
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
                    title="CHAMADOS SOLUCIONADOS 2026 - OBJETOS DA SDPP"
                    :subtitle="`Folhas - ${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionSAU" :width="360" />
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
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes, gerarMesFolha, gerarArrayAleatorio } from '../utils/formatters'

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

const barComparationOptionSAU = computed(() => ({
  legend: { data: ['DIRF E COMPROVANTE DE RENDIMENTOS', 'SINCRONIZAÇÃO - SIGPP', 'OCORRÊNCIAS - SIGPP', 'CADASTRAMENTO DE USUÁRIOS - SIGPP', 'CAIXA EM FOPAG - INCLUSÃO/ALTERAÇÃO/AJUSTE DE CAIXAS', 'BOLETIM AUTOMATIZAÇÃO', 'AUTORIZAÇÃO/CANCELAMENTO DE CAIXAS EM FOPAG'], position: 'top' },
  xAxis: {
    type: 'category',
    data: mesesFolha.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 120,
     interval: 20,
    axisLabel: { formatter: (v) => abbreviateNumberSimple(v) },
  },
  series: [
      {
        name: 'DIRF E COMPROVANTE DE RENDIMENTOS',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[0] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'SINCRONIZAÇÃO - SIGPP',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[1] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'OCORRÊNCIAS - SIGPP',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[2] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'CADASTRAMENTO DE USUÁRIOS - SIGPP',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[3] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'CAIXA EM FOPAG - INCLUSÃO/ALTERAÇÃO/AJUSTE DE CAIXAS',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[4] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'BOLETIM AUTOMATIZAÇÃO',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[5] },
        label: {
            show: true, position: 'top',
        },
      },
      {
        name: 'AUTORIZAÇÃO/CANCELAMENTO DE CAIXAS EM FOPAG',
        type: 'bar',
        data: gerarArrayAleatorio(mesesFolha.value.length, 0, 120),
        itemStyle: { color: PAG_CHART_COLORS[6] },
        label: {
            show: true, position: 'top',
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