'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Usuario extends Model {
    static boot () {
        super.boot()
        this.addHook('beforeSave', async (usuario) => {
          if (usuario.dirty.senha) {
            usuario.senha = await Hash.make(usuario.senha)
          }
        })
      }
    
    tokens () {
        return this.hasMany('App/Models/Token')
      }
    atendimentos(){
        return this.hasMany('App/Models/Atendimento')
    }

    
}

module.exports = Usuario
