<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ acaoExecutar }}</span>
      <v-card-text>
        <v-text-field v-model="etapaEditavel.nome" label="Nome">{{
          etapaEditavel.nome
        }}</v-text-field>
        <v-textarea
          filled
          name="input-7-4"
          v-model="etapaEditavel.descricao"
          label="Descrição"
          >{{ etapaEditavel.descricao }}</v-textarea
        >
      </v-card-text>
    </v-card-title>
    <v-card-actions>
      <v-btn
        @click="
          acaoExecutar === 'Criar Etapa'
            ? $emit('criarEtapaConfirmado', etapaEditavel)
            : $emit('editarEtapaConfirmado', etapaEditavel)
        "
        >Salvar</v-btn
      >
      <v-btn @click="$emit('fecharDialog')">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    acaoExecutar: String,
    etapaInformada: Object
  },
  created () {
    this.associarEtapa()
  },
  data: () => ({
    etapaEditavel: {}
  }),
  methods: {
    associarEtapa () {
      this.etapaEditavel = { ...this.etapaInformada }
    }
  }
}
</script>

<style>
</style>
