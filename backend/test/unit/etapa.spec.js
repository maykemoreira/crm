'use strict'
const { test, trait } = use('Test/Suite')('Etapa')
const Etapa = use("App/Models/Etapa")

trait('Test/ApiClient')

test('Criar Etapa', async ({ client, assert }) => {
  const response = await client.post('/etapa').send({
    nome: 'EtapaStubNome',
    descricao: 'EtapaSTUBDescricao'
  }).end()

  const responseId = response.body.id
  assert.exists(responseId, 'A etapa foi criada e o id foi retornado')

  const etapaDelete = await Etapa.find(responseId)
  await etapaDelete.delete()

})

test('Editar Etapa', async({ client, assert}) => {

  const responseCriar = await client.post('/etapa').send({
    nome: 'EtapaStubNome',
    descricao: 'EtapaSTUBDescricao'
  }).end()

  const etapaEditarId = responseCriar.body.id
  const etapaEditarBody = {
    ...responseCriar.body,
    nome: 'NomeEtapaEditado',
    descricao: 'DescricaoEditada'
  }

  const responseEditar = await client.put(`/etapa/${etapaEditarId}`).send(etapaEditarBody).end()
  
  assert.equal(responseEditar.body.nome, 'NomeEtapaEditado')
  assert.equal(responseEditar.body.descricao, 'DescricaoEditada')

  const etapaDeletar = await Etapa.find(etapaEditarId)
  await etapaDeletar.delete()

})


