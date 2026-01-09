'use client'

import { TextInput } from '@mantine/core'
import { useField } from '@payloadcms/ui'
import React from 'react'

const TextInputField = ({
  path,
  label,
  required,
}: {
  path: string
  label?: string
  required?: boolean | false
}) => {
  const { value, setValue, showError, errorMessage } = useField<string>()

  const formattedLabel =
    label ?? path.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

  return (
    <TextInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
      label={formattedLabel}
      required={required}
      error={showError ? errorMessage : undefined}
      my={20}
    />
  )
}

export default TextInputField
