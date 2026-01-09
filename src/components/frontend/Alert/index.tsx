'use client'

import { clearAlert } from '@/store/slice/alertSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { Alert, Box } from '@mantine/core'
import { IconCheck, IconInfoCircle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

const CustomAlert = () => {
  const { alerts } = useAppSelector((state) => state.alertReducer.value)

  return (
    <>
      {alerts?.length ? (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%',
            zIndex: 10000,
          }}
          w={'100%'}
          maw={'400px'}
        >
          {alerts.map((alertItem: any, i: number) => {
            return <AlertBox alertItem={alertItem} key={i} />
          })}
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default CustomAlert

const AlertBox = ({ alertItem }: { alertItem: any }) => {
  const icon = alertItem?.type === 'success' ? <IconCheck /> : <IconInfoCircle />
  const dispatch = useAppDispatch()

  const [visible, setVisible] = useState(alertItem.show)

  useEffect(() => {
    const clearAlertInterval = setInterval(() => {
      closeAlert()
    }, 4000)

    return () => clearInterval(clearAlertInterval)
  }, [visible])

  const closeAlert = () => {
    dispatch(clearAlert({ id: alertItem.id }))
  }
  return (
    <>
      {alertItem.show ? (
        <Alert
          my={'md'}
          color={
            alertItem.type === 'success'
              ? 'teal'
              : alertItem.type === 'error'
                ? 'red'
                : alertItem.type === 'warning'
                  ? 'yellow'
                  : 'blue'
          }
          variant="filled"
          withCloseButton
          title={`${alertItem.type}`.toUpperCase() || 'Alert Title'}
          icon={icon}
          onClose={closeAlert}
        >
          {alertItem.message || 'This is alert'}
        </Alert>
      ) : (
        <></>
      )}
    </>
  )
}
