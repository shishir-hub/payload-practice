'use client'

import { addUser } from '@/store/slice/userSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { Box, Button, Group, Textarea, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Properties = {
  title: string
  description: string
  tag: string
  city: string
}

const AddProperty = () => {
  const router = useRouter()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      tag: '',
      city: '',
    },

    validate: {
      title: isNotEmpty('Property title is required!'),
      city: isNotEmpty('City name is required!'),
      tag: (value) => (value.length > 0 ? null : 'Atleast one tag is required!'),
    },
  })

  const [loading, setLoading] = useState(false)
  const { user }: { user: any } = useAppSelector((state) => state.userReducer.value)

  useEffect(() => {
    if (!user?.id) {
      router.push('/login')
    } else if (user?.role !== 'admin' && user?.role !== 'seller') {
      router.push('/')
    }
  }, [])

  const handleAddProperty = (values: Properties) => {
    setLoading(true)

    const data = {
      ...values,
      seller: user?.id,
    }
    axios
      .post(`/api/properties`, data)
      .then((res) => {
        router.push('/')
      })
      .catch((err) => {
        console.log('Error: ', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className="standard-page">
      <h1>Add Property</h1>

      <Box maw={500} w={'100%'}>
        <form onSubmit={form.onSubmit((values) => handleAddProperty(values))}>
          <TextInput
            label="Title"
            placeholder="5-Storey House"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Description"
            placeholder="Property Description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Tag"
            placeholder="house/land"
            key={form.key('tag')}
            {...form.getInputProps('tag')}
          />
          <TextInput
            label="City"
            placeholder="Kathmandu"
            key={form.key('city')}
            {...form.getInputProps('city')}
          />
          <Group justify="center" mt="md">
            <Button type="submit" loading={loading} disabled={loading}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  )
}

export default AddProperty
