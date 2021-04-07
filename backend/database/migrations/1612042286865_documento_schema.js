'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DocumentoSchema extends Schema {
  up () {
    this.create('documentos', (table) => {
      table.increments()
      table.timestamps()
      table.string('nome', 200)
      table.string('url')
      table.integer('anotacao_atendimento_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('anotacao_atendimentos')
        .onDelete('CASCADE')
    })

  }

  down () {
    this.drop('documentos')
  }
}

module.exports = DocumentoSchema
