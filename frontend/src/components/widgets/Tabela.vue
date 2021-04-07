<template>
  <div>
    <v-data-table
      :headers="header"
      :items="dados"
      :search="buscar"
      loading-text="Carregando, por favor aguarde."
      :footer-props="{
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos'
      }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col class="d-flex" cols="3" sm="2">
                <v-toolbar-title>{{ nomeTabela }}</v-toolbar-title>
              </v-col>
              <v-col v-if="opcoesHeader" class="d-flex" cols="4" sm="4">
                <v-text-field
                  v-model="buscar"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col v-else class="d-flex" cols="7" sm="7">
                <v-text-field
                  v-model="buscar"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col v-if="opcoesHeader" class="d-flex" cols="3" sm="3">
                <v-select
                  class="mr-12"
                  :items="opcoesHeader"
                  v-model="opcaoEscolhida"
                  :label="labelOpcoesHeader"
                >
                </v-select>
              </v-col>
              <v-col class="d-flex" cols="1" sm="1">
                <v-switch
                  class="mr-16"
                  v-if="opcaoParaBuscaDesabilitar === true"
                  v-model="ativo"
                  color="blue"
                  label="Ativos"
                ></v-switch>
              </v-col>
              <v-spacer></v-spacer>

              <v-col class="d-flex" cols="4" sm="1">
                <v-spacer></v-spacer>
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  outlined
                  color="indigo"
                  @click="dadosCriar()"
                >
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container></v-toolbar
        >
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          v-if="ativo === true"
          medium
          class="mr-2"
          @click="dadosEditar(item)"
        >
          mdi-pencil</v-icon
        >
        <v-icon
          v-if="anotacoesOpcao === true"
          medium
          @click="anotacoesItem(item)"
          >mdi-notebook-edit-outline</v-icon
        >

        <v-icon v-if="ativo === true" medium @click="dadosExcluir(item)">
          mdi-close-circle
        </v-icon>
        <v-icon v-if="ativo === false" medium @click="dadosReativar(item)">
          mdi-restore</v-icon
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
    nomeTabela: String,
    opcoesHeader: Array,
    labelOpcoesHeader: String,
    opcaoParaBuscaDesabilitar: Boolean,
    anotacoesOpcao: Boolean
  },
  data: () => ({
    carregando: false,
    acao: null,
    opcaoEscolhida: 'Física',
    buscar: '',
    selecionado: null,
    ativo: true
  }),
  watch: {
    opcaoEscolhida (opcaoNova) {
      const tipoPessoa = opcaoNova === 'Física' ? 'fisica' : 'juridica'
      this.ativo = true
      this.$emit('tipoDePessoaAlterado', tipoPessoa)
    },
    ativo (opcaoNova) {
      this.$emit('statusDosItensMudaram', opcaoNova)
    }
  },
  methods: {
    dadosCriar () {
      this.$emit('eventoCriar')
    },
    dadosEditar (item) {
      const itemEvento = { ...item }
      this.$emit('eventoEditar', itemEvento)
    },
    dadosExcluir (item) {
      const itemEvento = { ...item }
      this.$emit('eventoExcluir', itemEvento)
    },
    dadosReativar (item) {
      const itemEvento = { ...item }
      this.$emit('eventoReativar', itemEvento)
    }
  }
}
</script>

<style>
</style>
