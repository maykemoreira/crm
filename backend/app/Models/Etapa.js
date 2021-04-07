'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Etapa extends Model {

    atendimentos(){
        return this.hasMany('App/Models/Atendimento')
    }
}

module.exports = Etapa
