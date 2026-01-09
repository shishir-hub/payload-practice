'use client'

import { InputBase } from '@mantine/core'
import { useField } from '@payloadcms/ui'
import React from 'react'
import { IMaskInput } from 'react-imask'

const PhoneNumberField = ({
  path,
  label,
  required,
  width,
}: {
  path: string
  label?: string
  required?: boolean | false
  width?: string | '100%'
}) => {
  const { value, setValue, showError, errorMessage } = useField<string>()

  const formattedLabel =
    label ?? path.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

  return (
    <InputBase
      component={IMaskInput}
      placeholder="(XXX) XXX-XXXX"
      mask={'(000) 000-0000'}
      onAccept={(value) => setValue(value)}
      value={value}
      label={formattedLabel}
      required={required}
      error={showError ? errorMessage : undefined}
      my={20}
      w={width}
    />
  )
}

export default PhoneNumberField
