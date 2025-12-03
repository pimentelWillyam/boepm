import React from 'react'

import { ActivityIndicator } from 'react-native'
import { BoxLoading, styles, TextLoading, LoadingContainer } from './styles'

interface LoadingProps {
  animating: boolean
  text: string
}

const Loading: React.FC<LoadingProps> = ({ animating, text, ...rest }) => {
  return (
    <LoadingContainer active={animating} {...rest}>
      <BoxLoading style={styles.shadowLoading}>
        <ActivityIndicator size="large" color="#aaa" animating />
        <TextLoading>{text}</TextLoading>
      </BoxLoading>
    </LoadingContainer>
  )
}

export default Loading
