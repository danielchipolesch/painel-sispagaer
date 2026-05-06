<template>
  <v-card color="white" elevation="2" class="filter-card px-4 py-3">
    <div class="d-flex flex-wrap align-center">
      <!-- Label -->
      <div class="filter-label mx-3">
        <v-icon icon="mdi-filter-outline" size="15" class="mr-1" />
        Filtros
      </div>

      <!-- Divider vertical -->
      <v-divider vertical class="filter-divider mx-2" />

      <!-- Ano -->
      <v-select
        v-model="localYear"
        :items="years"
        label="Ano"
        density="compact"
        hide-details
        class="filter-field mx-3"
        @update:model-value="emitChange"
      />

      <!-- Mês -->
      <v-select
        v-if="showMonth"
        v-model="localMonth"
        :items="months"
        item-title="label"
        item-value="value"
        label="Mês"
        density="compact"
        hide-details
        clearable
        class="filter-field filter-field--month mx-3"
        @update:model-value="emitChange"
      />

      <!-- Slot para filtros extras -->
      <slot name="extra-filters" />

      <v-spacer />

      <!-- Ações -->
      <div class="d-flex align-center mx-2">
        <v-btn
          icon="mdi-refresh"
          variant="text"
          density="comfortable"
          color="medium-emphasis"
          title="Limpar filtros"
          class="mr-1"
          @click="reset"
        />
        <v-btn
          prepend-icon="mdi-magnify"
          color="primary"
          variant="flat"
          density="comfortable"
          @click="$emit('search', { year: localYear, month: localMonth })"
        >
          Pesquisar
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { fullMonth } from '@/utils/formatters'

const props = defineProps({
  year: { type: Number, default: () => new Date().getFullYear() },
  month: { type: Number, default: null },
  showMonth: { type: Boolean, default: true },
})

const emit = defineEmits(['update:year', 'update:month', 'change', 'search'])

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i)

const months = Array.from({ length: 12 }, (_, i) => ({
  label: fullMonth(i + 1).charAt(0).toUpperCase() + fullMonth(i + 1).slice(1),
  value: i + 1,
}))

const localYear = ref(props.year)
const localMonth = ref(props.month)

watch(() => props.year, (v) => (localYear.value = v))
watch(() => props.month, (v) => (localMonth.value = v))

function emitChange() {
  emit('update:year', localYear.value)
  emit('update:month', localMonth.value)
  emit('change', { year: localYear.value, month: localMonth.value })
}

function reset() {
  localYear.value = currentYear
  localMonth.value = null
  emitChange()
}
</script>

<style scoped>
.filter-card {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #757575;
  white-space: nowrap;
}

.filter-divider {
  height: 28px;
  align-self: center;
}

/* max-width (não fixa) mantém os campos compactos sem forçar largura */
.filter-field {
  max-width: 110px;
  flex-shrink: 0;
}

.filter-field--month {
  max-width: 140px;
}
</style>
