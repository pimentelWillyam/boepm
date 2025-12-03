import { AxiosHttpClient } from '../../infra/adapters/http'
import { HttpClient } from '../../data/protocols/http-client'

export const makeHttpClient = (): HttpClient => new AxiosHttpClient()
