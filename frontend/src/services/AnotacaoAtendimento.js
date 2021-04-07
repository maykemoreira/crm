import instanciaAxios from '@/plugins/axios'
const urlSufix = 'anotacao'

export default {

  destroy (requestData) {
    return instanciaAxios.delete(`${urlSufix}/${requestData.id}`)
  },
  store (requestData) {
    return instanciaAxios.post(urlSufix, requestData)
  },
  updateAll (requestData) {
    return instanciaAxios.put(`${urlSufix}/update-all`, requestData)
  }

}
