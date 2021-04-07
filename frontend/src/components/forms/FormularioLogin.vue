<template>
  <div>
    <v-app>
      <v-card width="500" class="pa-5 ma-5 mx-auto my-12" color="#f7f7f7">
        <v-container>
          <v-card-title class="headline">Sistema CRM</v-card-title>
          <v-row class="mt-5">
            <v-text-field
              v-model="loginDados.login"
              label="Login"
            ></v-text-field>
          </v-row>
          <v-row class="mt-7">
            <v-text-field
              :type="mostrarSenha ? 'text' : 'password'"
              :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
              label="Senha"
              v-model="loginDados.senha"
              @click:append="mostrarSenha = !mostrarSenha"
            ></v-text-field>
          </v-row>
        </v-container>
        <v-card-actions class="mt-5">
          <v-btn @click="login">Entrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import Usuario from '@/services/Usuario'
export default {
  data: () => ({
    mostrarSenha: false,
    loginDados: {
      login: '',
      senha: ''
    },
    loginaBemSucedido: false
  }),
  methods: {
    login () {
      Usuario.login(this.loginDados)
        .then((dadosDeAcesso) => {
          localStorage.setItem(
            'credentials',
            JSON.stringify(dadosDeAcesso.data)
          )
        }).then(() => this.$router.push('/atendimentos'))
        .catch((error) => console.log(error))
    }
  }
}
</script>

<style scoped>
</style>
