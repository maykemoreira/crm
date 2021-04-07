'use strict'



const Atendimento = use('App/Models/Atendimento')
const AnotacaoAtendimento = use('App/Models/AnotacaoAtendimento')
const statusValidos = ['aberto', 'concluido']


class AtendimentoController {

  async index({ response, auth }) {

    try {

      const permissao = auth.user.permissao
      const usuarioId = auth.user.id
      const atendimentosQuery = Atendimento.query().select('id', 'etapa_id', 'pessoa_id', 'usuario_id', 'status', 'data_inicio')
        .with('pessoa', pessoaQuery => {
          pessoaQuery.select('id', 'razaosocial_nome')
        })
        .with('atendente', atendenteQuery => {
          atendenteQuery.select('id', 'nome')
        })
        .with('etapa', etapaQuery => {
          etapaQuery.select('id', 'nome')
        })
        .orderBy('updated_at', 'desc')
      if (permissao !== "administrador") {
        atendimentosQuery.where('usuario_id', usuarioId)
      }
      const atendimentos = await atendimentosQuery.fetch()

      response.ok(atendimentos)
    }

    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });

    }

  }


  async showAtendimentoDocumentos({ response, auth }) {


    try {

      let atendimentoQuery
      if (auth.user.permissao === 'administrador') {
        atendimentoQuery = Atendimento.query()
          .has('documentos')
          .with('documentos')
          .with('pessoa', pessoaQuery => {
            pessoaQuery.select('id', 'razaosocial_nome', 'tipo_pessoa', 'nomefantasia_sobrenome', 'razaosocial_nome')
          })
          .with('atendente', atendenteQuery => {
            atendenteQuery.select('id', 'nome', 'sobrenome')
          })
      }
      else {
        atendimentoQuery = Atendimento.query().where('usuario_id', auth.user.id).has('documentos')
          .with('documentos')
          .with('pessoa', pessoaQuery => {
            pessoaQuery.select('id', 'razaosocial_nome', 'tipo_pessoa', 'nomefantasia_sobrenome', 'razaosocial_nome')
          })
          .with('atendente', atendenteQuery => {
            atendenteQuery.select('id', 'nome', 'sobrenome')
          })

      }

      const atendimentoDocumentos = await atendimentoQuery.fetch()
      const listaDeAtendimentos = atendimentoDocumentos.toJSON()

      const documentosResultantes = listaDeAtendimentos.map(atendimento => {
        return atendimento.documentos.map(documento => ({
          id: documento.id,
          atendimento_id: atendimento.id,
          pessoa: atendimento.pessoa.tipo_pessoa === 'fisica' ? 
                  `${atendimento.pessoa.razaosocial_nome} ${atendimento.pessoa.nomefantasia_sobrenome.slice(0,1).toUpperCase()}`:
                  `${atendimento.pessoa.razaosocial_nome}`,
          atendente: `${atendimento.atendente.nome} ${atendimento.atendente.sobrenome.slice(0,1).toUpperCase()}.`,
          url: documento.url,
          nome: documento.nome,
          dataEnvio: documento.created_at
        }))

      })

      const documentosMerge = documentosResultantes.reduce((lista,documento)=>{

        lista.push(...documento)
        return lista
        
      },[])

      response.ok(documentosMerge)

    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
    }

  }

  async store({ request, response }) {

    const camposObrigatorios = [
      'usuario_id',
      'pessoa_id',
      'etapa_id',
      'data_inicio',
      'data_fim',
      'codigo',
      'descricao',
      'etapa_id',
      'status'
    ]

    const atendimentoToCreateData = request.only(camposObrigatorios)

    if (atendimentoToCreateData.status) {
      if (statusValidos.indexOf(atendimentoToCreateData.status) === -1)
        response.badRequest({ error_message: 'Status inválido' })
    }


    try {

      const atendimentoCreated = await Atendimento.create(atendimentoToCreateData);
      response.ok(atendimentoCreated)

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });

    }

  }


  async show({ params, response }) {

    const atendimentoId = params.id;

    try {

      const atendimento = await Atendimento.query().where('id', atendimentoId)
        .with('atendente', atendenteQuery => {
          atendenteQuery.select('id', 'nome', 'sobrenome')
        })
        .with('pessoa', pessoaQuery => {
          pessoaQuery.select('id', 'razaosocial_nome', 'nomefantasia_sobrenome', 'tipo_pessoa')
        })
        .with('anotacoes', anotacoesQuery => {
          anotacoesQuery.orderBy('data', 'desc')
        })
        .fetch();
      response.ok(atendimento);

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." });

    }

  }

  async update({ params, request, response }) {

    const atendimentoEditarId = params.id;
    const atendimentoEditar = request.only([
      'usuario_id',
      'pessoa_id',
      'etapa_id',
      'data_inicio',
      'data_fim',
      'codigo',
      'descricao',
      'etapa_id',
      "status"
    ])


    if (statusValidos.indexOf(atendimentoEditar.status) === -1)
      response.badRequest({ error_message: 'Status inválido' });

    try {

      const atendimento = await Atendimento.findOrFail(atendimentoEditarId)
      atendimento.merge(atendimentoEditar)
      await atendimento.save(atendimentoEditar)
      response.ok(atendimento);

    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
    }

  }

  async destroy({ params, response }) {

    const atendimentoIdDelete = params.id;

    try {

      const atendimentoToDelete = await Atendimento.findOrFail(atendimentoIdDelete);
      await atendimentoToDelete.delete()

      response.ok({ confirmation_message: 'Atendimento Excluído.' })

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });

    }
  }

  async showAnotacoes({ params, request, response }) {

    const { timeline } = request.all()
    
    try {
      const atendimentoId = params.id
      let anotacoesQuery

      if(timeline === false){
         anotacoesQuery= await AnotacaoAtendimento.query()
          .where("atendimento_id", atendimentoId)
          .orderBy("data", 'desc').fetch()

          response.ok(anotacoesQuery)
      }
      else{

        anotacoesQuery = await AnotacaoAtendimento.query()
          .where("atendimento_id", atendimentoId)
          .orderBy("data", 'desc')
          .with('documentos').fetch()

        response.ok(anotacoesQuery)
      }
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
    }

  }

}

module.exports = AtendimentoController
