<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h6 font-weight-bold">Boletim Financeiro</h1>
      <p class="text-caption text-medium-emphasis mb-0">
        Frequência de publicações por dia — comparativo anual.
      </p>
    </div>

    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="auto">
        <v-select
          v-model="yearA"
          :items="availableYears"
          label="Ano base"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 120px"
        />
      </v-col>
      <v-col cols="12" sm="auto">
        <v-select
          v-model="yearB"
          :items="availableYears"
          label="Ano comparativo"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 140px"
        />
      </v-col>
      <v-col cols="12" sm="auto">
        <v-btn-toggle v-model="selectedColor" mandatory density="compact" variant="outlined">
          <v-btn value="blue" color="blue-darken-2" size="small">Azul</v-btn>
          <v-btn value="red"  color="red-darken-2"  size="small">Vermelho</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          :loading="boletimStore.loading"
          @click="loadHeatmap"
        >
          Atualizar
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ChartCard
          title="PUBLICAÇÕES DE BOLETIM FINANCEIRO"
          :subtitle="`${yearA} × ${yearB}`"
          :loading="boletimStore.loading"
        >
          <template v-if="hasData">
            <BaseChart :option="heatmapOption" :height="480" />
          </template>
          <template v-else-if="boletimStore.error">
            <v-alert type="error" variant="tonal" class="ma-4">
              Não foi possível carregar os dados do heatmap. Verifique a conexão com o backend.
            </v-alert>
          </template>
          <template v-else-if="!boletimStore.loading">
            <div class="d-flex justify-center align-center" style="height: 200px;">
              <v-progress-circular indeterminate color="primary" />
            </div>
          </template>
        </ChartCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBoletimStore } from '@/store/boletim'
import ChartCard from '@/components/cards/ChartCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const boletimStore = useBoletimStore()

const currentYear    = new Date().getFullYear()
const yearA          = ref(currentYear - 1)
const yearB          = ref(currentYear)
const selectedColor  = ref('blue')

const availableYears = computed(() => {
  const years = []
  for (let y = currentYear; y >= 2020; y--) years.push(y)
  return years
})

const colorPalettes = {
  red:  ['#fce4e4', '#f1aeb5', '#e03131', '#842029'],
  blue: ['#e7f1ff', '#74c0fc', '#1971c2', '#084298'],
}

const hasData = computed(() =>
  boletimStore.heatmapData?.dadosYearA?.length > 0 ||
  boletimStore.heatmapData?.dadosYearB?.length > 0
)

const heatmapOption = computed(() => {
  if (!hasData.value) return {}

  const dadosA = boletimStore.heatmapData.dadosYearA ?? []
  const dadosB = boletimStore.heatmapData.dadosYearB ?? []

  const allValues  = [...dadosA, ...dadosB].map(d => d[1])
  const maxValue   = allValues.length ? Math.max(...allValues) : 10
  const palette    = colorPalettes[selectedColor.value]

  return {
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (p) => {
        if (!p.value) return ''
        return `
          <div style="padding:6px 8px;line-height:1.6">
            <div><strong>${p.value[0]}</strong></div>
            <div>📋 ${p.value[1]} publicaç${p.value[1] === 1 ? 'ão' : 'ões'}</div>
          </div>`
      },
    },

    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      itemWidth: 15,
      itemHeight: 100,
      inRange: { color: palette },
    },

    title: [
      {
        text: String(yearA.value),
        left: 'center',
        top: 20,
        textStyle: { fontSize: 14, fontWeight: 'bold' },
      },
      {
        text: String(yearB.value),
        left: 'center',
        top: 200,
        textStyle: { fontSize: 14, fontWeight: 'bold' },
      },
    ],

    calendar: [
      {
        top: 55,
        left: 40,
        right: 20,
        range: String(yearA.value),
        cellSize: ['auto', 16],
        orient: 'horizontal',
        dayLabel: { firstDay: 1, nameMap: 'pt' },
        monthLabel: { nameMap: 'pt' },
        yearLabel: { show: false },
        itemStyle: {
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.08)',
        },
      },
      {
        top: 235,
        left: 40,
        right: 20,
        range: String(yearB.value),
        cellSize: ['auto', 16],
        orient: 'horizontal',
        dayLabel: { firstDay: 1, nameMap: 'pt' },
        monthLabel: { nameMap: 'pt' },
        yearLabel: { show: false },
        itemStyle: {
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.08)',
        },
      },
    ],

    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: dadosA,
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' } },
      },
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: dadosB,
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' } },
      },
    ],
  }
})

async function loadHeatmap() {
  await boletimStore.fetchHeatmap(yearA.value, yearB.value)
}

watch([yearA, yearB], () => loadHeatmap())

onMounted(() => loadHeatmap())
</script>
