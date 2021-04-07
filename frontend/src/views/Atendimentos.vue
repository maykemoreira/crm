<template>
  <div>
    <br />
    <TabelaAtendimentos
      :dados="atendimentos"
      :header="cabecalho"
      nomeTabela="Atendimentos"
      :anotacoesOpcao="true"
      @eventoCriar="abrirDialogCriar"
      @eventoEditar="abrirDialogEditar"
      @eventoExcluir="abrirDialogExcluir"
      @eventoAnotacoes="abrirDialogAnotacoes"
    />

      <FormularioAtendimento
        v-if="ativarFormularioEditarCriar === true"
        @editarAtendimentoConfirmado="editarAtendimento"
        @criarAtendimentoConfirmado="criarAtendimento"
        @finalizarAtendimento="finalizarAtendimento"
        @fecharDialog="fecharDialogs"
        @reabrirAtendimento="reabrirAtendimento"
        :somenteLeitura="atendimento.status === 'Concluido'"
        :acaoExecutar="acaoAtendimento"
        :atendimentoInformado="atendimento"
      />

      <FormularioAnotacao
        v-if="ativarFormularioAnotacoes === true"
        :atendimentoAnotacoes="atendimento"
        :somenteLeitura="atendimento.status === 'Concluido'"
        @fecharDialog="fecharDialogs"
      />

    <v-dialog width="500" scrollable v-model="dialogDesativar" persistent>
      <FormularioConfirmarAcao
        v-if="dialogDesativar === true"
        :objetoIdentificacao="String(atendimento.id)"
        :titulo="`Excluir - Atendimento ${atendimento.id}`"
        fraseConfirmacao="Deseja excluir o atendimento de código "
        @acaoConfirmada="excluirAtendimento"
        @fecharDialog="fecharDialogs"
      />
    </v-dialog>
  </div>
</template>

<script>
import Atendimento from '@/services/Atendimento'
import headersTabela from '@/constants/headers'
import TabelaAtendimentos from '@/components/widgets/TabelaAtendimentos'
import FormularioAnotacao from '@/components/forms/FormularioAnotacao'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import FormularioAtendimento from '@/components/forms/FormularioAtendimento'

export default {
  components: {
    TabelaAtendimentos,
    FormularioConfirmarAcao,
    FormularioAtendimento,
    FormularioAnotacao
  },
  created () {
    this.obterAtendimentos()
  },
  data: () => ({
    atendimentos: [],
    cabecalho: [],
    acaoAtendimento: '',
    atendimento: {},
    ativarFormularioEditarCriar: false,
    dialogDesativar: false,
    ativarFormularioAnotacoes: false,
    campos: []
  }),
  methods: {
    formatarDataParaEditar (data) {
      if (data) {
        const [parteData, parteHora] = data.split(' ')
        const [dia, mes, ano] = parteData.split('/')
        const [hora, minuto] = parteHora.split(':')
        return new Date(ano, mes - 1, dia, hora, minuto).toISOString()
      }
      return new Date().toISOString()
    },
    finalizarAtendimento (atendimento) {
      atendimento.data_inicio = this.formatarDataParaEditar(
        atendimento.data_inicio
      )
      atendimento.data_fim = atendimento.data_fim ? this.formatarDataParaEditar(atendimento.data_fim) : new Date()
      atendimento.status = 'concluido'
      Atendimento.store(atendimento).then(() => Atendimento.update(atendimento)
        .then(() => this.obterAtendimentos())
        .finally(this.fecharDialogs())
      )
    },
    reabrirAtendimento (atendimento) {
      atendimento.data_inicio = this.formatarDataParaEditar(
        atendimento.data_inicio
      )
      atendimento.data_fim = this.formatarDataParaEditar(atendimento.data_fim)
      atendimento.status = 'aberto'
      Atendimento.update(atendimento)
        .then(() => this.obterAtendimentos())
        .finally(this.fecharDialogs())
    },
    obterAtendimentos () {
      this.carregando = true
      Atendimento.index()
        .then((atendimentos) => {
          this.atendimentos = atendimentos.data.map((atendimento) => {
            return {
              id: atendimento.id,
              pessoa: {
                nome: atendimento.pessoa.razaosocial_nome,
                id: atendimento.pessoa.id
              },
              atendente: {
                nome: atendimento.atendente.nome,
                id: atendimento.atendente.id
              },
              status: this.formatarStatus(atendimento.status, true),
              etapa: { nome: atendimento.etapa.nome, id: atendimento.etapa.id },
              data_inicio: this.$moment(atendimento.data_inicio).format(
                'DD/MM/YYYY HH:mm'
              )
            }
          })
          this.cabecalho = headersTabela.atendimentos
        })
        .finally(() => {
          this.carregando = false
        })
    },
    limparAtendimento () {
      this.atendimento = {}
    },
    abrirDialogCriar () {
      this.acaoAtendimento = 'Criar'
      this.ativarFormularioEditarCriar = true
    },
    abrirDialogAnotacoes (item) {
      this.atendimento = { ...item }
      this.ativarFormularioAnotacoes = true
      this.acaoAtendimento = 'Criar'
    },
    abrirDialogExcluir (item) {
      this.atendimento = { ...item }
      this.acaoAtendimento = 'Excluir'
      this.dialogDesativar = true
    },
    abrirDialogEditar (item) {
      this.acaoAtendimento = 'Editar'
      this.atendimento = { ...item }
      this.ativarFormularioEditarCriar = true
    },
    criarAtendimento (atendimentoDados) {
      const requestBody = {
        descricao: atendimentoDados.descricao,
        etapa_id: atendimentoDados.etapa_id,
        usuario_id: atendimentoDados.usuario_id,
        data_inicio: this.formatarDataParaEditar(atendimentoDados.data_inicio),
        data_fim: atendimentoDados.data_fim ? this.formatarDataParaEditar(atendimentoDados.data_fim) : null,
        pessoa_id: atendimentoDados.pessoa_id,
        status: 'aberto'
      }
      Atendimento.store(requestBody)
        .then(() => this.obterAtendimentos())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    editarAtendimento (atendimentoRecebido) {
      const requestUpdateBody = {
        ...atendimentoRecebido,
        data_inicio: this.formatarDataParaEditar(
          atendimentoRecebido.data_inicio
        ),
        data_fim: atendimentoRecebido.data_fim ? this.formatarDataParaEditar(atendimentoRecebido.data_fim) : null
      }
      Atendimento.update(requestUpdateBody)
        .then(() => this.obterAtendimentos())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    excluirAtendimento () {
      Atendimento.destroy(this.atendimento)
        .then(() => this.obterAtendimentos())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    fecharDialogs () {
      this.ativarFormularioEditarCriar = false
      this.dialogDesativar = false
      this.ativarFormularioAnotacoes = false
      this.acaoAtendimento = ''
      this.limparAtendimento()
    },
    formatarStatus (status, recebimentoDoStatus) {
      if (status) {
        const primeiraLetra = recebimentoDoStatus
          ? status.slice(0, 1).toUpperCase()
          : status.slice(0, 1).toLowerCase()

        const restante = status.slice(1, status.length)
        return primeiraLetra + restante
      } else {
        return null
      }
    }
  }
}
</script>

<style></style>
