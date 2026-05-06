import api, { getCached, setCached } from './api'

/**
 * Serviço de publicações de boletim financeiro.
 *
 * Endpoint: GET /boletim-financeiro/publicacoes/heatmap?yearA=&yearB=
 */
export const boletimService = {

  /**
   * Retorna o heatmap de publicações de boletim financeiro para dois anos comparativos.
   *
   * @param {number} yearA Ano base
   * @param {number} yearB Ano comparativo
   * @returns {Promise<{yearA, yearB, dadosYearA: [string, number][], dadosYearB: [string, number][]}>}
   */
  async getHeatmap(yearA, yearB) {
    const key = `boletim-heatmap:${yearA}:${yearB}`
    const cached = getCached(key, 'boletimHeatmap')
    if (cached) return cached

    const data = await api.get('/boletim-financeiro/publicacoes/heatmap', {
      params: { yearA, yearB },
    })

    // Transforma lista de objetos {data, valor} para o formato [[date, value], ...]
    // que o ECharts calendar heatmap consome diretamente
    const result = {
      yearA: data.yearA,
      yearB: data.yearB,
      dadosYearA: data.dadosYearA.map(i => [i.data, i.valor]),
      dadosYearB: data.dadosYearB.map(i => [i.data, i.valor]),
    }
    setCached(key, result)
    return result
  },
}
