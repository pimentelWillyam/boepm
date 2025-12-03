import { StyleSheet } from 'react-native'
import styled, { css } from 'styled-components/native'

interface LoadingContainerProps {
  active: boolean
}

export const LoadingContainer = styled.View<LoadingContainerProps>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`
export const BoxLoading = styled.View`
  background-color: #fff;
  border-radius: 10px;
  width: 70%;
  flex-direction: row;
  align-items: center;
  padding: 20px;
`

export const TextLoading = styled.Text`
  padding: 0px 10px;
  margin: 0 auto;
  color: #666;
`

export const styles = StyleSheet.create({
  shadowLoading: {
    shadowColor: '#ff0000',
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16.0,

    elevation: 24,
  },
  active: {
    backgroundColor: '#f00',
  },
})
