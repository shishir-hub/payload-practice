'use client'

import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { addUser } from '@/store/slice/userSlice'
import { useAppDispatch } from '@/store/store'
import { setAlert } from '@/store/slice/alertSlice'

const Login = () => {
  const dispatch = useAppDispatch()

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true)
    axios
      .post(`/api/users/login`, values)
      .then((res) => {
        dispatch(
          addUser({
            user: res.data.user,
            token: res.data.token,
            exp: res.data.exp,
          }),
        )
        dispatch(setAlert({ show: true, message: 'Login Success', type: 'success' }))
        router.push('/')
      })
      .catch((err) => {
        const errorResponse = err?.response?.data
        if (errorResponse.errors?.length && errorResponse?.errors[0]?.message) {
          if (
            errorResponse?.errors[0]?.data?.errors?.length &&
            errorResponse?.errors[0]?.data?.errors?.message
          ) {
            dispatch(
              setAlert({
                show: true,
                message: errorResponse?.errors[0]?.data?.errors?.message,
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
          dispatch(setAlert({ show: true, message: 'Login Failed', type: 'error' }))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const [counter, setCounter] = useState(1)

  const createAlert = () => {
    console.log('clicked')

    dispatch(setAlert({ show: true, message: `Login Success ${counter}`, type: 'success' }))

    setCounter((pre) => pre + 1)
  }
  return (
    <div className="standard-page">
      <h1>Login page</h1>

      <Box maw={340} w={'100%'}>
        <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
          <TextInput
            mt="md"
            label="Email"
            placeholder="example@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            mt="md"
            label="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <Group justify="center" mt="md">
            <Button type="submit" loading={loading} disabled={loading}>
              Submit
            </Button>
          </Group>

          {/* <Group justify="center" mt="md">
            <Button type="button" onClick={createAlert} loading={loading} disabled={loading}>
              Create Alert
            </Button>
          </Group> */}
        </form>
      </Box>
    </div>
  )
}

export default Login
