import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'
import { boletimService } from '@/services/boletimService'

/**
 * Store de publicações de boletim financeiro.
 *
 * Mantém o resultado do heatmap em memória durante a sessão.
 * O cache com TTL é gerenciado pelo boletimService via api.js.
 */
export const useBoletimStore = defineStore('boletim', () => {
  const appStore = useAppStore()

  const heatmapData = ref(null)   // { yearA, yearB, dadosYearA, dadosYearB }
  const loading     = ref(false)
  const error       = ref(null)

  async function fetchHeatmap(yearA, yearB) {
    if (loading.value) return

    loading.value = true
    error.value   = null
    try {
      heatmapData.value = await boletimService.getHeatmap(yearA, yearB)
    } catch (err) {
      error.value = err
      appStore.notify({ message: 'Erro ao carregar heatmap de publicações.', type: 'error' })
      console.error('[BoletimStore] fetchHeatmap:', err)
    } finally {
      loading.value = false
    }
  }

  return { heatmapData, loading, error, fetchHeatmap }
})
