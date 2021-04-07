'use strict'

const Etapa = use('App/Models/Etapa')

class EtapaController {

  async index ({  response }) {

    try {
      const etapas = await Etapa.query()
        .select('id','nome','descricao') 
        .orderBy('updated_at','desc').fetch()
                              
      response.ok(etapas)
    }
    catch(error){
      response.internalServerError({error_message: "Ocorreu um erro interno."})
    }

  }

  async show({params, response}){

    try {
      const etapa = await Etapa.findOrFail(params.id)
      response.ok(etapa)
    }
    catch(error){
      response.internalServerError({error_message: "Ocorreu um erro interno."})

    }

  }

  async store ({ request, response }) {
    
    try {
      const etapaStoreData = request.only(['nome', 'descricao'])
      const etapaStored = await Etapa.create(etapaStoreData)
      response.ok(etapaStored)
    }
    catch(error){

      response.internalServerError({error_message: "Ocorreu um erro interno."})

    }

  }


  async update ({ params, request, response }) {

    const etapaId = params.id
    const etapaRequestData = request.only(["nome", "descricao"])

    try {

      const etapaUpdate = await Etapa.findOrFail(etapaId)
      etapaUpdate.merge(etapaRequestData)

      await etapaUpdate.save()
      response.ok(etapaUpdate)

    }
    catch(error){

      response.internalServerError({error_message: "Ocorreu um erro interno."})

    }

  }

  async destroy({ params, response }){

    const etapaIdDestroy= params.id

    try{
      const etapaDestroy = await Etapa.findOrFail(etapaIdDestroy)
      etapaDestroy.deleted_at = new Date()
      await etapaDestroy.save()
      response.ok({confirmation_message: "Etapa desativada."}) 
    }
    catch(error){
      response.internalServerError({error_message: "Ocorreu um erro interno."})
    }

  }
  async recovery({ params, response}){

    const etapaIdRecovery = params.id
    
    try{
      const etapaRecovery = await Etapa.findOrFail(etapaIdRecovery)
      etapaRecovery.deleted_at = null;
      await etapaRecovery.save();
      response.ok({confirmation_message: "Etapa reativada."})
    }
    catch(error){
      response.internalServerError({error_message: "Ocorreu um erro interno."})
    }

  }

  async search({ request, response }) {

    const searchParams = request.only(['deleted'])
    const queryEtapa = Etapa.query();
    for (const param in searchParams) {
      if (param === 'deleted'){
        searchParams[param] ? queryEtapa.whereNotNull('deleted_at') : queryEtapa.whereNull('deleted_at') 
      }else
      queryEtapa.where(param, searchParams[param])
    }
    try {
      const queryResult = await queryEtapa.orderBy('updated_at', 'desc')
                                          .fetch()
      response.ok(queryResult)
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." })
    }


  }

}


module.exports = EtapaController
