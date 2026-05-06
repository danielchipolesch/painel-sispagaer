<template>
    <div>
        <div class="mb-5">
            <h1 class="text-h6 font-weight-bold">Comparativo por Categoria - Anistiados / Ativos / Pensionistas / Veteranos</h1>
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
                    title="QUANTIDADE MENSAL POR CATEGORIA"
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionMesCategoria" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="EFETIVO PAGO"
                    :loading="!byCategoryEfetivoPago"
                    :height="380"
                    >
                    <BaseChart :option="pieComparationOptionEfetivoPago" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESA ANUAL MÉDIA COM EFETIVO POR CATEGORIA"
                    :loading="!byCategoryEfetivoPago"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionDespesaEfetivoPago" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESAS POR CATEGORIA - 2026"
                    :loading="!byCategoryEfetivoPago"
                    :height="380"
                    >
                    <BaseChart :option="pieComparationOptionDespesaPorCategoria" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import { usePayrollData } from '@/composables/usePayrollData'
import { abbreviateNumber, formatCurrency, formatPercent, abbreviateNumberSimple } from '@/utils/formatters'
import { PAG_CHART_COLORS } from '@/utils/chartTheme'

import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'
import { formatNumber, gerarAnos, gerarMeses, gerarSeriesFake, calcularMediaPorAno, preencherAnosFaltantes, gerarMesFolha, gerarArrayAleatorio } from '../utils/formatters'

const appStore = useAppStore()

const { comparativeData, fetchComparative, fetchAll, byCategoryEfetivoPago  } = usePayrollData()

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

async function loadComparative() {
  await fetchComparative(yearA.value, yearB.value)
}

onMounted(() => loadComparative())

const seriesData = computed(() => comparativeData.value?.series ?? [])

const barComparationOptionMesCategoria = computed(() => ({
  legend: { data: ['Anistiados', 'Ativos', 'Pensionistas', 'Veteranos'], position: 'top' },
    xAxis: {
    type: 'category',
    data: meses.value,
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
     min: 0,
     max: 70000,
     interval: 10000,
    axisLabel: { formatter: (v) => abbreviateNumberSimple(v) },
  },
  series: [
      {
        name: 'Anistiados',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Ativos',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[1] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Pensionistas',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[2] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Veteranos',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[3] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumberSimple(p.value),
            fontSize: 10,
        },
      },
  ],
}))
const pieComparationOptionEfetivoPago = computed(() => {
  const data = byCategoryEfetivoPago.value.map((d) => ({
    name: d.category,
    value: d.value
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: { bottom: 0, type: 'scroll' },

    graphic: 
    [   {
            type: 'text',
            left: 'center',
            top: 'middle',
            z: 100,
            style: {
                text: formatCurrency(total),
                textAlign: 'center',
                fill: '#333',
                fontSize: 12,
                fontWeight: 'bold',
                textAlign: 'center',
            }
        },
        {
            type: 'text',
            left: 'center',
            top: '52%',
            z: 100,
            style: {
            text: 'Total',
            fill: '#999',
            fontSize: 12,
            textAlign: 'center'
            }
        }
    ],
    

    series: [
      {
        name: 'Categoria',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data,
        label: {
          show: true,
          formatter: (p) => `${formatCurrency(p.value)}\n(${p.percent}%)`,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        },
      },
    ],
  }
})
const barComparationOptionDespesaEfetivoPago = computed(() => ({
    legend: {data: ['Anistiados', 'Ativos', 'Pensionistas', 'Veteranos'], position: 'top'},
    xAxis: {
    type: 'category',
    data: yearsNew.value,
    axisLabel: { interval: 0},
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
        name: 'Anistiados',
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
      {
        name: 'Ativos',
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[1] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Pensionistas',
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[2] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Veteranos',
        type: 'bar',
        data: preencherAnosFaltantes(seriesData.value || [], yearsNew.value, 0),
        itemStyle: { color: PAG_CHART_COLORS[3] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))
const pieComparationOptionDespesaPorCategoria = computed(() => {
  const data = byCategoryEfetivoPago.value.map((d) => ({
    name: d.category,
    value: d.value
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: { bottom: 0, type: 'scroll' },

    graphic: 
    [   {
            type: 'text',
            left: 'center',
            top: 'middle',
            z: 100,
            style: {
                text: formatCurrency(total),
                textAlign: 'center',
                fill: '#333',
                fontSize: 12,
                fontWeight: 'bold',
                textAlign: 'center',
            }
        },
        {
            type: 'text',
            left: 'center',
            top: '52%',
            z: 100,
            style: {
            text: 'Total',
            fill: '#999',
            fontSize: 12,
            textAlign: 'center'
            }
        }
    ],
    

    series: [
      {
        name: 'Categoria',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data,
        label: {
          show: true,
          formatter: (p) => `${formatCurrency(p.value)}\n(${p.percent}%)`,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
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