<template>
  <v-card>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col class="mb-4">
          <v-card-title>
            <span class="headline">{{acaoExecutar}}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="pessoaEditavel.razaosocial_nome"
              :label="primeiroNome"
              >{{ pessoaEditavel.razaosocial_nome }}</v-text-field
            >
            <v-text-field
              v-model="pessoaEditavel.nomefantasia_sobrenome"
              :label="segundoNome"
              >{{ pessoaEditavel.nomefantasia_sobrenome }}</v-text-field
            >
            <v-text-field
              v-model="pessoaEditavel.cnpj_cpf"
              :label="identificacao"
              >{{ pessoaEditavel.cnpj_cpf }}</v-text-field
            >
            <v-text-field
              v-if="tipoPessoa === 'fisica'"
              v-model="pessoaEditavel.rg"
              label="RG"
              >{{ pessoaEditavel.rg }}</v-text-field
            >
            <v-text-field v-model="pessoaEditavel.telefone" label="Telefone">{{
              pessoaEditavel.telefone
            }}</v-text-field>
            <v-text-field v-model="pessoaEditavel.email" label="Email">{{
              pessoaEditavel.email
            }}</v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="
                acaoExecutar === 'Criar Pessoa'
                  ? $emit('criarPessoaConfirmado', pessoaEditavel)
                  : $emit('editarPessoaConfirmado', pessoaEditavel)
              "
              >Salvar</v-btn
            >
            <v-btn @click="$emit('fecharDialog')">Cancelar</v-btn>
          </v-card-actions>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <v-card-title>
            <span class="headline">Dados de Endereço</span>
          </v-card-title>
          <v-text-field v-model="pessoaEditavel.endereco.pais" label="País"></v-text-field>
          <v-text-field v-model="pessoaEditavel.endereco.uf" label="Estado"></v-text-field>
          <v-text-field v-model="pessoaEditavel.endereco.cidade" label="Cidade"></v-text-field>
          <v-text-field v-model="pessoaEditavel.endereco.bairro" label="Bairro"></v-text-field>
          <v-text-field v-model="pessoaEditavel.endereco.logradouro" label="Logradouro"></v-text-field>
          <v-text-field v-model="pessoaEditavel.endereco.cep" label="CEP"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    acaoExecutar: String,
    pessoaInformada: Object,
    tipoPessoa: String

  },
  computed: {
    primeiroNome () {
      return this.pessoaEditavel.tipo_pessoa === 'fisica' || this.tipoPessoa === 'fisica'
        ? 'Nome'
        : 'Razão Social'
    },
    segundoNome () {
      return this.pessoaEditavel.tipo_pessoa === 'fisica' || this.tipoPessoa === 'fisica'
        ? 'Sobrenome'
        : 'Nome Fantasia'
    },
    identificacao () {
      return this.pessoaEditavel.tipo_pessoa === 'fisica' || this.tipoPessoa === 'fisica'
        ? 'CPF'
        : 'CNPJ'
    }
  },
  created () {
    this.associarPessoa()
  },
  data: () => ({
    pessoaEditavel: {},
    endereco: {}
  }),
  methods: {
    associarPessoa () {
      this.pessoaEditavel = { ...this.pessoaInformada }
      this.pessoaEditavel.tipo_pessoa = this.tipoPessoa
    }
  }
}
</script>

<style>
</style>
