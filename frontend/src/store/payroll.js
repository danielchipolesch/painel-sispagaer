import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'
import { payrollService } from '@/services/payrollService'

/**
 * Store de dados de folha de pagamento.
 *
 * O cache com TTL por requisição é gerenciado pelo payrollService (api.js),
 * evitando roundtrips desnecessários ao backend para os mesmos parâmetros.
 * Este store guarda o estado reativo para os componentes Vue.
 */
export const usePayrollStore = defineStore('payroll', () => {
  const appStore = useAppStore()

  // ─── State ────────────────────────────────────────────────────────────────
  const summary               = ref(null)
  const monthlyEvolution      = ref([])
  const byRank                = ref([])
  const byUnit                = ref([])
  const byCategory            = ref([])
  const byCategoryEfetivoPago = ref([])
  const byAuxAlimentODGSA     = ref([])
  const byAuxTranspODGSA      = ref([])
  const byGratRepODGSA        = ref([])
  const byAuxFardODGSA        = ref([])
  const byQuantMilQuad        = ref([])
  const byCustMilQuad         = ref([])
  const byMorteFicta          = ref([])
  const comparativeData       = ref(null)

  // ─── Actions ──────────────────────────────────────────────────────────────

  async function fetchSummary(year, month) {
    appStore.startLoading()
    try {
      summary.value = await payrollService.getSummary(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar resumo da folha.', type: 'error' })
      console.error('[PayrollStore] fetchSummary:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchMonthlyEvolution(year) {
    appStore.startLoading()
    try {
      monthlyEvolution.value = await payrollService.getMonthlyEvolution(year)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar evolução mensal.', type: 'error' })
      console.error('[PayrollStore] fetchMonthlyEvolution:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByRank(year, month) {
    appStore.startLoading()
    try {
      byRank.value = await payrollService.getByRank(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados por posto/graduação.', type: 'error' })
      console.error('[PayrollStore] fetchByRank:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByUnit(year, month) {
    appStore.startLoading()
    try {
      byUnit.value = await payrollService.getByUnit(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados por unidade.', type: 'error' })
      console.error('[PayrollStore] fetchByUnit:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByCategory(year, month) {
    appStore.startLoading()
    try {
      byCategory.value = await payrollService.getByCategory(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados por categoria.', type: 'error' })
      console.error('[PayrollStore] fetchByCategory:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByCategoryEfetivoPago(year, month) {
    appStore.startLoading()
    try {
      byCategoryEfetivoPago.value = await payrollService.getByCategoryEfetivoPago(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados por categoria de efetivo pago.', type: 'error' })
      console.error('[PayrollStore] fetchByCategoryEfetivoPago:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByAuxAlimentODGSA(year, month) {
    appStore.startLoading()
    try {
      byAuxAlimentODGSA.value = await payrollService.getByAuxAlimentODGSA(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar AUXÍLIO ALIMENTAÇÃO ODGSA.', type: 'error' })
      console.error('[PayrollStore] fetchByAuxAlimentODGSA:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByAuxTranspODGSA(year, month) {
    appStore.startLoading()
    try {
      byAuxTranspODGSA.value = await payrollService.getByAuxTranspODGSA(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar AUXÍLIO DE TRANSPORTE ODGSA.', type: 'error' })
      console.error('[PayrollStore] fetchByAuxTranspODGSA:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByGratRepODGSA(year, month) {
    appStore.startLoading()
    try {
      byGratRepODGSA.value = await payrollService.getByGratRepODGSA(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar GRATIFICAÇÃO POR REPRESENTAÇÃO ODGSA.', type: 'error' })
      console.error('[PayrollStore] fetchByGratRepODGSA:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByAuxFardODGSA(year, month) {
    appStore.startLoading()
    try {
      byAuxFardODGSA.value = await payrollService.getByAuxFardODGSA(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar AUXÍLIO DE FARDAMENTO ODGSA.', type: 'error' })
      console.error('[PayrollStore] fetchByAuxFardODGSA:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByQuantMilQuad(year, month) {
    appStore.startLoading()
    try {
      byQuantMilQuad.value = await payrollService.getByQuantMilQuad(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar MILITARES POR QUADRO.', type: 'error' })
      console.error('[PayrollStore] fetchByQuantMilQuad:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByCustMilQuad(year, month) {
    appStore.startLoading()
    try {
      byCustMilQuad.value = await payrollService.getByCustMilQuad(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar CUSTO POR QUADRO DE MILITARES.', type: 'error' })
      console.error('[PayrollStore] fetchByCustMilQuad:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchByMorteFicta(year, month) {
    appStore.startLoading()
    try {
      byMorteFicta.value = await payrollService.getByMorteFicta(year, month)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados de Morte Ficta.', type: 'error' })
      console.error('[PayrollStore] fetchByMorteFicta:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  async function fetchComparative(yearA, yearB) {
    appStore.startLoading()
    try {
      comparativeData.value = await payrollService.getComparative(yearA, yearB)
    } catch (err) {
      appStore.notify({ message: 'Erro ao carregar dados comparativos.', type: 'error' })
      console.error('[PayrollStore] fetchComparative:', err)
    } finally {
      appStore.stopLoading()
    }
  }

  return {
    summary,
    monthlyEvolution,
    byRank,
    byUnit,
    byCategory,
    byCategoryEfetivoPago,
    byAuxAlimentODGSA,
    byAuxTranspODGSA,
    byGratRepODGSA,
    byAuxFardODGSA,
    byQuantMilQuad,
    byCustMilQuad,
    byMorteFicta,
    comparativeData,
    fetchSummary,
    fetchMonthlyEvolution,
    fetchByRank,
    fetchByUnit,
    fetchByCategory,
    fetchByCategoryEfetivoPago,
    fetchByAuxAlimentODGSA,
    fetchByAuxTranspODGSA,
    fetchByGratRepODGSA,
    fetchByAuxFardODGSA,
    fetchByQuantMilQuad,
    fetchByCustMilQuad,
    fetchByMorteFicta,
    fetchComparative,
  }
})
