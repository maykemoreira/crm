'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtendimentoSchema extends Schema {
  up () {
    this.create('atendimentos', (table) => {
      table.increments()
      table.timestamps()

      table.integer('etapa_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('etapas')
      
      table.integer('usuario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')

        table.integer('pessoa_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pessoas')

        table.string('descricao', 10000)
        
        table.timestamp('data_inicio')
        table.timestamp('data_fim')

        table.string('status', 50)

    })
  }

  down () {
    this.drop('atendimentos')
  }
}

module.exports = AtendimentoSchema
