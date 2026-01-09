'use client'

import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { Box, Button, Group, InputBase, PasswordInput, Select, TextInput } from '@mantine/core'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { IMaskInput } from 'react-imask'
import { useAppDispatch } from '@/store/store'
import { setAlert } from '@/store/slice/alertSlice'

const Signup = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'buyer',
      name: '',
      phoneNumber: '',
    },

    validate: {
      name: (value) => (value.length > 0 ? null : 'Full name required'),
      phoneNumber: (value) => {
        if (!value || value.length < 1) return 'Phone Number is required.'

        if (
          value.trim().replace('(', '').replace(' ', '').replace(')', '').replace('-', '').length !=
          10
        ) {
          return 'Phone Number must be of 10 digit.'
        }
        return null
      },
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 8 ? null : 'Password must be atleast 8 characters long'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords doesnot match.',
    },
  })

  const handleSignup = (values: {
    email: string
    password: string
    role: string
    name: string
    phoneNumber: string
  }) => {
    setLoading(true)
    axios
      .post(`/api/users`, values)
      .then((res) => {
        router.push('/login')
        dispatch(setAlert({ show: true, message: 'Signup Success', type: 'success' }))
      })
      .catch((err) => {
        const errorResponse = err?.response?.data
        if (errorResponse.errors?.length && errorResponse?.errors[0]?.message) {
          if (
            errorResponse?.errors[0]?.data?.errors?.length &&
            errorResponse?.errors[0]?.data?.errors[0]?.message
          ) {
            dispatch(
              setAlert({
                show: true,
                message: errorResponse?.errors[0]?.data?.errors[0]?.message,
                type: 'error',
              }),
            )
          } else {
            dispatch(
              setAlert({
                show: true,
                message: errorResponse?.errors[0]?.message,
                type: 'error',
              }),
            )
          }
        } else {
          dispatch(setAlert({ show: true, message: 'Signup Failed', type: 'error' }))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className="standard-page">
      <h1>Signup page</h1>

      <Box maw={340} w={'100%'}>
        <form onSubmit={form.onSubmit((values) => handleSignup(values))}>
          <TextInput
            label="Full Name"
            placeholder="Marry Gold"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <InputBase
            label="Phone Number"
            placeholder="(XXX) XXX-XXXX"
            component={IMaskInput}
            mask="(000) 000-0000"
            {...form.getInputProps('phoneNumber')}
            value={form.getValues().phoneNumber}
            onAccept={(value) => form.setFieldValue('phoneNumber', value)}
          />
          <TextInput
            label="Email"
            placeholder="example@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label="Confirm Password"
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
          />

          <Select
            label="Choose Role"
            defaultValue={'buyer'}
            data={[
              { label: 'Buyer', value: 'buyer' },
              { label: 'Seller', value: 'seller' },
            ]}
            key={form.key('role')}
            {...form.getInputProps('role')}
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

export default Signup
