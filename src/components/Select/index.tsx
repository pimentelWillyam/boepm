import React from 'react'
import { View, StyleProp } from 'react-native'
import {
  ItemValue,
  PickerProps,
} from '@react-native-picker/picker/typings/Picker'
import {
  Controller,
  Control,
  FieldValues,
  DeepMap,
  FieldError,
  ValidationRule,
} from 'react-hook-form'
import { responsiveWidth } from 'react-native-responsive-dimensions'

import { Container, LabelInside, ContainerPicker } from './styles'

interface SelectProps extends PickerProps {
  name: string
  label: string
  defaultValue?: string
  control: Control<FieldValues>
  error: DeepMap<Record<string, unknown>, FieldError>
  rules?: {
    required?: string | ValidationRule<boolean> | undefined
  }
  children: React.ReactNode
  prompt: string
  onValueChange?:
    | (((itemValue: any, itemPosition: number) => void) &
        ((itemValue: ItemValue, itemIndex: number) => void))
    | undefined
  selectedValue?: ItemValue | undefined
  style?: StyleProp<{ width: number }>
}

const Select: React.FC<SelectProps> = ({
  name,
  control,
  error,
  label,
  rules,
  defaultValue,
  children,
  prompt,
  selectedValue,
  onValueChange,
  style,
}) => {
  return (
    <Controller
      control={control}
      render={({ onChange, value }) => (
        <Container>
          <LabelInside>{label}</LabelInside>
          {/* <LabelInside>
            {`${label} `}
            {rules?.required && (
              <Text
                style={{ color: '#f00', fontSize: responsiveFontSize(1.5) }}
              >
                *
              </Text>
            )}
          </LabelInside> */}

          <View
            style={[
              {
                backgroundColor: '#fff',
                borderRadius: 5,
                height: 40,
                width: responsiveWidth(90),
                marginBottom: 10,
                paddingLeft: 5,
                borderWidth: 1,
                borderColor: '#dfdfdf',
              },
              style,
            ]}
          >
            <ContainerPicker
              error={error}
              prompt={prompt}
              selectedValue={selectedValue || value}
              itemStyle={{ flex: 1 }}
              onValueChange={
                onValueChange || ((itemValue: ItemValue) => onChange(itemValue))
              }
            >
              {children}
            </ContainerPicker>
          </View>
        </Container>
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue || '0'}
    />
  )
}

export default Select
