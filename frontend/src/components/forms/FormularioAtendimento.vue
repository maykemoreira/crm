<template>
  <div>
    <v-dialog width="1000" v-model="dialogEditarCriar" persistent>
      <v-card class="pa-8">
        <v-card-title class="mb-5">
          <span class="headline"> {{ acaoExecutar }} - Atendimento </span>
        </v-card-title>

        <v-card-text>
          <v-row class="ma-n6">
            <v-col cols="3">
              <SeletorData
                v-if="dialogEditarDataInicio"
                :dataInformada="
                  formatarDataParaEditar(atendimentoEditavel.data_inicio)
                "
                @dataSalva="salvarDataInicio"
                @fecharDialog="fecharDialogDataInicio"
              />
              <v-text-field
                @click="somenteLeitura ? null : (dialogEditarDataInicio = true)"
                label="Data de Início"
                v-model="atendimentoEditavel.data_inicio"
                :disabled="somenteLeitura"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <SeletorData
                v-if="dialogEditarDataFim"
                :dataInformada="
                  formatarDataParaEditar(atendimentoEditavel.data_fim)
                "
                @dataSalva="salvarDataFim"
                @fecharDialog="fecharDialogDataFim"
              />
              <v-text-field
                :disabled="somenteLeitura"
                @click="somenteLeitura ? null : (dialogEditarDataFim = true)"
                label="Data de Fim"
                v-model="atendimentoEditavel.data_fim"
              >
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-autocomplete
                v-model="atendimentoEditavel.usuario_id"
                :disabled="!credenciaisUsuario.permiteEdicao || somenteLeitura"
                :items="atendenteLista"
                label="Atendente"
                item-value="id"
                item-text="nome"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="ma-n6">
            <v-col cols="3">
              <v-select
                :disabled="somenteLeitura"
                v-model="atendimentoEditavel.tipo_pessoa"
                :items="pessoaTipo"
                item-text="nome"
                item-value="valor"
                label="Tipo de Pessoa"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                :disabled="!atendimentoEditavel.tipo_pessoa || somenteLeitura"
                v-model="atendimentoEditavel.pessoa_id"
                :items="pessoaLista"
                item-text="nome"
                item-value="id"
                label="Pessoa"
              ></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="!somenteLeitura && atendimentoEditavel.tipo_pessoa"
                @click="dialogCriarPessoa = true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row :class="somenteLeitura ? 'mr-16' : null">
            <v-col
              :cols="somenteLeitura ? 5 : 12"
              id="seletor_etapas"
              class="mb-2"
            >
              <span v-if="!somenteLeitura" id="etapa_titulo">Etapa</span>

              <SeletorCarrossel
                v-if="!somenteLeitura && etapasLista.length"
                :itemLista="etapasLista"
                :itemSelecionado="atendimentoEditavel.etapa_id"
                @alterouItem="associarNovaEtapa"
                parametroExibir="nome"
              />
              <v-select
                v-else-if="somenteLeitura"
                v-model="atendimentoEditavel.etapa_id"
                :items="etapasLista"
                :disabled="somenteLeitura"
                label="Etapa"
                item-text="nome"
                item-value="id"
                name="etapa"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-textarea
              :disabled="somenteLeitura"
              v-model="atendimentoEditavel.descricao"
              label="Descrição"
              filled
              height="250"
              flat
              >{{ atendimentoEditavel.descricao }}</v-textarea
            >
          </v-row>
        </v-card-text>

        <v-card-actions id="card_options">
          <v-btn
            v-if="atendimentoEditavel.status !== 'concluido'"
            @click="
              acaoExecutar === 'Criar'
                ? $emit('criarAtendimentoConfirmado', atendimentoEditavel)
                : $emit('editarAtendimentoConfirmado', atendimentoEditavel)
            "
            >Salvar</v-btn
          >
          <v-btn @click="propagarFechamentoDialog"
            >{{
              atendimentoEditavel.status === "concluido" ? "Fechar" : "Cancelar"
            }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="atendimentoEditavel.status !== 'concluido'"
            @click="dialogMudarStatus = true"
          >
            <v-icon class="mr-3">mdi-lock</v-icon>Concluir Atendimento
          </v-btn>

          <v-btn
            v-if="
              atendimentoEditavel.status === 'concluido' &&
              credenciaisUsuario.permissao === 'administrador'
            "
            @click="dialogMudarStatus = true"
          >
            <v-icon class="mr-3">mdi-lock-open</v-icon>Reabrir Atendimento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="800" v-model="dialogCriarPessoa">
      <FormularioPessoa
        v-if="dialogCriarPessoa === true"
        @criarPessoaConfirmado="criarPessoa"
        @fecharDialog="dialogCriarPessoa = false"
        acaoExecutar="Criar Pessoa"
        :pessoaInformada="{ endereco: '' }"
        :tipoPessoa="atendimentoEditavel.tipo_pessoa"
      />
    </v-dialog>

    <v-dialog width="600" v-model="dialogMudarStatus">
      <FormularioConfirmarAcao
        :titulo="status_oposto.titulo"
        :fraseConfirmacao="status_oposto.frase"
        :objetoIdentificacao="`de código: ${atendimentoEditavel.id}, criado no dia: ${atendimentoEditavel.data_inicio}`"
        @acaoConfirmada="
          status_oposto.statusAtual === 'concluido'
            ? reabrirAtendimento()
            : finalizarAtendimento()
        "
        @fecharDialog="dialogMudarStatus = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import Pessoa from '@/services/Pessoa'
import Usuario from '@/services/Usuario'
import Etapa from '@/services/Etapa'
import Atendimento from '@/services/Atendimento'
import FormularioPessoa from '@/components/forms/FormularioPessoa'
import SeletorData from '@/components/widgets/SeletorData'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import credenciaisUsuario from '@/mixins'
import SeletorCarrossel from '@/components/widgets/SeletorCarrossel'

export default {
  mixins: [credenciaisUsuario],
  components: {
    SeletorCarrossel,
    FormularioPessoa,
    SeletorData,
    FormularioConfirmarAcao
  },
  props: {
    acaoExecutar: String,
    atendimentoInformado: Object,
    somenteLeitura: Boolean
  },
  created () {
    this.carregarDadosAtendimento()
  },
  computed: {
    etapa_indice () {
      return this.atendimentoInformado.etapa.id
    },
    atendimento_tipo () {
      return this.atendimentoEditavel.tipo_pessoa
    },
    status_oposto () {
      const statusAtual = this.atendimentoEditavel.status
      const statusOposto = `${
        this.atendimentoEditavel.status === 'concluido' ? 'aberto' : 'concluido'
      }`
      const titulo =
        statusOposto === 'concluido'
          ? 'Concluir atendimento'
          : 'Reabrir atendimento'
      const frase =
        statusOposto === 'concluido'
          ? 'Deseja concluir o atendimento'
          : 'Deseja reabrir o atendimento'
      return {
        statusAtual,
        titulo,
        frase
      }
    }
  },
  watch: {
    atendimento_tipo (valor) {
      this.carregarListaPessoas(valor)
    },
    anotacoes_length (tamanhoAnotacoes) {
      this.disabled = tamanhoAnotacoes === 0
    }
  },
  data: () => ({
    dialogEditarCriar: false,
    dialogMudarStatus: false,
    dialogEditarDataFim: false,
    dialogEditarDataInicio: false,
    dialogCriarPessoa: false,
    anotacaoPosicao: 0,
    atendimentoEditavel: {},
    pessoaLista: [],
    etapasLista: [],
    atendenteLista: [],
    atendenteSelecionado: null,
    anotacaoSelecionada: {},
    etapaSelecionada: null,
    pessoaSelecionada: null,
    anotacoesDados: false,
    pessoaTipoSelecionado: null,
    pessoaTipo: [
      { nome: 'Física', valor: 'fisica' },
      { nome: 'Jurídica', valor: 'juridica' }
    ],
    toolbarOptions: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link']
    ],
    disabled: true,
    anotacoesLista: [],
    dialogExcluirAnotacao: false
  }),
  methods: {
    associarNovaEtapa (etapa) {
      if (etapa && etapa.id) { this.atendimentoEditavel.etapa_id = etapa.id }
    },
    propagarFechamentoDialog () {
      this.$emit('fecharDialog')
      this.atendimentoEditavel = {}
    },
    finalizarAtendimento () {
      this.$emit('finalizarAtendimento', this.atendimentoEditavel)
      this.dialogMudarStatus = false
    },
    reabrirAtendimento () {
      this.$emit('reabrirAtendimento', this.atendimentoEditavel)
      this.dialogMudarStatus = false
    },
    salvarDataInicio (dataNova) {
      dataNova = new Date(dataNova)

      this.atendimentoEditavel.data_inicio = this.$moment(dataNova).format(
        'DD/MM/YYYY HH:mm'
      )
      this.dialogEditarDataInicio = false
    },
    salvarDataFim (dataNova) {
      dataNova = new Date(dataNova)
      this.atendimentoEditavel.data_fim = this.$moment(dataNova).format(
        'DD/MM/YYYY HH:mm'
      )
      this.dialogEditarDataFim = false
    },
    fecharDialogDataInicio () {
      this.dialogEditarDataInicio = false
    },
    fecharDialogDataFim () {
      this.dialogEditarDataFim = false
    },
    formatarDataParaEditar (data) {
      if (data) {
        const [parteData, parteHora] = data.split(' ')
        const [dia, mes, ano] = parteData.split('/')
        const [hora, minuto] = parteHora.split(':')
        return new Date(ano, mes, dia, hora, minuto).toISOString()
      }
      return new Date().toISOString()
    },
    criarPessoa (pessoa) {
      Pessoa.store(pessoa)
        .then((pessoa) => {
          this.carregarListaPessoas(this.atendimentoEditavel.tipo_pessoa)
          this.atendimentoEditavel.pessoa_id = pessoa.data.id
        })
        .catch((error) => console.log(error))
        .finally((this.dialogCriarPessoa = false))
    },
    carregarListaPessoas (tipo) {
      if (tipo) {
        Pessoa.search({ deleted: false, tipo_pessoa: tipo }).then((pessoas) => {
          this.pessoaLista = pessoas.data.map((pessoa) => ({
            nome: pessoa.razaosocial_nome,
            id: pessoa.id
          }))

          if (this.atendimentoEditavel.pessoa_id) {
            const pessoaFiltrada = pessoas.data.filter(
              (pessoa) => pessoa.id === this.atendimentoEditavel.pessoa_id
            )
            if (pessoaFiltrada.length === 0) {
              Pessoa.show(this.atendimentoEditavel.pessoa_id).then((pessoa) => {
                if (
                  this.atendimentoEditavel.tipo_pessoa ===
                  pessoa.data.tipo_pessoa
                ) {
                  this.pessoaLista = [
                    {
                      id: pessoa.data.id,
                      nome: pessoa.data.razaosocial_nome
                    },
                    ...this.pessoaLista
                  ]
                }
              })
            }
          }
        })
      }
    },
    carregarDadosAtendimento () {
      Promise.all([
        this.carregarAtendimento(),
        this.carregarListaAtendentes(),
        this.carregarListaEtapas()
      ]).then(() => {
        this.dialogEditarCriar = true
      })
    },
    carregarAtendimento () {
      if (this.atendimentoInformado.id) {
        Atendimento.show(this.atendimentoInformado.id).then((atendimento) => {
          const [atendimentoDados] = atendimento.data

          this.atendimentoEditavel = {
            id: atendimentoDados.id,
            descricao: atendimentoDados.descricao,
            pessoa_id: atendimentoDados.pessoa_id,
            tipo_pessoa: atendimentoDados.pessoa.tipo_pessoa,
            data_inicio: atendimentoDados.data_inicio ? this.$moment(atendimentoDados.data_inicio).format(
              'DD/MM/YYYY HH:mm') : atendimentoDados.data_inicio,
            data_fim: atendimentoDados.data_fim ? this.$moment(atendimentoDados.data_fim).format(
              'DD/MM/YYYY HH:mm') : atendimentoDados.data_fim,
            usuario_id: atendimentoDados.usuario_id,
            etapa_id: atendimentoDados.etapa_id,
            status: atendimentoDados.status
          }
        })
      } else {
        this.atendimentoEditavel = {
          data_inicio: this.$moment().format('DD/MM/YYYY HH:mm')
        }
      }
    },
    carregarListaAtendentes () {
      if (this.credenciaisUsuario.permissao === 'usuario_comum') {
        this.atendenteLista = [
          {
            nome: this.credenciaisUsuario.nome,
            id: this.credenciaisUsuario.id
          }
        ]
        this.atendimentoEditavel.usuario_id = this.credenciaisUsuario.id
      } else {
        Usuario.search({ deleted: false }).then((usuarios) => {
          this.atendenteLista = usuarios.data.map((usuario) => ({
            nome: `${usuario.nome} ${usuario.sobrenome}`,
            id: usuario.id
          }))

          if (this.atendimentoEditavel.usuario_id) {
            const usuarioFiltrado = usuarios.data.filter(
              (usuario) => usuario.id === this.atendimentoEditavel.usuario_id
            )
            if (usuarioFiltrado.length === 0) {
              Usuario.show(this.atendimentoEditavel.usuario_id).then(
                (usuario) => {
                  this.atendenteLista = [
                    {
                      id: usuario.data.id,
                      nome: `${usuario.data.nome} ${usuario.data.sobrenome}`
                    },
                    ...this.atendenteLista
                  ]
                }
              )
            }
          }
        })
      }
    },
    carregarListaEtapas () {
      Etapa.search({ deleted: false }).then((etapas) => {
        this.etapasLista = etapas.data.map((etapa) => ({
          nome: etapa.nome,
          id: etapa.id
        }))
        if (this.atendimentoEditavel.etapa_id) {
          const etapaFiltrada = etapas.data.filter(
            (etapa) => etapa.id === this.atendimentoEditavel.etapa_id
          )
          if (etapaFiltrada.length === 0) {
            Etapa.show(this.atendimentoEditavel.etapa_id).then((etapa) => {
              this.etapasLista = [
                {
                  id: etapa.data.id,
                  nome: etapa.data.nome
                },
                ...this.etapasLista
              ]
            })
          }
        }
      })
    }
  }
}
</script>

<style>
#etapa_titulo {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  margin-bottom: 10px;
}
#seletor_etapas {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0%;
  white-space: nowrap;
}

#card_options {
  margin-top: -5px;
}
#col_up {
  margin-top: -30px;
}
#editor {
  height: 300px;
  background-color: #f3f3f3;
}
.bottom_row {
  margin-top: -10px;
}

#button_delete {
  margin-top: -100px;
  margin-left: 50px;
}
.select-options {
  height: 400px;
  overflow-y: auto;
}
</style>
