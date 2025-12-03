import React from 'react'
import { DeepMap, FieldError } from 'react-hook-form'
import { TextInputProps, Text, TouchableOpacity } from 'react-native'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import { Container, TextInput, Icon } from './styles'

interface InputProps extends TextInputProps {
  icon: string
  iconPassword?: string
  error: DeepMap<Record<string, unknown>, FieldError>
  handleShow?(): void
}

const InputLogin: React.FC<InputProps> = ({
  icon,
  iconPassword,
  error,
  handleShow,
  ...rest
}) => (
  <Container
    style={
      !!error && {
        borderColor: '#f17a5f',
        borderWidth: 1,
      }
    }
  >
    <Icon name={icon} size={responsiveFontSize(3)} color="#ddd" />
    <TextInput placeholderTextColor="#969FAA" {...rest} />
    {iconPassword && (
      <TouchableOpacity onPress={handleShow}>
        <Icon name={iconPassword} size={responsiveFontSize(3)} color="#bbb" />
      </TouchableOpacity>
    )}
  </Container>
)

export default InputLogin
