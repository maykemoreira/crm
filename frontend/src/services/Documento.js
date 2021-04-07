import instanciaAxios from '@/plugins/axios'
const urlSufix = 'documento'

export default {

  upload (requestData) {
    return instanciaAxios.post(`${urlSufix}/upload`, requestData)
  },
  destroy  (requestData) {
    return instanciaAxios.delete(`${urlSufix}/${requestData}`)
  },
  search (requestData) {
    return instanciaAxios.post(`${urlSufix}/search`, requestData)
  },
  store (requestData) {
    return instanciaAxios.post(`${urlSufix}`, requestData)
  }

}
