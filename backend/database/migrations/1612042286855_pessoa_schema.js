'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PessoaSchema extends Schema {
  up () {
    this.create('pessoas', (table) => {
      table.increments()
      table.timestamps()

      table.string('email', 50)
      table.string('telefone', 25)
      table.timestamp('deleted_at')
      table.string('razaosocial_nome', 100).notNullable()
      table.string('nomefantasia_sobrenome' , 100)
      table.string('cnpj_cpf', 20).notNullable()
      table.string('rg', 14)
      table.string('tipo_pessoa', 20).notNullable()

      table.integer('endereco_id')
        .unsigned()
        .references('id')
        .inTable('enderecos')
        .onUpdate('CASCADE')

    })
  }

  down () {
    this.drop('pessoas')
  }
}

module.exports = PessoaSchema
