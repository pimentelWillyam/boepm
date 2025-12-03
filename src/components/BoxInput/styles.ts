import { StyleSheet } from 'react-native'
import styled, { css } from 'styled-components/native'

export const BoxContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`
export const InternalInput = styled.View`
  background-color: #f2f2f2;
  border-radius: 6px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  width: 90%;
`

export const TextLoading = styled.Text`
  margin-left: 20px;
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
