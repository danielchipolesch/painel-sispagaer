import { createRouter, createWebHistory } from 'vue-router'

/**
 * Route definitions.
 *
 * Each top-level section of the payroll BI panel is a separate lazy-loaded view.
 * To add a new section:
 *   1. Create a new view file under src/views/
 *   2. Add a route entry here
 *   3. Add a navigation item in src/components/common/AppSidebar.vue
 */
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          group: 'principal',
        },
      },
      {
        path: 'folha-pagamento',
        name: 'FolhaPagamento',
        component: () => import('@/views/FolhaPagamentoView.vue'),
        meta: {
          title: 'Folha de Pagamento',
          icon: 'mdi-file-document-multiple',
          group: 'pagamento',
        },
      },
      {
        path: 'analise-posto',
        name: 'AnalisePostoGraduacao',
        component: () => import('@/views/AnalisePostoView.vue'),
        meta: {
          title: 'Análise por Posto/Graduação',
          icon: 'mdi-shield-star',
          group: 'analises',
        },
      },
      {
        path: 'analise-unidade',
        name: 'AnaliseUnidade',
        component: () => import('@/views/AnaliseUnidadeView.vue'),
        meta: {
          title: 'Análise por Unidade',
          icon: 'mdi-office-building',
          group: 'analises',
        },
      },
      {
        path: 'comparativos',
        name: 'Comparativos',
        component: () => import('@/views/ComparativosView.vue'),
        meta: {
          title: 'Comparativos',
          icon: 'mdi-chart-bar',
          group: 'analises',
        },
      },
      {
        path: 'relatorios',
        name: 'Relatorios',
        component: () => import('@/views/RelatoriosView.vue'),
        meta: {
          title: 'Relatórios',
          icon: 'mdi-file-chart',
          group: 'relatorios',
        },
      },
      {
        path: 'lancamentos-financeiros',
        name: 'LancamentosFinanceiros',
        component: () => import('@/views/LancamentosFinanceirosView.vue'),
        meta: {
          title: 'Lançamentos Financeiros',
          icon: 'mdi-finance',
          group: 'analises',
        },
      },
      {
        path: 'pttc',
        name: 'PTTC',
        component: () => import('@/views/PTTCView.vue'),
        meta: {
          title: 'PTTC',
          icon: 'mdi-chart-line',
          group: 'analises',
        },
      },
      {
        path: 'anistiados',
        name: 'Anistiados',
        component: () => import('@/views/AnistiadosView.vue'),
        meta: {
          title: 'Anistiados',
          icon: 'mdi-swap-horizontal',
          group: 'analises',
        },
      },
      {
        path: 'chamados',
        name: 'Chamados',
        component: () => import('@/views/ChamadosView.vue'),
        meta: {
          title: 'Chamados',
          icon: 'mdi-chart-timeline-variant',
          group: 'analises',
        },
      },
      {
        path: 'morte-ficta',
        name: 'Morte Ficta',
        component: () => import('@/views/MorteFictaView.vue'),
        meta: {
          title: 'Morte Ficta',
          icon: 'mdi-account',
          group: 'analises',
        },
      },
      {
        path: 'comparativo-por-categoria',
        name: 'Comparativo por Categoria',
        component: () => import('@/views/ComparativoPorCategoriaView.vue'),
        meta: {
          title: 'Comparativo por Categoria',
          icon: 'mdi-chart-pie',
          group: 'analises',
        },
      },
      {
        path: 'gratificacao-por-representacao',
        name: 'Gratificação por Representação',
        component: () => import('@/views/GratificacaoPorRepresentacaoView.vue'),
        meta: {
          title: 'Grat. Rep.',
          icon: 'mdi-account-group',
          group: 'analises',
        },
      },
      {
        path: 'despesas',
        name: 'Despesas',
        component: () => import('@/views/DespesasView.vue'),
        meta: {
          title: 'Despesas',
          icon: 'mdi mdi-currency-usd',
          group: 'rubricas',
        },
      },
      {
        path: 'militares',
        name: 'Militares x Quadro',
        component: () => import('@/views/MilitaresView.vue'),
        meta: {
          title: 'Militares x Quadro',
          icon: 'mdi-account-circle',
          group: 'ativo',
        },
      },
      {
        path: 'rceg',
        name: 'RCEG',
        component: () => import('@/views/RcegView.vue'),
        meta: {
          title: 'RCEG',
          icon: 'mdi-account-key',
          group: 'rceg',
        },
      },
      {
        path: 'boletim-publicacoes-financeiras',
        name: 'Boletim de Publicações Financeiras',
        component: () => import('@/views/BoletimPublicacoesFinanceirasView.vue'),
        meta: {
          title: 'Bol. Publ. Financeiras',
          icon: 'mdi-card-account-details',
          group: 'analises',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// Update document title on navigation
router.afterEach((to) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'SISPAGAER'
  document.title = to.meta?.title ? `${to.meta.title} | ${appTitle}` : appTitle
})

export default router
