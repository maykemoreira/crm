'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

const Factory = use('Factory')
const Hash = use('Hash')
const Database = use('Database')

Factory.blueprint('App/Models/Usuario', async (faker) => {

    const name = faker.name();
    const login = name.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 1000);
    const permissao = ['administrador', 'usuario_comum']
    const permissaoAleatoria = Math.floor(Math.random() * permissao.length)
    return {
        nome: name,
        sobrenome: faker.last(),
        login,
        email: faker.email(),
        senha: 'abc',//await Hash.make(faker.password()),
        deleted_at: null,
        permissao: permissao[permissaoAleatoria]
    }
})


/* Factory.blueprint('App/Models/Etapa', async (faker) => {

const etapasOpcoes = [
                        "Apresentação de Proposta", 
                        "Elaboração de Proposta", 
                        "Primeiro Contato", 
                        "Levantamento de Requisitos",
                        "Precificação",
                        "Elaboração de Contrato",
                        "Proposta Aceita",
                        "Proposta Rejeitada"
                    ]
const etapaSorteada = Math.floor(Math.random()*(etapasOpcoes.length));

    return {
        nome: `${etapasOpcoes[etapaSorteada]} - ${Math.floor(Math.random()*200)}`,
        descricao: faker.sentence()
    }
}) */


Factory.blueprint('App/Models/Endereco', async (faker) => {

    const cidades = ["Viçosa", "Ubá", "Manhuaçu"];

    return {
        pais: "Brasil",
        uf: "MG",
        cidade: cidades[Math.floor(Math.random() * cidades.length)],
        bairro: "Bairro",
        logradouro: "Rua Teste",
        cep: faker.zip()
    }
})


Factory.blueprint('App/Models/Pessoa', async (faker) => {

    const endereco = await Factory
        .model('App/Models/Endereco')
        .create()

    const tipoPessoa = Math.random() > 0.5 ? 'fisica' : 'juridica';
    const rgFaker = tipoPessoa === 'fisica' ? faker.ssn() : null
    const nomeEmpresa = faker.company()
    const nomeFis = faker.name()
    const nomeSobrenome = faker.last()

    return {
        email: faker.email(),
        telefone: faker.phone({ country: "br" }),
        deleted_at: null,
        razaosocial_nome: tipoPessoa === 'fisica' ? 'fis_' + nomeFis : 'jur_' + nomeEmpresa,
        nomefantasia_sobrenome: tipoPessoa === 'fisica' ? nomeSobrenome : nomeEmpresa,
        cnpj_cpf: faker.cpf(),
        rg: rgFaker,
        tipo_pessoa: tipoPessoa,
        endereco_id: endereco.id
    }
})




Factory.blueprint('App/Models/Atendimento', async (faker) => {

    const usuario = await Factory
        .model('App/Models/Usuario')
        .create()

    const pessoa = await Factory
        .model('App/Models/Pessoa')
        .create()

    /*     const etapa = await Factory
        .model('App/Models/Etapa')
        .create() */
    let etapaId = Math.floor(Math.random() * 7)
    if (etapaId > 6) {
        etapaId = 6
    }
    else if (etapaId === 0)
        etapaId = 1

    const status = Math.random() > 0.2 ? "aberto" : "concluido"
    const data_inicio = new Date()
    const data_fim = new Date()
    return {
        usuario_id: Math.random() > 0.4 ? 2 : usuario.id,
        pessoa_id: pessoa.id,
        descricao: faker.sentence({ words: Math.floor(Math.random() * 50) }),
        etapa_id: etapaId,
        data_inicio: data_inicio,
        data_fim: data_fim,
        status: status
    }
})



Factory.blueprint('App/Models/AnotacaoAtendimento', async (faker) => {


    return {
        titulo: faker.sentence({ words: 5 }),
        conteudo: faker.sentence({ words: Math.floor(Math.random() * 200) }),
        data: new Date(faker.timestamp() + 1000000000000 + Math.floor(Math.random() * 500000000000)),
        atendimento_id: Math.random() > 0.5 ? 1 : 2
    }


})

Factory.blueprint('App/Models/Documento', async (faker) => {


    const anotacaoAtendimento = await Factory
        .model('App/Models/AnotacaoAtendimento')
        .create()
    const extensoes = ["pdf", "jpg", "mp4", "xlsx", "csv", "txt", "xls", "png"]

    return {
        anotacao_atendimento_id: anotacaoAtendimento.id,
        nome: `Documento ${Math.floor(Math.random() * 10)}.${extensoes[Math.floor(Math.random() * extensoes.length)]}`,
        url: faker.email()
    }
})
