<template>
  <div>
    <v-dialog width="1400" v-model="dialogAnotacao" persistent scrollable>
      <v-card class="pa-8">
        <v-card-title class="mb-5" v-if="anotacoesDados === true">
          <span class="headline">
            Anotações - Atendimento
            {{ atendimentoAnotacoes.id }}

            <v-btn
              class="ml-3"
              fab
              dark
              small
              outlined
              color="indigo"
              @click="adicionarAnotacao"
              :disabled="somenteLeitura"
            >
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>
            <v-btn @click="abrirTimeline" class="ml-3" fab dark small outlined color="indigo"
              :disabled="anotacoesLista.length === 0"><v-icon>mdi-timeline-text</v-icon></v-btn
            >
          </span>
        </v-card-title>
        <v-card-subtitle class="subtitle-1 black--text">
          <v-row>
            <v-col>
              Atendente: {{ atendimentoAnotacoes.atendente.nome }} <br />
              Pessoa: {{ atendimentoAnotacoes.pessoa.nome }}
            </v-col>
            <v-col cols="2">
              <v-btn
                :disabled="
                  !this.anotacoesLista.length ||
                  (this.anotacoesLista.length && this.somenteLeitura) ||
                  this.camposDesativados
                "
                fab
                elevation="1"
                id="button_delete"
                @click="dialogExcluirAnotacao = true"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-card-subtitle>

        <v-card-text v-if="anotacoesDados === true">
          <v-row>
            <v-col cols="2" v-if="this.anotacoesLista.length > 0">
              <v-list class="select-options">
                <v-list-item-group v-model="anotacaoIndex" color="blue">
                  <v-list-item
                    color="blue"
                    v-for="anotacao in this.anotacoesLista"
                    :key="anotacao.id"
                    @click="anotacaoSelecionada = anotacao"
                    >{{ anotacao.id }} - {{ anotacao.data }}
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>

            <v-col>
              <v-row id="bottom_row">
                <v-col cols="5"
                  ><v-text-field
                    :disabled="
                      !this.anotacoesLista.length ||
                      (this.anotacoesLista.length && this.somenteLeitura) ||
                      this.camposDesativados
                    "
                    v-model="anotacaoSelecionada.titulo"
                    label="Título"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <SeletorData
                    v-if="dialogEditarDataAnotacao"
                    :dataInformada="
                      formatarDataParaEditar(anotacaoSelecionada.data)
                    "
                    @dataSalva="salvarData"
                    @fecharDialog="fecharDialogDataAnotacao"
                  />
                  <v-text-field
                    :disabled="
                      !this.anotacoesLista.length ||
                      (this.anotacoesLista.length && this.somenteLeitura) ||
                      this.somenteLeitura ||
                      this.camposDesativados
                    "
                    v-model="anotacaoSelecionada.data"
                    label="Data"
                    @click="dialogEditarDataAnotacao = true"
                  ></v-text-field>
                </v-col>

                <v-col cols="1">
                  <v-btn
                    @click="abrirDialogDocumentos"
                    class="mt-3"
                    :disabled="
                      !this.anotacoesLista.length ||
                      this.camposDesativados ||
                      (this.anotacoesLista.length && this.somenteLeitura)
                    "
                    ><v-icon medium>mdi-file-upload-outline</v-icon
                    >Documentos</v-btn
                  >
                </v-col>
              </v-row>

              <vue-editor
                id="editor"
                v-model="anotacaoSelecionada.conteudo"
                :editor-toolbar="toolbarOptions"
                :disabled="
                  !this.anotacoesLista.length ||
                  this.camposDesativados ||
                  (this.anotacoesLista.length && this.somenteLeitura)
                "
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions id="card_options">
          <v-btn v-if="!somenteLeitura" @click="atualizarAnotacoes"
            >Salvar</v-btn
          >
          <v-btn @click="$emit('fecharDialog')">{{
            somenteLeitura ? "Fechar" : "Cancelar"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluirAnotacao" width="600">
      <FormularioConfirmarAcao
        v-if="dialogExcluirAnotacao"
        titulo="Excluir anotação"
        fraseConfirmacao="Deseja excluir a anotação "
        :objetoIdentificacao="criarFraseExcluirAnotacao()"
        @fecharDialog="fecharDialog"
        @acaoConfirmada="excluirAnotacao"
      />
    </v-dialog>
    <DialogTabelaDocumentos
      v-if="dialogDocumentos"
      :anotacao="anotacaoSelecionada"
      @dialogDocumentosFechado="fecharDialogDocumentos"
    />

    <TimelineAnotacoes
      @desativarTimeline="desativarTimeline"
      v-if="dialogTimeline"
      :pessoa="atendimentoAnotacoes.pessoa.nome"
      :atendente="atendimentoAnotacoes.atendente.nome"
      :atendimentoId="atendimentoAnotacoes.id"
      />
  </div>
</template>

<script>
import Atendimento from '@/services/Atendimento'
import AnotacaoAtendimento from '@/services/AnotacaoAtendimento'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import DialogTabelaDocumentos from '@/components/widgets/DialogTabelaDocumentos'
import { VueEditor } from 'vue2-editor'
import SeletorData from '@/components/widgets/SeletorData'
import TimelineAnotacoes from '@/components/widgets/TimelineAnotacoes'

export default {
  created () {
    this.obterAnotacoes()
  },
  props: {
    atendimentoAnotacoes: Object,
    somenteLeitura: Boolean
  },
  data: () => ({
    dialogTimeline: false,
    dialogDocumentos: false,
    dialogAnotacao: false,
    dialogEditarDataAnotacao: false,
    camposDesativados: false,
    anotacoesLista: [],
    anotacaoSelecionada: {},
    anotacaoIndex: null,
    dialogExcluirAnotacao: false,
    anotacoesDados: true,
    disabled: true,
    toolbarOptions: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['link']
    ]
  }),
  watch: {
    anotacaoIndex (valor) {
      if (valor === undefined) {
        this.camposDesativados = true
        this.anotacaoSelecionada = {}
      } else {
        this.camposDesativados = false
      }
    }
  },
  components: {
    VueEditor,
    FormularioConfirmarAcao,
    SeletorData,
    DialogTabelaDocumentos,
    TimelineAnotacoes
  },
  computed: {
    anotacoes_length () {
      return this.anotacoesLista.length
    }
  },
  methods: {
    desativarTimeline () {
      this.dialogTimeline = false
    },
    abrirTimeline () {
      this.dialogTimeline = true
    },
    fecharDialogDocumentos () {
      this.dialogDocumentos = false
    },
    abrirDialogDocumentos () {
      this.dialogDocumentos = true
    },
    formatarDataParaEditar (data) {
      if (data) {
        const [parteData, parteHora] = data.split(' ')
        const [dia, mes, ano] = parteData.split('/')
        const [hora, minuto] = parteHora.split(':')
        return new Date(ano, mes - 1, dia, hora, minuto).toISOString()
      }
      return new Date().toISOString()
    },
    salvarData (dataNova) {
      const mes = new Date(dataNova).getMonth()
      dataNova = new Date(dataNova).setMonth(mes + 1)
      this.anotacaoSelecionada.data = this.$moment(dataNova).format(
        'DD/MM/YYYY HH:mm'
      )
      this.dialogEditarDataAnotacao = false
    },
    fecharDialogDataAnotacao () {
      this.dialogEditarDataAnotacao = false
    },
    fecharDialog () {
      this.dialogExcluirAnotacao = false
    },
    excluirAnotacao () {
      AnotacaoAtendimento.destroy({ id: this.anotacaoSelecionada.id })
        .then(() => {
          const anotacaoExcluidaIndex = this.anotacoesLista.findIndex(
            (anotacao) => anotacao.id === this.anotacaoSelecionada.id
          )
          this.anotacoesLista.splice(anotacaoExcluidaIndex, 1)
        })
        .then(this.fecharDialog())
    },
    obterAnotacoes () {
      Atendimento.showAnotacoes({ id: this.atendimentoAnotacoes.id })
        .then((anotacoes) => {
          this.anotacoesLista = anotacoes.data.map((anotacao) => ({
            atendimento_id: anotacao.atendimento_id,
            conteudo: anotacao.conteudo,
            data: this.$moment(anotacao.data).format('DD/MM/YYYY HH:mm'),
            id: anotacao.id,
            titulo: anotacao.titulo
          }))
          this.anotacaoSelecionada =
            this.anotacoesLista.length > 0 ? this.anotacoesLista[0] : {}
          this.anotacaoIndex =
            this.anotacoesLista.length > 0
              ? (this.anotacaoIndex = 0)
              : undefined
        })
        .then(() => {
          this.dialogAnotacao = true
        })
    },
    criarFraseExcluirAnotacao () {
      const titulo = this.anotacaoSelecionada.titulo
        ? `"${this.anotacaoSelecionada.titulo}",`
        : ''
      return `${titulo} feita no dia ${this.anotacaoSelecionada.data}`
    },
    atualizarAnotacoes () {
      const anotacoes = [...this.anotacoesLista]
      const anotacoesParaAtualizar = {
        anotacoes: anotacoes.map((anotacao) => ({
          ...anotacao,
          data: this.formatarDataParaEditar(anotacao.data)
        }))
      }

      AnotacaoAtendimento.updateAll(anotacoesParaAtualizar).then(() => {
        this.$emit('fecharDialog')
      })
    },
    adicionarAnotacao () {
      AnotacaoAtendimento.store({
        data: new Date(),
        conteudo: '',
        titulo: '',
        atendimento_id: this.atendimentoAnotacoes.id
      }).then((anotacao) => {
        this.anotacoesLista.unshift({
          id: anotacao.data.id,
          data: this.$moment(anotacao.data.data).format('DD/MM/YYYY HH:mm'),
          titulo: anotacao.data.titulo,
          conteudo: anotacao.data.conteudo,
          atendimento_id: anotacao.data.atendimento_id
        })
      })
    },
    formatarData (date) {
      return this.$moment(date).format('DD/MM/YYYY HH:mm:ss')
    }
  }
}
</script>

<style>
</style>
