<template>
  <div>
    <br />
    <Tabela
      :dados="usuarios"
      :header="cabecalho"
      nomeTabela="Usuários"
      @eventoCriar="abrirDialogCriar"
      @eventoEditar="abrirDialogEditar"
      @eventoExcluir="abrirDialogExcluir"
      @eventoReativar="abrirDialogReativar"
      @statusDosItensMudaram="obterUsuarioPorStatus"
      :opcaoParaBuscaDesabilitar="true"
    />

    <v-dialog width="700" v-model="dialogEditarCriar" persistent>
      <FormularioUsuario
        v-if="dialogEditarCriar === true"
        @editarUsuarioConfirmado="editarUsuario"
        @criarUsuarioConfirmado="criarUsuario"
        @fecharDialog="fecharDialogs"
        :acaoExecutar="acaoUsuario"
        :usuarioInformado="usuario"
      />
    </v-dialog>

    <v-dialog width="500" v-model="dialogDesativar" persistent>
      <FormularioConfirmarAcao
        v-if="dialogDesativar === true"
        :objetoIdentificacao="usuario.nome"
        :fraseConfirmacao="`Deseja ${acaoUsuario}`"
        :titulo="`${acaoUsuario}`"
        @acaoConfirmada="acaoUsuario=== 'Desativar Usuário' ? desativarUsuario() : reativarUsuario()"
        @fecharDialog="fecharDialogs"
      />
    </v-dialog>
  </div>
</template>

<script>
import Usuario from '@/services/Usuario'
import headersTabela from '@/constants/headers'
import Tabela from '@/components/widgets/Tabela'
import FormularioConfirmarAcao from '@/components/forms/FormularioConfirmarAcao'
import FormularioUsuario from '@/components/forms/FormularioUsuario'

export default {
  components: {
    Tabela,
    FormularioConfirmarAcao,
    FormularioUsuario
  },
  created () {
    this.obterUsuarios()
  },
  data: () => ({
    usuarios: [],
    cabecalho: [],
    acaoUsuario: '',
    usuario: {},
    dialogEditarCriar: false,
    dialogDesativar: false,
    campos: []
  }),
  methods: {
    obterUsuarios () {
      this.carregando = true
      Usuario.search({ deleted: false })
        .then((usuarios) => {
          this.usuarios = usuarios.data.map((usuario) => {
            const permissaoExibir = {
              usuario_comum: 'Usuário Comum',
              administrador: 'Administrador'
            }
            return {
              ...usuario,
              permissao: permissaoExibir[usuario.permissao]
            }
          })
          this.cabecalho = headersTabela.usuarios
        })
        .finally(() => {
          this.carregando = false
        })
    },
    limparUsuario () {
      this.usuario = {
        nome: '',
        ativa: '',
        id: '',
        descricao: ''
      }
    },
    abrirDialogCriar () {
      this.dialogEditarCriar = true
      this.acaoUsuario = 'Criar Usuário'
    },
    abrirDialogExcluir (item) {
      this.usuario = item
      this.acaoUsuario = 'Desativar Usuário'
      this.dialogDesativar = true
    },
    abrirDialogReativar (item) {
      this.usuario = item
      this.acaoUsuario = 'Reativar Usuário'
      this.dialogDesativar = true
    },
    abrirDialogEditar (item) {
      this.acaoUsuario = 'Editar Usuário'
      this.usuario = item
      this.dialogEditarCriar = true
    },
    criarUsuario (usuarioRecebido) {
      Usuario.store(usuarioRecebido)
        .then(() => this.obterUsuarios())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    editarUsuario (usuarioRecebido) {
      Usuario.update(usuarioRecebido)
        .then(() => this.obterUsuarios())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    desativarUsuario () {
      Usuario.destroy(this.usuario)
        .then(() => this.obterUsuarios())
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    reativarUsuario () {
      Usuario.recovery(this.usuario)
        .then(() => this.obterUsuarioPorStatus(false))
        .catch((error) => console.log(error))
        .finally(() => this.fecharDialogs())
    },
    fecharDialogs () {
      this.dialogEditarCriar = false
      this.dialogDesativar = false
      this.acaoUsuario = ''
      this.limparUsuario()
    },
    obterUsuarioPorStatus (status) {
      Usuario.search({ deleted: !status })
        .then((usuarios) => {
          this.usuarios = usuarios.data.map((usuario) => {
            const permissaoExibir = {
              usuario_comum: 'Usuário Comum',
              administrador: 'Administrador'
            }
            return {
              ...usuario,
              permissao: permissaoExibir[usuario.permissao]
            }
          })
          this.cabecalho = headersTabela.usuarios
        })
        .finally(() => {
          this.carregando = false
        })
    }
  }
}
</script>

<style></style>
