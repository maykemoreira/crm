const headers = {

  fisica: [
    { text: 'Nome', value: 'razaosocial_nome' },
    { text: 'Sobrenome', value: 'nomefantasia_sobrenome' },
    { text: 'CPF', value: 'cnpj_cpf' },
    { text: 'Telefone', value: 'telefone' },
    { text: 'Email', value: 'email' },
    {
      text: 'Ações',
      value: 'actions',
      sortable: false
    }
  ],
  juridica: [
    { text: 'Razão Social', value: 'razaosocial_nome' },
    { text: 'Nome Fantasia', value: 'nomefantasia_sobrenome' },
    { text: 'CNPJ', value: 'cnpj_cpf' },
    { text: 'Telefone', value: 'telefone' },
    { text: 'Email', value: 'email' },
    {
      text: 'Ações',
      value: 'actions',
      sortable: false
    }
  ],
  etapas: [
    { text: 'Nome', value: 'nome' },
    {
      text: 'Ações',
      value: 'actions',
      sortable: false
    }
  ],
  usuarios: [
    { text: 'Nome', value: 'nome' },
    { text: 'Sobrenome', value: 'sobrenome' },
    { text: 'Email', value: 'email' },
    { text: 'Permissão', value: 'permissao' },
    {
      text: 'Ações',
      value: 'actions',
      sortable: false
    }
  ],
  atendimentos: [
    { text: 'Data de Início', value: 'data_inicio' },
    { text: 'Pessoa', value: 'pessoa.nome' },
    { text: 'Atendente', value: 'atendente.nome' },
    { text: 'Etapa', value: 'etapa.nome' },
    { text: 'Status', value: 'status' },
    {
      text: 'Ações',
      value: 'actions',
      sortable: false,
      align: 'start'
    }
  ],
  documentosAdmin: [
    { text: 'Data de envio', value: 'dataEnvio', align: 'center' },
    { text: 'Nome', value: 'nome', align: 'center' },
    { text: 'Código do Atendimento', value: 'atendimento_id', align: 'center' },
    { text: 'Enviado por', value: 'atendente', align: 'center' },
    { text: 'Pessoa', value: 'pessoa', align: 'center' },
    {
      text: 'Download',
      value: 'actions',
      sortable: false,
      align: 'center'
    }
  ],
  documentos: [
    { text: 'Data de envio', value: 'dataEnvio', align: 'center' },
    { text: 'Nome', value: 'nome', align: 'center' },
    { text: 'Código do Atendimento', value: 'atendimento_id', align: 'center' },
    { text: 'Pessoa', value: 'pessoa', align: 'center' },
    {
      text: 'Download',
      value: 'actions',
      sortable: false,
      align: 'center'
    }
  ]

}

export default headers
