<template>
  <div>
    <v-app>
      <v-navigation-drawer v-model="drawer" app>
        <Sidebar />
      </v-navigation-drawer>
      <v-app-bar app color="blue">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn @click="logout"><v-icon class="mr-3">mdi-exit-to-app</v-icon>Sair</v-btn>
      </v-app-bar>
      <v-main>
        <v-container> <router-view></router-view> </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Sidebar from '@/components/template/Sidebar.vue'
export default {
  name: 'App',

  components: {
    Sidebar
  },

  data: () => ({
    drawer: true,
    loginFeito: false
  }),
  methods: {
    logout () {
      localStorage.clear('credentials')
      this.$router.push('/login')
    }
  }
}
</script>
