'use strict'

const Pessoa = use('App/Models/Pessoa')
const Endereco = use('App/Models/Endereco')

class PessoaController {

  async store({ request, response }) {

    try {
      const pessoaToCreateData = request.only([
        'email',
        'telefone',
        'razaosocial_nome',
        'nomefantasia_sobrenome',
        'cnpj_cpf',
        'rg',
        'tipo_pessoa',
      ])

      const enderecoToCreateData = request.only(['endereco']).endereco
      const enderecoCreated = await Endereco.create(enderecoToCreateData)

      pessoaToCreateData.endereco_id = enderecoCreated.id
      const pessoaCreated = await Pessoa.create(pessoaToCreateData)
      response.ok(pessoaCreated)
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error })
    }

  }


  async show({ params, response }) {

    const id = params.id
    try {

      const pessoa = await Pessoa.findOrFail(id)
      response.ok(pessoa)

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." })

    }


  }

  async update({ params, request, response }) {

    const pessoaId = params.id
    const pessoaRequestData = request.only([
      'email',
      'telefone',
      'razaosocial_nome',
      'nomefantasia_sobrenome',
      'cnpj_cpf',
      'rg',
      'tipo_pessoa',
    ])


    try {

      if(request.only(['endereco']).endereco){
        const enderecoToUpdateData = request.only(['endereco']).endereco

        const enderecoToUpdate = await Endereco.findOrFail(enderecoToUpdateData.id)
        enderecoToUpdate.merge(enderecoToUpdateData)
        await enderecoToUpdate.save()

      }

      const pessoaToUpdate = await Pessoa.findOrFail(pessoaId)
      pessoaToUpdate.merge(pessoaRequestData)

      await pessoaToUpdate.save()
      response.ok(pessoaToUpdate)

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error})

    }

  }


  async destroy({ params, response }) {

    const pessoaIdToDelete = params.id

    try {


      const pessoaToDelete = await Pessoa.findOrFail(pessoaIdToDelete)
      pessoaToDelete.deleted_at = new Date()
      await pessoaToDelete.save()
      response.ok({ confirmation_message: "Pessoa Desativada" })

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." +error })

    }

  }

  async recovery({ params, response }) {

    const pessoaToRecovery = await Pessoa.findOrFail(params.id)
    try {
      pessoaToRecovery.deleted_at = null
      await pessoaToRecovery.save()
      response.ok({ confirmation_message: "Pessoa Reativada" })
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno."})
    }

  }

  async search({ request, response }) {

    const searchParams = request.only(['deleted', 'tipo_pessoa'])
    const queryPessoa = Pessoa.query();
    for (const param in searchParams) {
      if (param === 'deleted'){
        searchParams[param] ? queryPessoa.whereNotNull('deleted_at') :  queryPessoa.whereNull('deleted_at') 
      }else
        queryPessoa.where(param, searchParams[param])
    }
    try {
      const queryResult = await queryPessoa.with('endereco')
                                            .orderBy('updated_at', 'desc')
                                            .fetch()
      response.ok(queryResult)
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." })
    }


  }
}

module.exports = PessoaController
