'use strict'

const AnotacaoAtendimento = use('App/Models/AnotacaoAtendimento')

class AnotacaoAtendimentoController {

    async index({ response }) {
  
        try {
            const anotacoes = await AnotacaoAtendimento.query().orderBy('updated_at', 'desc').fetch()

            response.ok(anotacoes)
        }
        catch (error) {
            return error;
        }

    }
    async destroy({ params, response }) {

        try {
            const anotacaoExcluir = await AnotacaoAtendimento.findOrFail(params.id)
            await anotacaoExcluir.delete()
            response.ok({ confirmation_message: "Anotacao Excluída." })
        }
        catch (error) {
            response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
        }

    }

    async store({request, response }){
        
        const anotacaoDados = request.only(['conteudo', 'titulo', 'data', 'atendimento_id'])

        try {
            const anotacaoCriada = await AnotacaoAtendimento.create(anotacaoDados)
            response.ok(anotacaoCriada)
        }
        catch(error){
            response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
        }

    }


    async updateAll({ request, response}){

        try { 
          const anotacoesUpdate = request.only(['anotacoes']).anotacoes;
          const anotacoesPromises = anotacoesUpdate.map(anotacao => AnotacaoAtendimento.query().where('id',anotacao.id).update(anotacao));
          const anotacoesAtualizadas = Promise.all(anotacoesPromises)
          response.ok(anotacoesAtualizadas)
        }
        catch(error){
          response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
        }
    
      }


}

module.exports = AnotacaoAtendimentoController
