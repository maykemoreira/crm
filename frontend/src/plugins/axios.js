// import Vue from 'vue'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:3333',
  headers: {
    Accept: 'application/json'
  },
  responseType: 'json'
})

http.interceptors.request.use(interceptor => {
  const userCredentials = JSON.parse(localStorage.getItem('credentials'))
  if (userCredentials && userCredentials.token) { interceptor.headers.Authorization = `Bearer ${userCredentials.token}` }
  return interceptor
},
error => Promise.reject(error)

)

export default http

/* Vue.use({
  install (Vue) {
    Vue.prototype.$http = http
  }
})
 */
