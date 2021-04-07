'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pessoa extends Model {

    endereco(){
        return this.belongsTo('App/Models/Endereco')
    }

    atendimentos(){
        return this.hasMany('App/Models/Atendimento')
    }

}

module.exports = Pessoa
