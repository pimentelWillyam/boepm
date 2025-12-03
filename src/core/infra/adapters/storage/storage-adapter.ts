import AsyncStorage from '@react-native-community/async-storage'
import { Storage } from '../../../data/protocols/storage'

export class StorageAdapter implements Storage {
  get = async (key: string): Promise<string> => {
    const data = await AsyncStorage.getItem(key)
    if (data) return data
    return ''
  }

  set = async (key: string, value: string): Promise<void> => {
    AsyncStorage.setItem(key, value)
  }
}
