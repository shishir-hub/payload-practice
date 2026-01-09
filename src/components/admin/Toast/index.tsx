'use client'

import { Alert } from '@mantine/core'
import React, { useState } from 'react'

const Toast = (props: any) => {
  const [visible, setVisible] = useState(false)

  console.log(props)

  return (
    <Alert variant="light" color="red" radius="md" withCloseButton title="Alert title">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis, quae tempore
      necessitatibus placeat saepe.
    </Alert>
  )
}

export default Toast
