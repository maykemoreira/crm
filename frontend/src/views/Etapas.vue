<template>
  <div>
    <br />
    <Tabela
      :dados="etapas"
      :header="cabecalho"
      nomeTabela="Etapas"
      @eventoCriar="abrirDialogCriar"
      @eventoEditar="abrirDialogEditar"
      @eventoExcluir="abrirDialogExcluir"
      @eventoReativar="abrirDialogReativar"
      @statusDosItensMudaram="obterEtapasPorStatus"
      :opcaoParaBuscaDesabilitar="true"
    />

    <v-dialog width="700" v-model="dialogEditarCriar" persistent>
      <FormularioEtapa
        v-if="dialogEditarCriar === true"
        @editarEtapaConfirmado="editarEtapa"
        @criarEtapaConfirmado="criarEtapa"
        @fecharDialog="fecharDialogs"
        :acaoExecutar="acaoEtapa"
        :etapaInformada="etapa"
      />
    </v-dialog>

    <v-dialog width="500" v-model="dialogDesativar" persistent>
      <FormularioConfirmarAcao
        v-if="dialogDesativar === true"
        :objetoIdentificacao="etapa.nome"
        :titulo="`${acaoEtapa}`"
        :fraseConfirmacao="`Deseja ${acaoEtapa} a etapa `"
        @acaoConfirmada="acaoEtapa=== 'Desativar Etapa' ? desativarEtapa() : reativarEtapa()"
        @fecharDialog="fecharDialogs"
      />
    </v-dialog>
  </div>
</template>

<script>
import Etapa from '@/services/Etapa'
import headersTabela from '@/constants/headers'
import Tabela from '@/components/widgets/Tabela'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import FormularioEtapa from '@/components/forms/FormularioEtapa'

export default {
  components: {
    Tabela,
    FormularioConfirmarAcao,
    FormularioEtapa
  },
  created () {
    this.obterEtapas()
  },
  data: () => ({
    etapas: [],
    cabecalho: [],
    acaoEtapa: '',
    etapa: {},
    dialogEditarCriar: false,
    dialogDesativar: false,
    campos: []
  }),
  methods: {
    obterEtapas () {
      this.carregando = true
      Etapa.search({ deleted: false })
        .then((etapas) => {
          this.etapas = etapas.data.map((etapa) => ({
            nome: etapa.nome,
            id: etapa.id,
            descricao: etapa.descricao
          }))
          this.cabecalho = headersTabela.etapas
        })
        .finally(() => {
          this.carregando = false
        })
    },
    limparEtapa () {
      this.etapa = {
        nome: '',
        ativa: '',
        id: '',
        descricao: ''
      }
    },
    abrirDialogCriar () {
      this.dialogEditarCriar = true
      this.acaoEtapa = 'Criar Etapa'
    },
    abrirDialogExcluir (item) {
      this.etapa = item
      this.acaoEtapa = 'Desativar Etapa'
      this.dialogDesativar = true
    },
    abrirDialogReativar (item) {
      this.etapa = item
      this.acaoEtapa = 'Reativar Etapa'
      this.dialogDesativar = true
    },
    abrirDialogEditar (item) {
      this.acaoEtapa = 'Editar Etapa'
      this.etapa = item
      this.dialogEditarCriar = true
    },
    criarEtapa (etapaRecebida) {
      Etapa.store(etapaRecebida)
        .then(() => this.obterEtapas())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    editarEtapa (etapaRecebida) {
      Etapa.update(etapaRecebida)
        .then(() => this.obterEtapas())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    desativarEtapa () {
      Etapa.destroy(this.etapa)
        .then(() => this.obterEtapas())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    reativarEtapa () {
      Etapa.recovery(this.etapa)
        .then(() => this.obterEtapasPorStatus(false))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    fecharDialogs () {
      this.dialogEditarCriar = false
      this.dialogDesativar = false
      this.acaoEtapa = ''
      this.limparEtapa()
    },
    obterEtapasPorStatus (status) {
      Etapa.search({ deleted: !status })
        .then((etapas) => {
          this.etapas = etapas.data.map((etapa) => ({
            nome: etapa.nome,
            id: etapa.id,
            descricao: etapa.descricao
          }))
          this.cabecalho = headersTabela.etapas
        })
        .finally(() => {
          this.carregando = false
        })
    }
  }
}
</script>

<style></style>
