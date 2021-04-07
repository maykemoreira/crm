<template>
      <v-list>
        <v-list-item>
          <v-list-item-title class="title"> CRM </v-list-item-title>
        </v-list-item>
        <v-list-item router :to="path" v-for="([icon, text, path  ]) in items" :key="text" link>
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</template>

<script>
export default {
  name: 'Sidebar',
  created () {
    this.carregarLinks()
  },
  data: () => ({
    items: []
  }),
  methods: {
    carregarLinks () {
      const userCredentials = JSON.parse(localStorage.getItem('credentials'))
      const permissao = userCredentials && userCredentials.permissao

      if (permissao === 'administrador') {
        this.items = [
          ['mdi-account-supervisor-outline', 'Atendimentos', '/atendimentos'],
          ['mdi-clipboard-account', 'Usuários', '/usuarios'],
          ['mdi-folder-account', 'Pessoas', '/pessoas'],
          ['mdi-file-document-multiple-outline', 'Documentos', '/documentos'],
          ['mdi-format-list-numbered-rtl', 'Etapas', '/etapas']
          // ['mdi-ab-testing', 'Testes', '/testes']
        ]
      } else {
        this.items = [
          ['mdi-account-supervisor-outline', 'Atendimentos', '/atendimentos'],
          ['mdi-file-document-multiple-outline', 'Documentos', '/documentos']

        ]
      }
    }
  }
}
</script>
