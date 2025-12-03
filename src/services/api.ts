import axios from 'axios'
import packagejson from '../../package.json'
import Config from '../config'

const api = axios.create({
  baseURL: Config.urlEnvironments[Config.ENVIRONMENT].urlBase,
  timeout: 8000,
  validateStatus: () => true,
  headers: {
    version: packagejson.version,
  },
})

export default api
