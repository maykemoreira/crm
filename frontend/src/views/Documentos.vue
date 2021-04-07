<template>
  <div>
    <TabelaDocumentos
    :header="cabecalho"
    :dados="documentos"
    nomeTabela="Documentos"
    />
  </div>
</template>

<script>
import TabelaDocumentos from '@/components/widgets/TabelaDocumentos.vue'
import Atendimento from '@/services/Atendimento'
import headersTabela from '@/constants/headers'
import credenciaisUsuario from '@/mixins'

export default {
  mixins: [credenciaisUsuario],
  created () {
    this.cabecalho = this.credenciaisUsuario.permissao !== 'administrador' ? headersTabela.documentos
      : headersTabela.documentosAdmin
    this.obterDocumentos()
  },
  components: {
    TabelaDocumentos
  },
  data: () => ({
    cabecalho: [],
    documentos: []
  }),
  methods: {
    obterDocumentos () {
      Atendimento.showAtendimentoDocumentos().then(documentos => {
        this.documentos = documentos.data.map(documento => {
          documento.dataEnvio = this.$moment(documento.dataEnvio).format('DD/MM/YYYY HH:mm:ss')
          return {
            ...documento
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
