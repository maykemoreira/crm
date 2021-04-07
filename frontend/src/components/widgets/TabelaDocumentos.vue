<template>
  <div>
    <v-data-table
      class="mt-4"
      :headers="header"
      :items="dados"
      :search="buscar"
      loading-text="Carregando, por favor aguarde."
      :footer-props="{
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos',
      }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col class="d-flex" cols="3" sm="2">
                <v-toolbar-title>{{ nomeTabela }}</v-toolbar-title>
              </v-col>

              <v-col class="d-flex" cols="7" sm="7">
                <v-text-field
                  v-model="buscar"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon medium class="mr-2" @click="fazerDownload(item)"
          >mdi-download</v-icon
        >
      </template>

      <template slot="no-data"> Não há dados para visualizar </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    header: Array,
    dados: Array,
    nomeTabela: String
  },
  data: () => ({
    carregando: false,
    buscar: ''
  }),
  methods: {
    fazerDownload (item) {
      window.open(item.url, '_blank')
    }
  }
}
</script>

<style>
</style>
