/* eslint-disable no-plusplus */
import React from 'react'
import { Text, TextInputProps, KeyboardTypeOptions } from 'react-native'
import {
  Controller,
  Control,
  FieldValues,
  DeepMap,
  FieldError,
  ValidationRule,
} from 'react-hook-form'

import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import { Container, InputInside, LabelInside } from './styles'

interface InputProps extends TextInputProps {
  name: string
  label: string
  defaultValue?: string
  type?: KeyboardTypeOptions | undefined
  control: Control<FieldValues>
  error: DeepMap<Record<string, unknown>, FieldError>
  rules?: {
    required?: string | ValidationRule<boolean> | undefined
    max?: ValidationRule<string | number> | undefined
    min?: ValidationRule<string | number> | undefined
    maxLength?: ValidationRule<string | number> | undefined
    pattern?: ValidationRule<RegExp> | undefined
  }
  ref?: React.Ref<TextInputMask> | undefined
  mtype?: TextInputMaskTypeProp
  options?: TextInputMaskOptionProp | undefined
}

const Input: React.FC<InputProps> = ({
  name,
  control,
  error,
  type,
  label,
  rules,
  defaultValue,
  ref,
  mtype,
  options,
  ...rest
}) => {
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
    arr.push('í')
    arr.push('Í')
    arr.push('ú')
    arr.push('Ú')
    arr.push('@')
    arr.push('.')
    arr.push('_')
    return arr
  }

  return (
    <Controller
      control={control}
      render={({ onChange, onBlur, value }) => (
        <Container>
          <LabelInside>
            {`${label} `}
            {rules?.required && (
              <Text
                style={{ color: '#f00', fontSize: responsiveFontSize(1.5) }}
              >
                (Obrigatório)
              </Text>
            )}
          </LabelInside>
          <InputInside
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType={type}
            autoCapitalize="characters"
            error={error}
            defaultValue=""
            ref={ref}
            type={mtype || 'custom'}
            options={
              mtype
                ? options
                : {
                    mask: 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
                    translation: {
                      // eslint-disable-next-line prettier/prettier
                      'S': function(val) {
                        return ascii().indexOf(val) >= 0 ? val : ''
                      },
                    },
                  }
            }
            {...rest}
          />
        </Container>
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue || ''}
    />
  )
}

export default Input
