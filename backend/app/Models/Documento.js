'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Documento extends Model {

    atendimento(){
        return this.belongsTo('App/Models/Atendimento')
    }

    anotacao(){
        return this.hasOne('App/Models/AnotacaoAtendimento')
    }
}

module.exports = Documento
