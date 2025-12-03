import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

interface Result {
  status: number
  data: AxiosResponse | null
  loading: boolean
  error: boolean
  errorMessage: any | null
}

const useAxiosFetch = (url: string, timeout?: number): Result => {
  const [data, setData] = useState<AxiosResponse | null>(null)
  const [status, setStatus] = useState<number>(100)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unmounted = false
    const source = axios.CancelToken.source()
    axios
      .get(url, {
        cancelToken: source.token,
        timeout,
      })
      .then((a) => {
        if (!unmounted) {
          setStatus(a.status)
          setData(a.data)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!unmounted) {
          setError(true)
          setStatus(e.status)
          setErrorMessage(e.message)
          setLoading(false)
          if (axios.isCancel(e)) {
            console.log(`request cancelled:${e.message}`)
          } else {
            console.log(`another error happened:${e.message}`)
          }
        }
      })
    return () => {
      unmounted = true
      source.cancel('Cancelling in cleanup')
    }
  }, [url, timeout])

  return { status, data, loading, error, errorMessage }
}

export default useAxiosFetch
