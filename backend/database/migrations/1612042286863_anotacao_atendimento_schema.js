'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnotacaoAtendimentoSchema extends Schema {
  up () {
    this.create('anotacao_atendimentos', (table) => {
      table.increments()
      table.timestamps()
      table.string('titulo', 100)
      table.string('conteudo',10000)
      table.timestamp('data')
      table.integer('atendimento_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('anotacao_atendimentos')
  }
}

module.exports = AnotacaoAtendimentoSchema
