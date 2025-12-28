/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import {
  HttpRequest,
  HttpResponse,
  HttpClient,
} from '../../../data/protocols/http-client'
import Config from '../../../../config'

export class AxiosHttpClient<T = any> implements HttpClient {
  request = async (data: HttpRequest): Promise<HttpResponse> => {
    try {
      const axiosResponse = await axios.request<T>({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: {
          ...data.headers,
          version: Config.APP_VERSION,
          'Content-Type': 'application/json',
        },
      })

      return {
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      }
    } catch (error: any) {
      return {
        statusCode: 500,
        body: error.response,
      }
    }
  }
}
