<template>
  <div>
    <br />
    <Tabela
      :dados="pessoas"
      :header="cabecalho"
      :nomeTabela="nomeTabela"
      @eventoCriar="abrirDialogCriar"
      @eventoEditar="abrirDialogEditar"
      @eventoExcluir="abrirDialogExcluir"
      @eventoReativar="abrirDialogReativar"
      @tipoDePessoaAlterado="alterarDadosPessoa"
      :opcoesHeader="tiposPessoa"
      :labelOpcoesHeader="labelOpcoesHeader"
      @statusDosItensMudaram="obterPessoasPorStatus"
      :opcaoParaBuscaDesabilitar="true"
    />

    <v-dialog width="1000" v-model="dialogEditarCriar" persistent>
      <FormularioPessoa
        v-if="dialogEditarCriar === true"
        @editarPessoaConfirmado="editarPessoa"
        @criarPessoaConfirmado="criarPessoa"
        @fecharDialog="fecharDialogs"
        :acaoExecutar="acaoPessoa"
        :pessoaInformada="pessoa.endereco ? pessoa : {endereco:''}"
        :tipoPessoa="tipoPessoa"
      />
    </v-dialog>

    <v-dialog scrollable width="500" v-model="dialogDesativar" persistent>
      <FormularioConfirmarAcao
        v-if="dialogDesativar === true"
        :objetoIdentificacao="pessoa.razaosocial_nome"
        :titulo="`${acaoPessoa}`"
        :fraseConfirmacao="`Deseja ${acaoPessoa}`"
        @acaoConfirmada="acaoPessoa=== 'Desativar Pessoa' ? desativarPessoa() : reativarPessoa()"
        @fecharDialog="fecharDialogs"
      />
    </v-dialog>
  </div>
</template>

<script>
import Tabela from '@/components/widgets/Tabela'
import Pessoa from '@/services/Pessoa'
import headersTabela from '../constants/headers'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import FormularioPessoa from '@/components/forms/FormularioPessoa'

export default {
  components: {
    Tabela,
    FormularioConfirmarAcao,
    FormularioPessoa
  },
  created () {
    this.obterPessoas()
  },
  data: () => ({
    pessoas: [],
    acaoPessoa: '',
    tipoPessoa: 'fisica',
    cabecalho: [],
    tiposPessoa: ['Física', 'Jurídica'],
    labelOpcoesHeader: 'Selecione o tipo de pessoa',
    dialogEditarCriar: false,
    dialogDesativar: false,
    pessoa: {}
  }),
  computed: {
    nomeTabela () {
      const tipoPessoa = this.tipoPessoa === 'fisica' ? 'físicas' : 'jurídicas'
      return `Pessoas ${tipoPessoa}`
    }
  },
  methods: {
    limparObjetoBase () {
      this.pessoa = {}
    },
    obterPessoasPorStatus (status) {
      Pessoa.search({ tipo_pessoa: this.tipoPessoa, deleted: !status }).then(
        (pessoas) => {
          this.pessoas = pessoas.data.map((pessoa) => ({
            razaosocial_nome: pessoa.razaosocial_nome,
            nomefantasia_sobrenome: pessoa.nomefantasia_sobrenome,
            cnpj_cpf: pessoa.cnpj_cpf,
            telefone: pessoa.telefone,
            email: pessoa.email,
            tipo_pessoa: pessoa.tipo_pessoa,
            rg: pessoa.rg,
            endereco: pessoa.endereco,
            id: pessoa.id
          }))
          this.cabecalho = headersTabela[this.tipoPessoa]
        }
      )
    },

    obterPessoas (tipoPessoa) {
      if (!tipoPessoa) {
        tipoPessoa = this.tipoPessoa
      }
      Pessoa.search({ tipo_pessoa: this.tipoPessoa, deleted: false }).then(
        (pessoas) => {
          this.pessoas = pessoas.data.map((pessoa) => ({
            razaosocial_nome: pessoa.razaosocial_nome,
            nomefantasia_sobrenome: pessoa.nomefantasia_sobrenome,
            cnpj_cpf: pessoa.cnpj_cpf,
            telefone: pessoa.telefone,
            email: pessoa.email,
            tipo_pessoa: pessoa.tipo_pessoa,
            rg: pessoa.rg,
            endereco: pessoa.endereco,
            id: pessoa.id
          }))
          this.cabecalho = headersTabela[this.tipoPessoa]
        }
      )
    },
    abrirDialogCriar () {
      this.limparObjetoBase()
      this.dialogEditarCriar = true
      this.acaoPessoa = 'Criar Pessoa'
    },
    abrirDialogExcluir (item) {
      this.pessoa = { ...item }
      this.acaoPessoa = 'Desativar Pessoa'
      this.dialogDesativar = true
    },
    abrirDialogEditar (item) {
      this.acaoPessoa = 'Editar Pessoa'
      this.pessoa = { ...item }
      this.dialogEditarCriar = true
    },
    alterarDadosPessoa (tipoPessoa) {
      this.tipoPessoa = tipoPessoa
      this.obterPessoas(this.tipoPessoa)
    },
    abrirDialogReativar (item) {
      this.pessoa = { ...item }
      this.acaoPessoa = 'Reativar Pessoa'
      this.dialogDesativar = true
    },
    criarPessoa (pessoa) {
      Pessoa.store(pessoa)
        .then(() => this.obterPessoas(this.tipoPessoa))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    editarPessoa (pessoa) {
      Pessoa.update(pessoa)
        .then(() => this.obterPessoas(this.tipoPessoa))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    desativarPessoa () {
      Pessoa.destroy(this.pessoa)
        .then(() => this.obterPessoas(this.tipoPessoa))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    reativarPessoa () {
      Pessoa.recovery(this.pessoa)
        .then(() => this.obterPessoasPorStatus(false))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    fecharDialogs () {
      this.dialogEditarCriar = false
      this.dialogDesativar = false
      this.acaoEtapa = ''
      this.limparObjetoBase()
    }
  }
}
</script>

<style></style>
