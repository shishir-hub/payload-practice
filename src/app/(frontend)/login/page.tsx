'use client'

import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { addUser } from '@/store/slice/userSlice'
import { useAppDispatch } from '@/store/store'

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
        router.push('/')
      })
      .catch((err) => {
        console.log('Error')
      })
      .finally(() => {
        setLoading(false)
      })
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
        </form>
      </Box>
    </div>
  )
}

export default Login
