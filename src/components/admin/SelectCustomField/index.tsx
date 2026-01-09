'use client'

import { Select } from '@mantine/core'
import React from 'react'

import { useField } from '@payloadcms/ui'

type OptionsProps = {
  label: string
  value: string
}

const SelectCustomField = ({
  path,
  label,
  required,
  options,
}: {
  path: string
  label?: string | null
  required?: boolean | false
  options: string[] | OptionsProps[]
}) => {
  const { value, setValue, showError, errorMessage } = useField<string>()

  const formattedLabel =
    label ?? path.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

  return (
    <Select
      label={formattedLabel}
      data={options}
      defaultValue={value}
      onChange={(value) => setValue(value)}
      error={showError ? errorMessage : null}
      required={required}
      my={20}
      maxDropdownHeight={200}
    />
  )
}

export default SelectCustomField
