<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card>
      <v-card-title class="pa-12">
        <v-row>
          <v-col cols="11">
            <span class="headline"
              >Anotações referentes ao Atendimento - {{atendimentoId}}</span>
          </v-col>
          <v-col>
          <v-btn @click="fecharDialog()" large>
            <v-icon large>mdi-close</v-icon>
          </v-btn>
          </v-col>
          <v-col cols="12"> <span>Atendente: {{atendente}}</span></v-col>
          <v-col cols="12"> <span>Pessoa: {{pessoa}}</span></v-col>
        </v-row>
      </v-card-title>
      <v-timeline
        class="pa-10"
        :reverse="true"
        :dense="$vuetify.breakpoint.smAndDown"
      >
        <v-timeline-item
          color="blue"
          v-for="anotacao in anotacoes"
          :key="anotacao.id"
        >
          <span slot="opposite">{{ formataData(anotacao.data) }}</span>
          <v-card class="elevation-2">
            <v-card-title class="headline">
              {{ anotacao.titulo ? anotacao.titulo : "" }}
            </v-card-title>
            <v-card-text  v-html="anotacao.conteudo">
            </v-card-text>
            <v-card-actions v-for="documento in anotacao.documentos" :key="documento.id">
              <v-btn @click="downloadItem(documento.url)"><v-icon>mdi-download</v-icon></v-btn>
              <v-card-text class="subtitle-1">{{documento.nome}}</v-card-text>
            </v-card-actions>
          </v-card>
        </v-timeline-item>
      </v-timeline>

    </v-card>
  </v-dialog>
</template>

<script>
import Atendimento from '@/services/Atendimento'
export default {
  props: {
    pessoa: String,
    atendente: String,
    atendimentoId: Number
  },
  created () {
    this.carregarAnotacoes()
  },
  data: () => ({
    anotacoes: [],
    dialog: false
  }),
  methods: {
    fecharDialog () {
      this.$emit('desativarTimeline')
      this.dialog = false
    },
    carregarAnotacoes () {
      const requestBody = {
        id: this.atendimentoId,
        timeline: true
      }
      Atendimento.showAnotacoes(requestBody).then((anotacoes) => {
        this.anotacoes = anotacoes.data
        this.dialog = true
      })
    },
    formataData (data) {
      return this.$moment(data).format('DD/MM/YYYY HH:mm')
    },
    downloadItem (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style>
.v-timeline {
  margin-top: -10px;
}
</style>
