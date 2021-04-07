'use strict'

/*
|--------------------------------------------------------------------------
| AnotacaoAtendimentoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Usuario = use('App/Models/Usuario')
const Etapa = use('App/Models/Etapa')

class MainSeeder {
    async run() {

        await Etapa.create({
            nome: "Primeiro Contato",
            descricao: "Primeiro Contato"
        })
        await Etapa.create({
            nome: "Apresentação de Proposta",
            descricao: "Apresentação de Proposta"
        })

        await Etapa.create({

            nome: "Levantamento de Requisitos",
            descricao: "Levantamento de Requisitos",

        })

        await Etapa.create({
                nome: "Elaboração de Contrato",
                descricao: "Elaboração de Contrato"
        })

        await Etapa.create({
            nome: "Proposta Aceita",
                descricao: "Proposta Aceita"
        })

        await Etapa.create({
            nome: "Proposta Rejeitada",
                descricao: "Proposta Rejeitada"

        })

        await Usuario.create({
            nome: "admin",
            sobrenome: "admin",
            login: "admin",
            email: "admin@admin.com",
            senha: "admin321",
            permissao: "administrador"
        })

        await Usuario.create({
            nome: "usuario_comum",
            sobrenome: "usuario_comum",
            login: "comum",
            email: "usuario_comum@usuario_comum.com",
            senha: "comum321",
            permissao: "usuario_comum"
        })

        /*                 await Factory
                            .model('App/Models/Etapa')
                            .createMany(3) */

        await Factory
            .model('App/Models/Pessoa')
            .createMany(20)

        await Factory
            .model('App/Models/Usuario')
            .createMany(10)

        await Factory
            .model('App/Models/Atendimento')
            .createMany(30)

/*         await Factory
            .model('App/Models/Documento')
            .createMany(3) */

        await Factory
            .model('App/Models/AnotacaoAtendimento')
            .createMany(30)
    }
}


module.exports = MainSeeder
