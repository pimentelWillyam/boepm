import axios from 'axios'
import Config from '../config'

const api = axios.create({
  baseURL: Config.urlEnvironments[Config.ENVIRONMENT].urlBase,
  timeout: 8000,
  validateStatus: () => true,
  headers: {
    version: Config.APP_VERSION,
  },
})

export default api
