'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atendimento extends Model {

    anotacoes(){
        return this.hasMany('App/Models/AnotacaoAtendimento')
    }

    pessoa(){
        return this.belongsTo('App/Models/Pessoa')
    }

    etapa(){
        return this.belongsTo('App/Models/Etapa')
    }

    atendente(){
        return this.belongsTo('App/Models/Usuario')
    }

    documentos(){
        return this.manyThrough('App/Models/AnotacaoAtendimento', 'documentos')
    }


}

module.exports = Atendimento
