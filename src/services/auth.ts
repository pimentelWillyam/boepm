import { AxiosResponse } from 'axios'
import api from './api'

export interface InputLoginData {
  user: string
  senha: string
  lat: string
  lon: string
}

export async function onLogin(data: InputLoginData): Promise<AxiosResponse> {
  const response = await api.post('/login', {
    login: data.user,
    senha: data.senha,
    lat: data.lat,
    lon: data.lon,
  })
  return response
}
