import instanciaAxios from '@/plugins/axios'
const urlSufix = 'pessoa'

export default {

  index (tipoPessoa) {
    return instanciaAxios.get(`${urlSufix}/${tipoPessoa}`)
  },

  show (requestData) {
    return instanciaAxios.get(`${urlSufix}/${requestData}`)
  },

  search (requestData) {
    return instanciaAxios.post(`${urlSufix}/search`, requestData)
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
    return instanciaAxios.patch(`${urlSufix}/${requestData.id}`)
  }

}
