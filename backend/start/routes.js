'use strict'

const Route = use('Route')


Route.get('/', ()=>{
    return { message: "CRM API"}
})

Route.group(() => {

    Route.get('', 'UsuarioController.index')
    Route.get(':id', 'UsuarioController.show')
    Route.post('', 'UsuarioController.store') 
    Route.put(':id', 'UsuarioController.update')
    Route.delete(':id', 'UsuarioController.destroy')
    Route.post('search', 'UsuarioController.search')
    Route.patch(':id', 'UsuarioController.recovery')

}).prefix('/usuario').middleware(['auth'])

Route.post('/usuario/login','UsuarioController.login')


Route.group(() => {

    Route.get('atendimento-documentos', 'AtendimentoController.showAtendimentoDocumentos')
    Route.get('', 'AtendimentoController.index')
    Route.get(':id', 'AtendimentoController.show')
    Route.post(':id/anotacao', 'AtendimentoController.showAnotacoes')
    Route.post('', 'AtendimentoController.store')
    Route.put(':id', 'AtendimentoController.update')
    Route.delete(':id', 'AtendimentoController.destroy')

}).prefix('/atendimento').middleware(['auth'])


Route.group(() => {

    Route.get('', 'EtapaController.index')
    Route.post('', 'EtapaController.store')
    Route.put(':id', 'EtapaController.update')
    Route.patch(':id', 'EtapaController.recovery')
    Route.delete(':id', 'EtapaController.destroy')
    Route.post('search', 'EtapaController.search')
    Route.get(':id', 'EtapaController.show')

}).prefix('/etapa').middleware(['auth'])

Route.group(()=>{

    Route.post('', 'PessoaController.store')
    Route.get(':id', 'PessoaController.show')
    Route.put(':id', 'PessoaController.update')
    Route.delete(':id', 'PessoaController.destroy')
    Route.patch(':id', 'PessoaController.recovery')
    Route.post('search', 'PessoaController.search')

}).prefix('/pessoa').middleware(['auth'])

Route.group(()=>{

    Route.get('','AnotacaoAtendimentoController.index')
    Route.delete(':id', 'AnotacaoAtendimentoController.destroy')
    Route.post('', 'AnotacaoAtendimentoController.store')
    Route.put('update-all', 'AnotacaoAtendimentoController.updateAll')

}).prefix('/anotacao').middleware(['auth'])


Route.group(()=>{

    Route.post('upload','DocumentoController.upload')
    Route.delete(':id', 'DocumentoController.destroy')
    Route.post('search', 'DocumentoController.search')
    Route.post('', 'DocumentoController.store')
    Route.get('','DocumentoController.index')
    
}).prefix('/documento').middleware(['auth'])


Route.any('*', () => {
    return {message: 'Endpoint inválido'}
})
