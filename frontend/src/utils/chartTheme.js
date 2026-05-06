/**
 * Custom ECharts theme aligned with the SISPAGAER color palette.
 * Import and register once; reference by name in chart option objects.
 *
 * Usage:
 *   import { registerPagTheme } from '@/utils/chartTheme'
 *   registerPagTheme()
 *   // Then in chart option: { ... }  (theme is auto-applied via defaults)
 */
import * as echarts from 'echarts/core'

export const PAG_CHART_COLORS = [
  '#1976D2', // blue
  '#43A047', // green
  '#FB8C00', // orange
  '#E53935', // red
  '#8E24AA', // purple
  '#00ACC1', // cyan
  '#F4511E', // deep orange
  '#6D4C41', // brown
  '#039BE5', // light blue
  '#7CB342', // light green
  '#3AB09E', // teal
  '#0000FF', // pure blue
  '#1E90FF', // dodger blue
  '#32CD32', // lime green
  '#FF4500', // orange red
  '#9ACD32', // yellow green
  '#8B0000', // dark red
  '#4B0082', // indigo
  '#00CED1', // dark turquoise
  '#F0E68C', // khaki
  '#FF1493', // deep pink
  '#DC143C', // crimson
  '#2E8B57', // sea green
  '#FF6347', // tomato
]

const pagEchartsTheme = {
  color: PAG_CHART_COLORS,
  backgroundColor: '#ffffff',
  textStyle: {
    fontFamily: 'Roboto, sans-serif',
    color: '#424242',
  },
  title: {
    textStyle: {
      color: '#212121',
      fontWeight: '500',
      fontSize: 14,
    },
    subtextStyle: {
      color: '#757575',
    },
  },
  legend: {
    textStyle: {
      color: '#424242',
    },
    pageTextStyle: {
      color: '#424242',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(13, 27, 62, 0.92)',
    borderColor: '#1976D2',
    borderWidth: 1,
    textStyle: {
      color: '#FFFFFF',
      fontSize: 13,
    },
    axisPointer: {
      lineStyle: {
        color: '#1976D2',
        width: 1,
      },
      crossStyle: {
        color: '#1976D2',
      },
    },
  },
  grid: {
    borderColor: '#E0E0E0',
  },
  categoryAxis: {
    axisLine: {
      lineStyle: { color: '#BDBDBD' },
    },
    axisTick: {
      lineStyle: { color: '#BDBDBD' },
    },
    axisLabel: {
      color: '#616161',
    },
    splitLine: {
      lineStyle: { color: '#F5F5F5' },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      lineStyle: { color: '#BDBDBD' },
    },
    axisTick: {
      lineStyle: { color: '#BDBDBD' },
    },
    axisLabel: {
      color: '#616161',
    },
    splitLine: {
      lineStyle: { color: '#F0F0F0' },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)'],
      },
    },
  },
  bar: {
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
  line: {
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 2,
    },
  },
  pie: {
    itemStyle: {
      borderRadius: 4,
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
  },
}

export function registerPagTheme() {
  echarts.registerTheme('pagTheme', pagEchartsTheme)
}

/**
 * Base chart option defaults.
 * Spread these into any chart option to get consistent grid/tooltip settings.
 */
export const baseChartOption = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
  },
  toolbox: {
    right: 10,
    feature: {
      saveAsImage: {
        title: 'Salvar imagem',
        pixelRatio: 2,
        fillstyle: '#ffffff',
      },
    },
  },
}
