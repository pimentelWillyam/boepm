import React from 'react'

import { ActivityIndicator, Modal, View } from 'react-native'

interface LoadingProps {
  show: boolean
  text: string
}

const SelectSearch: React.FC<LoadingProps> = ({ animating, text, ...rest }) => {
  return <View />
}

export default SelectSearch
