<template>
    <div>
        <div class="mb-5">
            <h1 class="text-h6 font-weight-bold">RCEG</h1>
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
                    title="DESPESA COM AUXÍLIO FARDAMENTO x RECEITA PRVF."
                    :subtitle="`${monthInicio}-${yearA} X ${monthAtual}-${yearB}`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionAuxFardxPrvf" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="QUANTIDADE DE EFETIVO PAGO ( PENSIONISTAS E VETERANOS ) - DEZ-24 X DEZ-25."
                    :subtitle="`DEZ-2024 X DEZ-2025`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionPenVet20242025" :width="360" />
                </ChartCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="15">
                <ChartCard
                    title="DESPESA COM EFETIVO (PENSIONISTAS E VETERANOS) - ACUMULADO 2024 / 2025."
                    :subtitle="`2024 X 2025`"
                    :loading="!comparativeData"
                    :height="380"
                    >
                    <BaseChart :option="barComparationOptionPenVetAcumulado20242025" :width="360" />
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

const barComparationOptionAuxFardxPrvf = computed(() => ({
  legend: { data: ['Despesa Auxílio Fardamento', 'Receita PRVF'], position: 'top' },
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
    axisLabel: { formatter: (v) => abbreviateNumber(v) },
  },
  series: [
      {
        name: 'Despesa Auxílio Fardamento',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[0] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
      {
        name: 'Receita PRVF',
        type: 'bar',
        data: gerarArrayAleatorio(meses.value.length, 0, 70000),
        itemStyle: { color: PAG_CHART_COLORS[1] },
            label: {
            show: true,
            position: 'top',
            formatter: (p) => abbreviateNumber(p.value),
            fontSize: 10,
        },
      },
  ],
}))
const barComparationOptionPenVet20242025 = computed(() => ({
  legend: {
    data: ['DEZ-2024', 'DEZ-2025'],
    top: 0
  },

  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    data: ['Pensionista', 'Veteranos'], // 👈 categorias corretas
    axisTick: { show: false }
  },

  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (v) => `R$${v.toFixed(1)}B`
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E5E7EB'
      }
    }
  },
  series: [
    {
      name: 'DEZ-2024',
      type: 'bar',
      data: [8.3, 9.2], // 👈 dados reais (ou dinâmicos depois)
      itemStyle: {
        color: '#9AC26B',
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: (p) => `R$${p.value}B`,
        fontSize: 11
      }
    },
    {
      name: 'DEZ-2025',
      type: 'bar',
      data: [2.5, 3.6],
      itemStyle: {
        color: '#7AA4C8',
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: (p) => `R$${p.value}B`,
        fontSize: 11
      }
    }
  ]
}))
const barComparationOptionPenVetAcumulado20242025 = computed(() => ({
  legend: {
    data: ['2024', '2025'],
    top: 0
  },

  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    data: ['Pensionista', 'Veteranos'], // 👈 categorias corretas
    axisTick: { show: false }
  },

  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (v) => `R$${v.toFixed(1)}B`
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E5E7EB'
      }
    }
  },
  series: [
    {
      name: '2024',
      type: 'bar',
      data: [5.3, 8.2], // 👈 dados reais (ou dinâmicos depois)
      itemStyle: {
        color: '#9AC26B',
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: (p) => `R$${p.value}B`,
        fontSize: 11
      }
    },
    {
      name: '2025',
      type: 'bar',
      data: [5.5, 8.6],
      itemStyle: {
        color: '#7AA4C8',
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: (p) => `R$${p.value}B`,
        fontSize: 11
      }
    }
  ]
}))
</script>