'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AnotacaoAtendimento extends Model {

    atendimento(){
        return this.belongsTo('App/Models/Atendimento')
    }

    documentos(){
        return this.hasMany('App/Models/Documento')
    }

}

module.exports = AnotacaoAtendimento
