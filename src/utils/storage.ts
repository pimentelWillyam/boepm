import AsyncStorage from '@react-native-community/async-storage'

class Storage {
  set = async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value)
      return true
    } catch (error) {
      return false
    }
  }

  get = async (key: string): Promise<string> => {
    try {
      const ret = await AsyncStorage.getItem(key)
      if (ret === null) return ''
      return ret
    } catch (error) {
      return ''
    }
  }
}

export default new Storage()
