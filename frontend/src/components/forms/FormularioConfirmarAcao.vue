<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{titulo}}</span>
      <v-card-text> {{fraseConfirmacao}} {{objetoIdentificacao}}? </v-card-text>
    </v-card-title>
    <v-card-actions>
      <v-btn @click='$emit("acaoConfirmada")'>Confirmar</v-btn>
      <v-btn @click='$emit("fecharDialog")'>Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    objetoIdentificacao: String,
    titulo: String,
    fraseConfirmacao: String
  }
}
</script>

<style>
</style>
