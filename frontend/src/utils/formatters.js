import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

/**
 * Format a numeric value as Brazilian currency (R$).
 * @param {number} value
 * @param {object} options - Intl.NumberFormat options overrides
 * @returns {string}
 */
export function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    ...options,
  }).format(value ?? 0)
}

/**
 * Format a number with thousand separators (no currency symbol).
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value ?? 0)
}

/**
 * Format a decimal ratio as percentage string.
 * @param {number} value  e.g. 0.1234
 * @param {number} decimals
 * @returns {string}  e.g. "12,34%"
 */
export function formatPercent(value, decimals = 2) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value ?? 0)
}

/**
 * Format a date using dayjs.
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
  return dayjs(date).format(format)
}

/**
 * Returns a short month label (e.g. "Jan", "Fev").
 * @param {number} month  1–12
 * @returns {string}
 */
export function shortMonth(month) {
  return dayjs().month(month - 1).format('MMM')
}

/**
 * Returns a full month label in pt-BR (e.g. "Janeiro").
 * @param {number} month  1–12
 * @returns {string}
 */
export function fullMonth(month) {
  return dayjs().month(month - 1).format('MMMM')
}

/**
 * Abbreviates a large number with K/M/B suffix.
 * @param {number} value
 * @returns {string}
 */
export function abbreviateNumber(value) {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, 1)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${formatNumber(value / 1_000_000, 1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${formatNumber(value / 1_000, 1)}K`
  }
  return formatCurrency(value)
}

/**
 * Abbreviates a large number with K/M/B suffix without currency symbol.
 * @param {number} value
 * @returns {string}
 */
export function abbreviateNumberSimple(value) {
  const format = (num) => num.toFixed(3).replace(',', '.')

  const abs = Math.abs(value)

  if (abs >= 1_000_000_000) {
    return `${format(value / 1_000_000_000)}`
  }
  if (abs >= 1_000_000) {
    return `${format(value / 1_000_000)}`
  }
  if (abs >= 1_000) {
    return `${format(value / 1_000)}`
  }

  return value.toString()
}

/**
 * Generates an array of month-year labels from January 2025 to the current month.
 * @returns {string[]}
 */
export function gerarMeses() {
  const inicio = new Date(2025, 0); // janeiro = 0
  const hoje = new Date();

  const resultado = [];

  let data = new Date(inicio);

  while (data <= hoje) {
    const mes = data
      .toLocaleString('pt-BR', { month: 'short' })
      .replace('.', '')
      .toUpperCase();

    const ano = data.getFullYear();

    resultado.push(`${mes}-${ano}`);

    // avança 1 mês
    data.setMonth(data.getMonth() + 1);
  }
  return resultado;
}

/**
 * Generates an array of years from the given start year to the current year.
 * @returns {string[]}
 */
export function gerarAnos(inicio = 2013, fim = new Date().getFullYear()) {
  const anos = [];

  for (let ano = inicio; ano <= fim; ano++) {
    anos.push(ano);
  }

  return anos;
}

/**
 * Generates fake comparative series data for the given months and years.
 * @param {string[]} meses - Array of month-year labels (e.g. ["JAN-2025", "FEV-2025"])
 * @param {number} anoA - First year for comparison (e.g. 2024)
 * @param {number} anoB - Second year for comparison (e.g. 2025)
 * @returns {object[]} Array of objects with structure: { label: "JAN-2025", [anoA]: value, [anoB]: value }
 */
export function gerarSeriesFake(meses, anoA, anoB) {
    
  if (!Array.isArray(meses)) return [];
  
    return meses.map((mes) => ({
    label: mes,
    [anoA]: Math.floor(Math.random() * (140000 - 15000) + 15000),
    [anoB]: Math.floor(Math.random() * (140000 - 15000) + 15000),
  }));
}

/**
 * Calculates the average value for a given year across all data points in seriesData.
 * @param {number} ano - The year for which to calculate the average (e.g. 2024)
 * @returns {number} The average value for the specified year, rounded to the nearest integer.
 */
export function calcularMediaPorAno(seriesData, ano) {
  const valores = seriesData.map((d) => Number(d?.[ano]) || 0);

  const soma = valores.reduce((acc, v) => acc + v, 0);
  return valores.length ? Math.round(soma / valores.length) : 0;
}

/**
 * Fills in missing years in the series data by calculating the average for existing years or generating fake data if no data exists for that year.
 * @param {object[]} seriesData - Array of data points, each containing year-value pairs (e.g. [{ "2024": 10000, "2025": 15000 }, ...])
 * @param {number[]} anos - Array of years to ensure are present in the output (e.g. [2024, 2025, 2026])
 * @returns {number[]} An array of values corresponding to the input years, with missing years filled in.
 */
export function preencherAnosFaltantes(seriesData, anos, offset = 0) {

  if (!Array.isArray(seriesData)) return [];

  return anos.map((ano) => {
    const existe = seriesData.some((d) => d?.[ano] !== undefined);

    if (existe) {
      return calcularMediaPorAno(seriesData, ano) + offset;
    }

    // gera fake
    return gerarValorFake() + offset;
  });
}

/**
 * Generates a fake value around a base number, with a random offset of ±5000.
 */
export function gerarValorFake(base = 45000) {
  return Math.floor(base + (Math.random() * 10000 - 5000));
}

/**
 * Generates an array of month-year labels from January 2025 to the current month, formatted as "MMM-YYYY" (e.g. "JAN-2025").
 * @returns {string[]}
 */
export function gerarMesFolha() {
  const inicio = new Date(2026, 0); // janeiro = 0
  const hoje = new Date();

  const resultado = [];

  let data = new Date(inicio);

  while (data <= hoje) {
    const mes = data
      .toLocaleString('pt-BR', { month: 'short' })
      .replace('.', '')
      .toUpperCase();

    const ano = data.getFullYear();

    resultado.push(`FOLHA ${mes}`);

    // avança 1 mês
    data.setMonth(data.getMonth() + 1);
  }
  return resultado;
}

/**
  * Generates an array of random integers between min and max (inclusive).
  * @param {number} tamanho - The length of the array to generate. 
  * @param {number} min - The minimum integer value (inclusive).
  * @param {number} max - The maximum integer value (inclusive).
  * @returns {number[]} An array of random integers between min and max.
 */
export function gerarArrayAleatorio(tamanho, min, max) {
  return Array.from({ length: tamanho }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

/**
  * Returns a color code based on the input value.
  * - Values below 50 return red (#ff4d4f).
  * - Values between 50 and 80 return yellow (#faad14).
  * - Values above 80 return green (#52c41a).
  * @param {number} value - The input value to evaluate.
  * @returns {string} A hex color code corresponding to the input value.
 */
export function getColor(value) {
  if (value < 50) return '#ff4d4f'   // vermelho
  if (value < 75) return '#faad14'   // amarelo
  if (value < 95) return '#52c41a'   // verde
  return '#1ab0c4'                   // azul
}