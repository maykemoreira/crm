'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuarioSchema extends Schema {
  up () {
    this.create('usuarios', (table) => {

      table.increments()
      table.string('nome', 50).notNullable()
      table.string('sobrenome', 200).notNullable()
      table.string('login', 80).notNullable().unique()
      table.string('email',254).notNullable().unique()
      table.string('senha',60).notNullable()
      table.string('permissao',50).notNullable()
      table.timestamps()
      table.timestamp('deleted_at')

    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UsuarioSchema
