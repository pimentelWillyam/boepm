import styled, { css } from 'styled-components/native'
import { DeepMap, FieldError } from 'react-hook-form'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'
import { Picker } from '@react-native-picker/picker';

export const Container = styled.View``

interface SelectProps {
  error: DeepMap<Record<string, unknown>, FieldError>
  prompt: string
  selectedValue: ItemValue | undefined
  onValueChange?:
    | ((itemValue: ItemValue, itemIndex: number) => void)
    | undefined
}

export const ContainerPicker = styled(Picker)<SelectProps>`
  height: 40px;
  border: 1px solid #f00;
`

export const LabelInside = styled.Text`
  margin-bottom: 3px;
  font-size: 13px;
  align-self: flex-start;
  color: #aaa;
`
