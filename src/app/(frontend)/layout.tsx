import React from 'react'
import './styles.css'

import '@mantine/core/styles.css'

import '@mantine/tiptap/styles.css'

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import Navbar from '@/components/frontend/Navbar/Navbar'
import Footer from '@/components/frontend/Footer/Footer'
import StoreProvider from '@/store/StoreProvider'
import { cookies } from 'next/headers'
import { getUser } from '../helpers/auth'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Property Shop',
}

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  colors: {
    'orange-color': [
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
      '#e27429',
    ],
  },
  primaryColor: 'orange-color',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const cookiesStore = await cookies()

  const token = cookiesStore.get('payload-token')?.value
  const user = await getUser()

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark" withCssVariables withGlobalClasses>
          <StoreProvider>
            <Navbar />
            {children}
            <Footer />
          </StoreProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
