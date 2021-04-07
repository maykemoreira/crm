'use strict'

const Usuario = use('App/Models/Usuario')

class UsuarioController {

  async login({ request, auth, response }) {

    const { login, senha } = request.all()

    try {

      const token = await auth.attempt(login, senha)
      const usuario = await Usuario.query().where("login", login).first()
      const ativo = !usuario.deleted_at
      if(token && ativo){
        response.ok({
          permissao: usuario.permissao, 
          ...token, 
          id: usuario.id,
          nome: `${usuario.nome} ${usuario.sobrenome}`
        })
      }

    }

    catch (error) {
      response.unauthorized({ message: 'Usuário não autorizado' })
    }
  }

  async index({ response }) {

    try {

      const usuario = await Usuario.query().select(
        "id",
        "nome",
        "sobrenome",
        "email",
        "permissao",
      )
        .orderBy('updated_at', 'desc')
        .fetch()

      response.ok(usuario);

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." });

    }

  }

  async store({ request, response }) {

    const usuarioParaCriar = request.only(["nome",
      "sobrenome",
      "login",
      "email",
      "senha",
      "permissao"
    ]);

    try {
      const usuarioCriado = await Usuario.create(usuarioParaCriar);
      response.ok(usuarioCriado);
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });
    }

  }


  async show({ params, response }) {

    const id = params.id;

    try {

      const usuario = await Usuario.findOrFail(id);
      response.ok(usuario)

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." });

    }



  }



  async update({ params, request, response }) {

    const usuarioId = params.id;
    const usuarioRequisicaoDados = request.only(["nome", "sobrenome", "email", "senha", "permissao"]);

    try {

      const usuarioToUpdate = await Usuario.findOrFail(usuarioId);
      usuarioToUpdate.merge(usuarioRequisicaoDados);

      await usuarioToUpdate.save();
      return usuarioToUpdate;

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });

    }

  }


  async destroy({ params, response }) {

    const usuarioIdDelete = params.id;

    try {

      const usuarioDelete = await Usuario.findOrFail(usuarioIdDelete);
      usuarioDelete.deleted_at = new Date();
      await usuarioDelete.save();
      return response.ok({ confirmation_message: "Usuário desativado." })

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." });

    }

  }
  async recovery({ params, response }) {

    const usuarioIdRecovery = params.id;

    try {

      const usuarioRecovery = await Usuario.findOrFail(usuarioIdRecovery);
      usuarioRecovery.deleted_at = null;
      await usuarioRecovery.save();
      return response.ok({ confirmation_message: "Usuário reativado." })

    }
    catch (error) {

      response.internalServerError({ error_message: "Ocorreu um erro interno." + error });

    }

  }


  async search({ request, response }) {
    const searchParams = request.only(['deleted'])
    const queryUsuario = Usuario.query();
    for (const param in searchParams) {
      if (param === 'deleted') {
        searchParams[param] ? queryUsuario.whereNotNull('deleted_at') : queryUsuario.whereNull('deleted_at')
      } else
        queryUsuario.where(param, searchParams[param])
    }
    try {
      const queryResult = await queryUsuario.select('id','nome','sobrenome','email','permissao').orderBy('updated_at', 'desc')
        .fetch()

      response.ok(queryResult)
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." })
    }
  }
}

module.exports = UsuarioController
