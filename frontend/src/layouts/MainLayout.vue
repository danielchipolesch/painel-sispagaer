<template>
    <v-layout class="fill-height">
        <!-- Left sidebar navigation -->
        <AppSidebar />

        <!-- Top application bar -->
        <AppHeader />

        <!-- Main content area -->
        <v-main class="main-content">
            <!-- Global loading overlay -->
            <v-overlay :model-value="appStore.isLoading" class="align-center justify-center" persistent z-index="9999">
                <v-progress-circular indeterminate color="primary" size="56" width="5" />
            </v-overlay>

            <!-- Route view with transition -->
            <v-container fluid class="pa-4 pa-md-6 pb-12">
                <router-view v-slot="{ Component }">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </v-container>

            <!-- Fixed footer -->
            <footer class="app-footer">
                <span class="app-footer__brand">© {{ displayDate }} SISPAGAER</span>
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <!-- <span class="app-footer__system">Business Intelligence</span> -->
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <span class="app-footer__version">v{{ appVersion }}</span>
            </footer>
        </v-main>

        <!-- Notification snackbars -->
        <AppNotifications />
    </v-layout>
</template>

<script setup>
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppNotifications from '@/components/common/AppNotifications.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const startYear = 2026;
const currentYear = new Date().getFullYear()
const displayDate = (currentYear > startYear) ? `${startYear} - ${currentYear}` : startYear
const appVersion = import.meta.env.VITE_APP_VERSION ?? '0.0.1'
</script>

<style scoped>
.main-content {
    background-color: #ECEFF4;
    min-height: 100vh;
    /* Espaço para o rodapé fixo não sobrepor o conteúdo */
    padding-bottom: 36px !important;
}

/* ── Rodapé fixo ──────────────────────────────────────────────────────────── */
/* #C8C8C8 — cinza neutro puro, sem qualquer traço de azul.
   Fica visualmente distinto do fundo #ECEFF4 (cinza muito claro com toque azulado)
   e das cards #FFFFFF, sem competir com a sidebar navy #0D1B3E. */
.app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background-color: #C8C8C8;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 100;
    border-top: 1px solid #B2B2B2;
}

.app-footer__brand {
    font-size: 0.7rem;
    font-weight: 700;
    color: #3A3A3A;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.app-footer__system {
    font-size: 0.7rem;
    color: #525252;
}

.app-footer__version {
    font-size: 0.65rem;
    color: #6B6B6B;
    font-family: monospace;
}

.app-footer__sep {
    color: #AAAAAA;
    font-size: 0.7rem;
    user-select: none;
}

/* Page transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
