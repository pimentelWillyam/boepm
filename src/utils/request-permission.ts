import { PermissionsAndroid } from 'react-native'

const requestPermission = async (type: string): Promise<boolean> => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS[type],
    {
      title: `Permissão de ${type}`,
      message: `O Aplicativo do BOEPM precisa de acesso à ${type}`,
      buttonNeutral: 'Pergunte-me depois',
      buttonNegative: 'Não',
      buttonPositive: 'OK',
    },
  )
  if (granted === PermissionsAndroid.RESULTS.GRANTED) return true
  return false
}
export default requestPermission
