import axios from 'axios'

/**
 * Instância Axios configurada para todas as requisições ao backend.
 *
 * Base URL: sempre '/api' — roteado pelo proxy Vite (dev) ou Nginx (prod).
 * O proxy remove o prefixo '/api' antes de encaminhar ao Quarkus.
 */
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // API Key obrigatória para todos os endpoints protegidos
    const apiKey = import.meta.env.VITE_API_KEY ?? 'dev-only-key-troque-em-producao'
    config.headers['X-API-Key'] = apiKey

    // JWT token para quando autenticação de usuário for implementada
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  },
)

export default api

// =============================================================================
// Cache em memória com TTL — evita requisições duplicadas ao backend
// Espelha a estratégia Caffeine do Quarkus no lado do cliente.
// =============================================================================

const _cache = new Map()

const TTL = {
  dashboard:      15 * 60 * 1000,  // 15 min — espelha backend
  totais:         30 * 60 * 1000,  // 30 min
  serieHistorica: 60 * 60 * 1000,  // 1 h
  boletimHeatmap: 60 * 60 * 1000,  // 1 h
  dimensoes:     120 * 60 * 1000,  // 2 h
}

/**
 * Retorna dados cacheados se ainda válidos pelo TTL, senão null.
 */
export function getCached(key, ttlName) {
  const entry = _cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > (TTL[ttlName] ?? TTL.totais)) {
    _cache.delete(key)
    return null
  }
  return entry.data
}

/**
 * Armazena dados no cache com timestamp atual.
 */
export function setCached(key, data) {
  _cache.set(key, { data, ts: Date.now() })
}

/**
 * Remove entradas cujo prefixo de chave bata com o padrão fornecido.
 * Útil para invalidar o cache de um tipo específico (ex: 'dashboard:').
 */
export function invalidateCache(prefix) {
  for (const key of _cache.keys()) {
    if (key.startsWith(prefix)) _cache.delete(key)
  }
}
