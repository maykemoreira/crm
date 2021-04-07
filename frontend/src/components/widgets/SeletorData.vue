<template>
  <div>
    <v-dialog width="400" v-model="dialogDate" persistent>
      <v-card>
        <v-tabs v-model="tabelaSelecionada" centered>
          <v-tab>Data</v-tab>
          <v-tab>Hora</v-tab>
        </v-tabs>
        <v-date-picker
          v-if="tabelaSelecionada === 0"
          color="blue"
          full-width
          locale="pt-br"
          v-model="dataPicker"
        ></v-date-picker>
        <v-time-picker
          v-model="horarioPicker"
          color="blue"
          full-width
          v-if="tabelaSelecionada === 1"
          format="24hr"
        ></v-time-picker>
        <v-card-actions>
          <v-btn @click="salvarDataHora"> Salvar</v-btn>
          <v-btn @click="$emit('fecharDialog')"> Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.iniciarData()
  },
  props: {
    dataInformada: String
  },
  data: () => ({
    dialogDate: false,
    tabelaSelecionada: null,
    dataPicker: null,
    horarioPicker: null
  }),
  methods: {
    iniciarData () {
      this.dataPicker = new Date(this.dataInformada).toISOString().slice(0, 10)
      this.horarioPicker = `${new Date(this.dataInformada).getHours()}:${new Date().getMinutes()}`
      this.dialogDate = true
    },
    salvarDataHora () {
      let [ano, mes, dia] = this.dataPicker.split('-')
      mes = parseInt(mes) - 2
      const [hora, minuto] = this.horarioPicker.split(':')
      const data = new Date(ano, mes, dia, hora, minuto).toISOString()
      this.$emit('dataSalva', data)
    }
  }
}
</script>

<style>
</style>
