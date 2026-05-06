<template>
  <div>
    <div class="mb-5">
      <h1 class="text-h6 font-weight-bold">Relatórios</h1>
      <p class="text-caption text-medium-emphasis mb-0">
        Geração e exportação de relatórios da folha
      </p>
    </div>

    <v-row>
      <v-col
        v-for="report in reportTypes"
        :key="report.id"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <v-card
          class="report-card"
          :ripple="true"
          @click="openReport(report)"
        >
          <!-- Área de conteúdo cresce para preencher o card -->
          <v-card-text class="pa-5 report-card-body">
            <div class="d-flex align-start gap-4">
              <div
                class="report-icon-badge d-flex align-center justify-center flex-shrink-0"
                :style="{ background: `${report.color}18` }"
              >
                <v-icon :icon="report.icon" :color="report.color" size="32" />
              </div>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-1">{{ report.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ report.description }}</div>
              </div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-3">
            <v-chip size="x-small" :color="report.color" variant="tonal" class="mr-2">
              {{ report.format }}
            </v-chip>
            <v-spacer />
            <v-btn
              size="small"
              variant="text"
              :color="report.color"
              append-icon="mdi-download"
              @click.stop="downloadReport(report)"
            >
              Exportar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Report preview dialog -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card v-if="selectedReport">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="selectedReport.icon" :color="selectedReport.color" />
            {{ selectedReport.title }}
          </div>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <PeriodFilter
            v-model:year="reportYear"
            v-model:month="reportMonth"
            class="mb-4"
            @search="generateReport"
          />

          <v-alert
            type="info"
            variant="tonal"
            icon="mdi-information"
            class="mt-2"
          >
            Configure o período acima e clique em <strong>Pesquisar</strong>
            para gerar o relatório. A exportação ficará disponível após a geração.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn
            :color="selectedReport.color"
            variant="flat"
            prepend-icon="mdi-file-export"
            @click="downloadReport(selectedReport)"
          >
            Exportar {{ selectedReport.format }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store/app'
import PeriodFilter from '@/components/filters/PeriodFilter.vue'

const appStore = useAppStore()

const dialog = ref(false)
const selectedReport = ref(null)
const reportYear = ref(new Date().getFullYear())
const reportMonth = ref(new Date().getMonth() + 1)

const reportTypes = [
  {
    id: 'resumo-mensal',
    title: 'Resumo Mensal da Folha',
    description: 'Totais gerais de bruto, descontos e líquido por competência.',
    icon: 'mdi-file-document-outline',
    color: '#1976D2',
    format: 'PDF',
  },
  {
    id: 'detalhe-posto',
    title: 'Detalhamento por Posto',
    description: 'Folha discriminada por posto e graduação, com efetivo e médias.',
    icon: 'mdi-shield-star-outline',
    color: '#43A047',
    format: 'XLSX',
  },
  {
    id: 'detalhe-unidade',
    title: 'Detalhamento por Unidade',
    description: 'Folha discriminada por organização militar.',
    icon: 'mdi-office-building-outline',
    color: '#FB8C00',
    format: 'XLSX',
  },
  {
    id: 'evolucao-anual',
    title: 'Evolução Anual',
    description: 'Comparativo mês a mês de todos os totais do ano selecionado.',
    icon: 'mdi-chart-line',
    color: '#8E24AA',
    format: 'PDF',
  },
  {
    id: 'comparativo',
    title: 'Relatório Comparativo',
    description: 'Diferenças entre dois anos-base para análise de variação.',
    icon: 'mdi-chart-bar',
    color: '#E53935',
    format: 'PDF',
  },
  {
    id: 'categorias',
    title: 'Composição por Categoria',
    description: 'Detalhamento de vencimentos, gratificações e adicionais.',
    icon: 'mdi-tag-multiple-outline',
    color: '#00ACC1',
    format: 'XLSX',
  },
]

function openReport(report) {
  selectedReport.value = report
  dialog.value = true
}

function generateReport({ year, month }) {
  reportYear.value = year
  reportMonth.value = month
  appStore.notify({ message: 'Relatório gerado com sucesso!', type: 'success' })
}

function downloadReport(report) {
  // TODO: call the backend export endpoint when available
  appStore.notify({
    message: `Download do relatório "${report.title}" será implementado com o backend.`,
    type: 'info',
  })
}
</script>

<style scoped>
.report-card {
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
  /* Ocupa 100% da altura do v-col (que usa d-flex) para todos os cards
     da linha ficarem com a mesma altura */
  display: flex;
  flex-direction: column;
  width: 100%;
}

.report-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

/* Área de texto cresce, empurrando o rodapé de ações para baixo */
.report-card-body {
  flex: 1;
}

.report-icon-badge {
  width: 56px;
  height: 56px;
  border-radius: 14px;
}
</style>
