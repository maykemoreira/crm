'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnderecoSchema extends Schema {
  up () {
    this.create('enderecos', (table) => {
      table.increments()
      table.string('pais', 100)
      table.string('uf', 10)
      table.string('cidade', 100)
      table.string('bairro', 100)
      table.string('logradouro', 100)
      table.string('cep', 8)
      table.timestamps()
    })
  }

  down () {
    this.drop('enderecos')
  }
}

module.exports = EnderecoSchema
