import Documentos from '@/views/Documentos.vue'
import Atendimentos from '@/views/Atendimentos.vue'
import Pessoas from '@/views/Pessoas.vue'
import Usuarios from '@/views/Usuarios.vue'
import Etapas from '@/views/Etapas.vue'
import Testes from '@/views/Testes.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/components/forms/FormularioLogin.vue'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      redirect: '/atendimentos',
      children: [
        {
          path: '/atendimentos',
          name: 'atendimentos',
          component: Atendimentos

        },
        {
          path: '/usuarios',
          name: 'usuarios',
          component: Usuarios
        },
        {
          path: '/documentos',
          name: 'documentos',
          component: Documentos
        },
        {
          path: '/pessoas',
          name: 'pessoas',
          component: Pessoas
        },
        {
          path: '/etapas',
          name: 'etapas',
          component: Etapas
        },
        {
          path: '/testes',
          name: 'testes',
          component: Testes
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      redirect: '/login'
    }

  ]
})

router.beforeEach((to, from, next) => {
  const credentialsJSON = JSON.parse(localStorage.getItem('credentials'))
  const credentialsExists = credentialsJSON && credentialsJSON.token && credentialsJSON.permissao
  if (!credentialsExists && to.path !== '/login') { next('/login') } else next()
})

export default router
