import instanciaAxios from '@/plugins/axios'
const urlSufix = 'atendimento'

export default {

  index () {
    return instanciaAxios.get(`${urlSufix}`)
  },

  closeAtendimento (requestData) {
    return instanciaAxios.patch(`${urlSufix}/${requestData}/fechar-atendimento`)
  },

  show (requestData) {
    return instanciaAxios.get(`${urlSufix}/${requestData}`)
  },

  store (requestData) {
    return instanciaAxios.post(urlSufix, requestData)
  },

  update (requestData) {
    return instanciaAxios.put(`${urlSufix}/${requestData.id}`, requestData)
  },

  destroy (requestData) {
    return instanciaAxios.delete(`${urlSufix}/${requestData.id}`)
  },

  recovery (requestData) {
    return instanciaAxios.put(`${urlSufix}/${requestData.id}`)
  },

  search (requestData) {
    return instanciaAxios.post(`${urlSufix}/search`, requestData)
  },

  showAnotacoes (requestData) {
    return instanciaAxios.post(`${urlSufix}/${requestData.id}/anotacao`, requestData)
  },

  showAtendimentoDocumentos () {
    return instanciaAxios.get(`${urlSufix}/atendimento-documentos`)
  }

}
