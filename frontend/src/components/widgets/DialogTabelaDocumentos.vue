<template>
  <div>
    <v-dialog v-model="dialogTabela" width="500" persistent scrollable>
      <v-data-table
        :loading="carregando"
        :loading-text="mensagem"
        :headers="headersDownload"
        :items="documentos"
        item-key="id"
        sort-by="nome"
        :footer-props="{
          'items-per-page-options': documentos.length < 5 ? [5] : [5, 10],
          itemsPerPageText: 'Itens por página',
          itemsPerPageAllText: 'Todos',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-container>
                <v-row>
                  <v-col> Documentos </v-col>
                  <v-col>
                    <v-btn @click="fileUploadDialog">
                      <v-icon>mdi-cloud-upload</v-icon>
                      <v-file-input
                        id="file-input"
                        v-model="file"
                        accept="*"
                        label="File input"
                        style="display: none"
                      />
                    </v-btn>
                  </v-col>
                  <v-spacer></v-spacer>

                  <v-col class="ml-16"
                    ><v-icon
                      @click="fecharDialogDownloads"
                      large
                      id="close-button"
                      >mdi-close</v-icon
                    ></v-col
                  >
                </v-row>
              </v-container>
            </v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon medium class="mr-2" @click.stop.prevent="downloadItem(item)">
            mdi-download
          </v-icon>

          <v-icon medium @click="abrirDialogExcluir(item)"> mdi-delete </v-icon>
        </template>
        <template slot="no-data"> Não há documentos para visualizar </template>
      </v-data-table>
    </v-dialog>

    <v-dialog v-model="dialogExcluir" width="400px">
      <FormularioConfirmarAcao
        v-if="dialogExcluir"
        titulo="Excluir Arquivo"
        fraseConfirmacao="Desejar excluir o arquivo"
        :objetoIdentificacao="itemSelecionado.nome"
        @acaoConfirmada="excluirArquivo"
        @fecharDialog="fecharDialogExcluir"
      />
    </v-dialog>
  </div>
</template>

<script>
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao.vue'
import Documento from '@/services/Documento'
import axios from 'axios'
export default {
  props: {
    anotacao: Object
  },
  components: {
    FormularioConfirmarAcao
  },

  created () {
    this.carregarDocumentos()
  },
  data: () => ({
    dialogTabela: false,
    carregando: false,
    mensagem: '',
    headersDownload: [
      {
        text: 'Nome do arquivo',
        align: 'start',
        sortable: true,
        value: 'nome'
      },
      {
        text: 'Ações',
        align: 'center',
        value: 'actions',
        sortable: false
      }
    ],
    documentos: [],
    file: null,
    dialogExcluir: false,
    itemSelecionado: null
  }),
  watch: {
    file () {
      if (this.file !== null) {
        this.uploadDocumento(this.file)
      }
    }
  },
  methods: {
    async uploadDocumento (file) {
      this.carregando = true
      const requestSignedUrl = {
        anotacao_id: this.anotacao.id,
        atendimento_id: this.anotacao.atendimento_id,
        contentType: file.type,
        nome: file.name
      }
      const signedUrlParams = await Documento.upload(requestSignedUrl)
      const urlAWS = signedUrlParams.data.url
      const key = signedUrlParams.data.key
      try {
        await axios.put(urlAWS, file, {
          headers: {
            'Content-Type': file.type
          }
        })
        await Documento.store({
          url: key,
          nome: file.name,
          anotacao_atendimento_id: this.anotacao.id
        })

        this.carregarDocumentos()
      } catch (err) {
        console.log(err)
      }

      this.file = null
      this.carregando = false
    },
    carregarDocumentos () {
      this.carregando = true
      Documento.search({ anotacao_atendimento_id: this.anotacao.id })
        .then((documentosRetornados) => {
          this.documentos = documentosRetornados.data.map(
            (documentoRetornado) => ({
              id: documentoRetornado.id,
              url: documentoRetornado.url,
              nome: documentoRetornado.nome
            })
          )
        })
        .then(() => {
          this.dialogTabela = true
          this.carregando = false
          this.mensagem = ''
        })
    },
    fileUploadDialog () {
      document.getElementById('file-input').click()
    },
    downloadItem (item) {
      window.open(item.url, '_blank')
    },
    abrirDialogExcluir (item) {
      this.itemSelecionado = { ...item }
      this.dialogExcluir = true
    },
    fecharDialogExcluir () {
      this.dialogExcluir = false
    },
    fecharDialogDownloads () {
      this.dialogTabela = false
      this.$emit('dialogDocumentosFechado')
    },
    excluirArquivo () {
      this.fecharDialogExcluir()

      Documento.destroy(this.itemSelecionado.id)
        .then(() => {
          const index = this.documentos.findIndex(documento => documento.id === this.itemSelecionado.id)
          this.documentos.splice(index, 1)
        })
    }
  }
}
</script>

<style>
#close-button {
  margin-left: 100px;
}
</style>
