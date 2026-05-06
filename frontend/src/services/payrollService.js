import api, { getCached, setCached } from './api'

/**
 * Serviço de folha de pagamento.
 *
 * Mapeamento frontend → backend (Quarkus):
 *   getSummary          → GET /folha-pagamento/dashboard?ano=&mes=
 *   getMonthlyEvolution → GET /folha-pagamento/serie-historica?ano=&mes=&meses=24
 *   getByRank           → GET /folha-pagamento/totais-por-patente?ano=&mes=
 *   getByUnit           → GET /folha-pagamento/totais-por-om?ano=&mes=
 *
 * Os demais métodos ainda retornam mock até que endpoints correspondentes
 * sejam implementados no backend — a estrutura já está preparada para troca.
 */
export const payrollService = {

  async getSummary(year, month) {
    const key = `dashboard:${year}:${month}`
    const cached = getCached(key, 'dashboard')
    if (cached) return cached

    const data = await api.get('/folha-pagamento/dashboard', { params: { ano: year, mes: month } })

    const result = {
      totalBruto:      Number(data.totalBruto),
      totalDescontos:  Number(data.totalDescontos),
      totalLiquido:    Number(data.totalLiquido),
      totalPessoal:    data.qtdMilitares,
      competencia:     _formatCompetencia(data.competenciaAtual),
      variacaoMensal:  null,
      variacaoAnual:   null,
    }
    setCached(key, result)
    return result
  },

  async getMonthlyEvolution(year) {
    const key = `serie-historica:${year}`
    const cached = getCached(key, 'serieHistorica')
    if (cached) return cached

    const now = new Date()
    const data = await api.get('/folha-pagamento/serie-historica', {
      params: { ano: now.getFullYear(), mes: now.getMonth() + 1, meses: 24 },
    })

    const result = data.map(d => ({
      label:   d.competenciaLabel,
      month:   d.mes,
      ano:     d.ano,
      bruto:   Number(d.valBrutoTotal),
      liquido: Number(d.valLiquidoTotal),
      pessoal: d.qtdMilitares,
    }))
    setCached(key, result)
    return result
  },

  async getByRank(year, month) {
    const key = `totais-posto:${year}:${month}`
    const cached = getCached(key, 'totais')
    if (cached) return cached

    const data = await api.get('/folha-pagamento/totais-por-patente', { params: { ano: year, mes: month } })

    const result = data.map(d => ({
      rank:       d.sigPostoGraduacao,
      nome:       d.nomPostoGraduacao,
      categoria:  d.categoria,
      total:      Number(d.valLiquidoTotal),
      bruto:      Number(d.valBrutoTotal),
      desconto:   Number(d.valDescontoTotal),
      pessoal:    d.qtdMilitares,
      mediaSal:   Number(d.mediaSalarial),
    }))
    setCached(key, result)
    return result
  },

  async getByUnit(year, month) {
    const key = `totais-om:${year}:${month}`
    const cached = getCached(key, 'totais')
    if (cached) return cached

    const data = await api.get('/folha-pagamento/totais-por-om', { params: { ano: year, mes: month } })

    const result = data.map(d => ({
      unit:    d.sigOm,
      nome:    d.nomOm,
      comaer:  d.nomComaer,
      uf:      d.uf,
      total:   Number(d.valLiquidoTotal),
      bruto:   Number(d.valBrutoTotal),
      pessoal: d.qtdMilitares,
    }))
    setCached(key, result)
    return result
  },

  // ─── Métodos ainda não implementados no backend — dados mock ─────────────
  // Mantêm a mesma assinatura para substituição futura sem impacto nos stores.

  async getByCategory(year, month) {
    return _mockByCategory()
  },

  async getByCategoryEfetivoPago(year, month) {
    return _mockByCategoryEfetivoPago()
  },

  async getByAuxAlimentODGSA(year, month) {
    return _mockByODGSA()
  },

  async getByAuxTranspODGSA(year, month) {
    return _mockByODGSA()
  },

  async getByGratRepODGSA(year, month) {
    return _mockByGratRep()
  },

  async getByAuxFardODGSA(year, month) {
    return _mockByODGSA()
  },

  async getByQuantMilQuad(year, month) {
    return _mockByQuantMilQuad()
  },

  async getByCustMilQuad(year, month) {
    return _mockByCustMilQuad()
  },

  async getByMorteFicta(year, month) {
    return _mockByMorteFicta()
  },

  async getComparative(yearA, yearB) {
    return _mockComparative(yearA, yearB)
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _formatCompetencia(competenciaAtual) {
  if (!competenciaAtual || competenciaAtual.length !== 6) return competenciaAtual
  const mes = competenciaAtual.slice(4, 6)
  const ano = competenciaAtual.slice(0, 4)
  return `${mes}/${ano}`
}

// ─── Mock data (endpoints pendentes de implementação no backend) ──────────────

function _mockByCategory() {
  return [
    { category: 'Vencimentos',    value: 28_500_000 },
    { category: 'Gratificações',  value:  8_200_000 },
    { category: 'Adicionais',     value:  5_600_000 },
    { category: 'Indenizações',   value:  3_400_000 },
    { category: 'Outros Créditos',value:  3_050_320 },
  ]
}

function _mockByCategoryEfetivoPago() {
  return [
    { category: 'Anistiados',     value: 28_500_000 },
    { category: 'Ativos',         value:  8_200_000 },
    { category: 'Pensionistas',   value:  5_600_000 },
    { category: 'Veteranos',      value:  3_400_000 },
    { category: 'Outros Créditos',value:  3_050_320 },
  ]
}

const _ODGSA_UNITS = [
  'ASOCEA','ASPAER','CENCIAR','CENIPA','CIAER','COMAE','COMGAP','COMGEP',
  'COMPREP','DCTA','DECEA','EMAER','GABAER','INCAER','SECPROM','SEFA',
  'CECOMSAER','COMEXER','MDEFESA','ORGEXT',
]

function _mockByODGSA() {
  return _ODGSA_UNITS.map((u, i) => ({ category: u, value: 3_050_320 + i * 120_000 }))
}

function _mockByGratRep() {
  return _ODGSA_UNITS.slice(1).map((u, i) => ({ category: u, value: 2_800_000 + i * 95_000 }))
}

function _mockByQuantMilQuad() {
  return [
    { category: 'QOAV',   value: 700  },{ category: 'QOENG',  value: 300  },
    { category: 'QOINT',  value: 500  },{ category: 'QOMED',  value: 600  },
    { category: 'QOFARM', value: 1000 },{ category: 'QODENT', value: 2000 },
    { category: 'QOINF',  value: 550  },{ category: 'QOEAV',  value: 800  },
    { category: 'QOECOM', value: 350  },{ category: 'QOEARM', value: 600  },
    { category: 'QOEFOT', value: 750  },{ category: 'QOEMET', value: 755  },
    { category: 'QOECTA', value: 856  },{ category: 'QOESUP', value: 796  },
    { category: 'QOEA',   value: 1052 },{ category: 'QOCAPL', value: 200  },
    { category: 'QOAP',   value: 302  },{ category: 'QCOA',   value: 401  },
    { category: 'QOCON3', value: 408  },{ category: 'QOCON',  value: 326  },
    { category: 'NTQ',    value: 400  },{ category: 'QSS',    value: 600  },
    { category: 'QFG',    value: 601  },{ category: 'QESA',   value: 630  },
    { category: 'QTA',    value: 789  },{ category: 'QSCON',  value: 456  },
    { category: 'QCB',    value: 201  },{ category: 'QCBCON', value: 360  },
    { category: 'QSD',    value: 180  },{ category: 'QEST',   value: 100  },
  ]
}

function _mockByCustMilQuad() {
  return _mockByQuantMilQuad().map(q => ({ category: q.category, value: 3_050_320 }))
}

function _mockByMorteFicta() {
  return [
    { category: 'AP', value: 15 },{ category: 'BR', value: 30 },
    { category: 'CB', value: 80 },{ category: 'CL', value: 40 },
    { category: 'CP', value: 25 },{ category: 'MA', value: 24 },
    { category: 'MJ', value: 63 },{ category: 'SD', value: 27 },
    { category: 'SO', value: 81 },{ category: 'S2', value: 100},
    { category: 'TB', value: 63 },{ category: 'TC', value: 96 },
    { category: 'TM', value: 12 },{ category: 'T1', value: 10 },
    { category: 'T2', value: 52 },{ category: '1S', value: 36 },
    { category: '1T', value: 41 },{ category: '2S', value: 24 },
    { category: '2T', value: 56 },{ category: '3S', value: 67 },
    { category: 'S1', value:  5 },
  ]
}

function _mockComparative(yearA, yearB) {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const base   = 45_000_000
  return {
    yearA,
    yearB,
    series: months.map((label, i) => ({
      label,
      [yearA]: base + i * 200_000 + ((i * 7 + 3) * 50_000),
      [yearB]: base * 1.05 + i * 220_000 + ((i * 11 + 5) * 55_000),
    })),
  }
}
