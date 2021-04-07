'use strict'
const Env = use('Env')
const AWS = require('aws-sdk')
const uuid = require('uuid/v1')
const BUCKET_ACCESS_KEY_ID = Env.get('BUCKET_ACCESS_KEY_ID')
const BUCKET_SECRET_ACCESS_KEY = Env.get('BUCKET_SECRET_ACCESS_KEY')
const BUCKET_NAME = Env.get('BUCKET_NAME')
const BUCKET_BASE_URL = Env.get('BUCKET_BASE_URL')
const Documento = use('App/Models/Documento')

class DocumentoController {

  async index({ response }) {

    const documentos = await Documento.all()
    response.ok(documentos)

  }

  async upload({ request, response }) {

    const { atendimento_id, anotacao_id, contentType, nome } = request.all();
    const key = `Atendimento_${atendimento_id}/Anotacao_${anotacao_id}/${uuid()}_${nome}`
    const operationName = 'putObject'
    const bucketProperty = {
      Bucket: BUCKET_NAME,
      ContentType: contentType,
      Key: key
    }

/*     const s3 = new AWS.S3({
          accessKeyId: BUCKET_ACCESS_KEY_ID,
          secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
          signatureVersion: 'v4',
          region: 'us-east-2'
        })  */

    const promiseUrl = new Promise((resolve, reject) => {
      s3.getSignedUrl(operationName, bucketProperty, (err, url) => {
        if (err) reject(err)
        resolve(url)
      })
    })

    response.implicitEnd = false

    promiseUrl.then(urlReturn => response.ok({ url: urlReturn, key }))
      .catch(() => response.internalServerError({ error_message: "Ocorreu um erro interno." }))

  }

  async search({ request, response, auth }) {

    const { anotacao_atendimento_id } = request.all();

    try {

        if (anotacao_atendimento_id) {
          const documentosAssociados = await Documento.query()
            .where('anotacao_atendimento_id', anotacao_atendimento_id)
            .select('id', 'url', 'nome', 'anotacao_atendimento_id')
            .fetch()

          response.ok(documentosAssociados);
        }
        else {
          response.noContent([])
        }

    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno." + error })
    }

  }

  async store({ request, response }) {

    const { nome, url, anotacao_atendimento_id } = request.all()

    try {
      const documentoCriado = await Documento.create({
        nome,
        url: `${BUCKET_BASE_URL}/${url}`,
        anotacao_atendimento_id
      })
      response.ok(documentoCriado)
    }
    catch (error) {
      response.internalServerError({ error_message: "Ocorreu um erro interno. " + error })

    }


  }

  async destroy({ params, response }) {

    const documentoId = params.id
    const documento = await Documento.first(documentoId)

    const key = documento.url.replace(BUCKET_BASE_URL + "/", "")

    const bucketProperty = {
      Bucket: BUCKET_NAME,
      Key: key
    }

/*        const s3 = new AWS.S3({
          accessKeyId: BUCKET_ACCESS_KEY_ID,
          secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
          signatureVersion: 'v4',
          region: 'us-east-2'
        })   */


    const promiseUrl = new Promise((resolve, reject) => {
      s3.deleteObject(bucketProperty, (err, url) => {
        err ? reject(err) : resolve(url)
      })
    })

    promiseUrl.then(() => documento.delete(documentoId))
      .then(() => response.ok({ confirmation_message: "Documento excluído com sucesso." + result }))
      .catch(() => response.internalServerError({ error_message: "Ocorreu um erro interno." }))
  }
}

module.exports = DocumentoController
