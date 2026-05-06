<template>
    <v-navigation-drawer v-model="appStore.sidebarOpen" :rail="appStore.sidebarRail" permanent color="primary"
        width="260">

        <!-- ── Cabeçalho do sidebar ─────────────────────────────────────────── -->
        <!-- Expandido: logo + nome + subtítulo | Retraído: só a logo centralizada -->
        <div class="sidebar-header" :class="{ 'sidebar-header--rail': appStore.sidebarRail }">

            <!-- Logo: sempre visível -->
            <v-avatar size="36" class="sidebar-brand__avatar">
                <v-img :src="brasaoUrl" alt="Logo SISPAGAER" />
            </v-avatar>

            <!-- Texto: apenas quando expandido -->
            <transition name="brand-fade">
                <div v-if="!appStore.sidebarRail" class="sidebar-brand__text">
                    <div class="sidebar-brand__title">SISPAGAER</div>
                    <div class="sidebar-brand__subtitle">Business Intelligence</div>
                </div>
            </transition>

        </div>

        <v-divider color="rgba(255,255,255,0.15)" />

        <!-- Navigation items -->
        <v-list density="compact" nav class="mt-2">
            <!-- Principal group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Principal
            </v-list-subheader>

            <v-list-item v-for="item in principalItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Análises group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Análises
            </v-list-subheader>

            <v-list-item v-for="item in analiseItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Rúbricas group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Rúbricas
            </v-list-subheader>

            <v-list-item v-for="item in rubricaItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Ativo group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Ativo
            </v-list-subheader>

            <v-list-item v-for="item in ativoItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Rceg group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Rceg
            </v-list-subheader>

            <v-list-item v-for="item in rcegItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Diárias group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Diárias
            </v-list-subheader>

            <v-list-item v-for="item in diariasItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />

            <v-divider color="rgba(255,255,255,0.1)" class="my-2" />

            <!-- Relatórios group -->
            <v-list-subheader v-if="!appStore.sidebarRail" class="nav-subheader">
                Relatórios
            </v-list-subheader>

            <v-list-item v-for="item in relatorioItems" :key="item.name" :prepend-icon="item.meta.icon"
                :title="item.meta.title" :to="item.path" active-class="nav-item--active" color="white" rounded="lg"
                class="nav-item mb-1" />
        </v-list>

    </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const router = useRouter()

const brasaoUrl = '/LogoSISPAGAERreduzido.png'

const allRoutes = computed(() =>
    router.getRoutes().filter((r) => r.meta?.group)
)

const principalItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'principal' || r.meta.group === 'pagamento')
)

const analiseItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'analises')
)

const rubricaItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'rubricas')
)

const ativoItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'ativo')
)

const rcegItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'rceg')
)

const diariasItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'diarias')
)

const relatorioItems = computed(() =>
    allRoutes.value.filter((r) => r.meta.group === 'relatorios')
)
</script>

<style scoped>
/* ── Cabeçalho do sidebar ────────────────────────────────────────────────── */
.sidebar-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.05);
    min-height: 60px;
    overflow: hidden;
}

/* Retraído: centraliza a logo */
.sidebar-header--rail {
    justify-content: center;
    padding: 12px 0;
}

/* ── Brand ───────────────────────────────────────────────────────────────── */
.sidebar-brand__avatar {
    flex-shrink: 0;
}

.sidebar-brand__text {
    overflow: hidden;
}

.sidebar-brand__title {
    color: #FFFFFF;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.sidebar-brand__subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.7rem;
    white-space: nowrap;
}

/* Transição suave ao expandir/recolher o brand */
.brand-fade-enter-active,
.brand-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.brand-fade-enter-from,
.brand-fade-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

/* ── Itens de navegação ──────────────────────────────────────────────────── */
.nav-subheader {
    color: rgba(255, 255, 255, 0.45) !important;
    font-size: 0.65rem !important;
    font-weight: 700 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    padding-left: 16px !important;
}

.nav-item {
    color: rgba(255, 255, 255, 0.75) !important;
    transition: background 0.2s;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #FFFFFF !important;
}

.nav-item--active {
    background: rgba(25, 118, 210, 0.5) !important;
    color: #FFFFFF !important;
}

.nav-item--active :deep(.v-icon) {
    color: #FFFFFF !important;
}

.nav-item :deep(.v-list-item-title) {
    font-size: 0.875rem;
}
</style>
