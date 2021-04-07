'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EtapaSchema extends Schema {
  up () {
    this.create('etapas', (table) => {
      table.increments()
      table.timestamps()

      table.string('nome', 200).notNullable()
      table.string('descricao', 200).notNullable()
      table.timestamp('deleted_at')

    })
  }

  down () {
    this.drop('etapas')
  }
}

module.exports = EtapaSchema
