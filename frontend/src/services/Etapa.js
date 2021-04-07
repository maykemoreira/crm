import instanciaAxios from '@/plugins/axios'
const urlSufix = 'etapa'

export default {

  show (requestData) {
    return instanciaAxios.get(`${urlSufix}/${requestData}`)
  },
  index () {
    return instanciaAxios.get(`${urlSufix}`)
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
  },

  search (requestData) {
    return instanciaAxios.post(`${urlSufix}/search`, requestData)
  }

}
