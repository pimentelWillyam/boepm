/* eslint-disable no-plusplus */
import React, { useState } from 'react'

import { Control, DeepMap, FieldError, FieldValues } from 'react-hook-form'
import {
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import Icon from 'react-native-vector-icons/Feather'
import { TextInputProps } from 'react-native'
import { InternalInput, styles, BoxContainer } from './styles'
import Input from '../Input'

interface BoxProps extends TextInputProps {
  control: Control<FieldValues>
  error: DeepMap<Record<string, unknown>, FieldError>
  label: string
  name: string
  maxLength?: number | undefined
  mtype?: TextInputMaskTypeProp
  options?: TextInputMaskOptionProp | undefined
  isPassword?: boolean
  // handleShow?(): void
}

const BoxInput: React.FC<BoxProps> = ({
  control,
  error,
  label,
  name,
  mtype,
  options,
  maxLength,
  children,
  isPassword,
  ...rest
}) => {
  const [show, setShowPassword] = useState(false)

  const showPassword = () => setShowPassword(!show)

  const printS = (times: number): string => {
    let str = ''
    for (let i = 0; i < times; i++) str = str.concat('S')
    return str
  }

  function ascii(): String[] {
    const arr: String[] = []
    for (let i = 65; i < 91; i++) {
      arr.push(String.fromCharCode(i))
    }
    for (let i = 97; i < 97 + 26; i++) {
      arr.push(String.fromCharCode(i))
    }
    for (let i = 0; i < 10; i++) {
      arr.push(String(i))
    }
    arr.push(' ')
    arr.push('.')
    arr.push(',')
    arr.push('á')
    arr.push('à')
    arr.push('ã')
    arr.push('â')
    arr.push('Á')
    arr.push('À')
    arr.push('Ã')
    arr.push('Â')
    arr.push('é')
    arr.push('ê')
    arr.push('É')
    arr.push('Ê')
    arr.push('ó')
    arr.push('ô')
    arr.push('õ')
    arr.push('Ó')
    arr.push('Õ')
    arr.push('Ô')
    arr.push('ç')
    arr.push('Ç')
    arr.push('-')
    arr.push('^')
    arr.push('~')
    arr.push('_')
    arr.push('#')
    arr.push('$')
    arr.push('*')
    arr.push('%')
    arr.push('!')
    arr.push('@')
    arr.push('(')
    arr.push(')')
    arr.push('í')
    arr.push('Í')
    arr.push('ú')
    arr.push('Ú')
    arr.push(':')
    arr.push('/')
    arr.push(';')
    arr.push(String.fromCharCode(10))
    return arr
  }

  return (
    <BoxContainer>
      <InternalInput style={styles.shadowLoading}>
        <Input
          name={name}
          label={label}
          control={control}
          autoCapitalize="none"
          keyboardType={!isPassword ? 'number-pad' : 'default'}
          error={error}
          maxLength={maxLength || 17}
          secureTextEntry={isPassword}
          style={{ width: responsiveWidth(82) }}
          rules={{ required: true }}
          mtype={mtype || (!isPassword ? 'only-numbers' : 'custom')}
          options={
            !isPassword
              ? undefined
              : {
                  mask: printS(20),
                  translation: {
                    // eslint-disable-next-line prettier/prettier
                  // eslint-disable-next-line func-names
                    S(val) {
                      return ascii().indexOf(val) >= 0 ? val : ''
                    },
                  },
                }
          }
          {...rest}
        />
        {children}
      </InternalInput>
    </BoxContainer>
  )
}

export default BoxInput
