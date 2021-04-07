export default {

  computed: {
    credenciaisUsuario () {
      const credenciais = JSON.parse(localStorage.getItem('credentials'))
      return {
        id: credenciais && credenciais.id,
        nome: credenciais && credenciais.nome,
        permissao: credenciais && credenciais.permissao,
        permiteEdicao: credenciais && credenciais.permissao && credenciais.permissao === 'administrador',
        permiteExclusao: credenciais && credenciais.permissao && credenciais.permissao === 'administrador'

      }
    }
  }

}
