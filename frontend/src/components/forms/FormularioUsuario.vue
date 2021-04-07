<template>
  <v-card>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col class="mb-4">
          <v-card-title>
            <span class="headline">{{ acaoExecutar }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="usuarioEditavel.nome" label="Nome">{{
              usuarioEditavel.nome
            }}</v-text-field>
            <v-text-field
              v-model="usuarioEditavel.sobrenome"
              label="Sobrenome"
              >{{ usuarioEditavel.sobrenome }}</v-text-field
            >
            <v-text-field v-model="usuarioEditavel.email" label="Email">{{
              usuarioEditavel.email
            }}</v-text-field>
            <v-text-field
              v-if="acaoExecutar === 'Criar Usuário'"
              v-model="usuarioEditavel.login"
              label="Login"
              >{{ usuarioEditavel.login }}</v-text-field
            >
            <v-text-field
              v-if="acaoExecutar === 'Criar Usuário'"
              v-model="usuarioEditavel.senha"
              label="Senha"
              :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
              :type="mostrarSenha ? 'text' : 'password'"
              @click:append="mostrarSenha = !mostrarSenha"
              >{{ usuarioEditavel.senha }}</v-text-field
            >
            <v-select
              :items="permissoes"
              v-model="usuarioEditavel.permissao"
              label="Permissao"
              >{{ permissaoEscolhida}}</v-select
            >
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="
                acaoExecutar === 'Criar Usuário'
                  ? $emit('criarUsuarioConfirmado', configurarUsuarioEditavel())
                  : $emit('editarUsuarioConfirmado', configurarUsuarioEditavel())
              "
              >Salvar</v-btn
            >
            <v-btn @click="$emit('fecharDialog')">Cancelar</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    acaoExecutar: String,
    usuarioInformado: Object
  },
  created () {
    this.associarUsuario()
  },
  data: () => ({
    usuarioEditavel: {},
    endereco: {},
    permissaoEscolhida: null,
    permissoes: ['Administrador', 'Usuário Comum'],
    mostrarSenha: false
  }),
  methods: {
    associarUsuario () {
      this.usuarioEditavel = { ...this.usuarioInformado }
    },
    configurarUsuarioEditavel () {
      const permissoes = {
        Administrador: 'administrador',
        'Usuário Comum': 'usuario_comum'
      }
      this.usuarioEditavel.permissao =
        permissoes[this.usuarioEditavel.permissao]

      return { ...this.usuarioEditavel }
    }
  }
}
</script>

<style>
</style>
