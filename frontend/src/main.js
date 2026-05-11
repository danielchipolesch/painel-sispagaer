import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// ECharts global registration
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  ScatterChart,
  FunnelChart,
  RadarChart,
  HeatmapChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  ToolboxComponent,
  DatasetComponent,
  TransformComponent,
  GraphicComponent,
  CalendarComponent,
  VisualMapComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  ScatterChart,
  FunnelChart,
  RadarChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  ToolboxComponent,
  DatasetComponent,
  TransformComponent,
  GraphicComponent,
  CalendarComponent,
  VisualMapComponent,
])

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Register ECharts globally so any component can use <v-chart />
app.component('VChart', ECharts)

app.mount('#app')
