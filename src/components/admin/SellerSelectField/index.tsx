'use client'

import { ComboboxItem, ComboboxLikeRenderOptionInput, Flex, Select } from '@mantine/core'
import { useField } from '@payloadcms/ui'
import { IconCheck } from '@tabler/icons-react'
import axios from 'axios'
import type { Where } from 'payload'
import { stringify } from 'qs'
import React, { useEffect, useState } from 'react'

const iconProps = {
  stroke: 1.5,
  color: 'currentColor',
  opacity: 0.6,
  size: 18,
}

type UserOption = ComboboxItem & {
  email?: string
  phoneNumber?: string
}

const SellerSelectField = ({
  path,
  label,
  required,
}: {
  path: string
  label?: string | null
  required?: boolean | false
}) => {
  const { value, setValue, showError, errorMessage } = useField<string>()

  const formattedLabel =
    label ?? path.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: string }[] | string[]>([])

  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchValue, setSearchValue] = useState<string>('')
  const [debounceSearchValue, setDebounceSearchValue] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDebounceSearchValue(searchValue)
    }, 800)

    return () => clearInterval(interval)
  }, [searchValue])

  useEffect(() => {
    setLoading(true)

    const query: Where = {
      and: [
        {
          role: {
            equals: 'seller',
          },
        },
        {
          or: [
            {
              name: {
                contains: debounceSearchValue,
              },
            },
            {
              phoneNumber: {
                contains: debounceSearchValue,
              },
            },
            {
              email: {
                contains: debounceSearchValue,
              },
            },
          ],
        },
      ],
    }
    const stringifiedQuery = stringify({ where: query })

    axios
      .get(
        `/api/users?page=${page}&limit=10&${stringifiedQuery}&select[name]=true&select[phoneNumber]=true&select[email]=true&select[id]=true`,
      )
      .then((res) => {
        if (res.data.totalPages) setTotalPages(res.data.totalPages)
        if (res.data.page !== page) setPage(res.data.page)

        if (res.data.docs && res.data.docs?.length) {
          setOptions(
            res.data.docs.map((user: any) => {
              return {
                label: user?.name ?? 'User',
                value: `${user?.id}`,
                email: user?.email,
                phoneNumber: user?.phoneNumber,
              }
            }),
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, debounceSearchValue])

  const loadNextPage = () => {
    if (page < totalPages) {
      setPage((pre) => pre + 1)
    }
  }

  const renderSelectOption = ({ option, checked }: ComboboxLikeRenderOptionInput<UserOption>) => {
    return (
      <Flex direction={'row'} gap={0} justify={'space-between'} align={'center'} w={'100%'}>
        <Flex direction={'column'} gap={'sm'}>
          <strong style={{ fontSize: '18px', lineHeight: '18px' }}>{option.label}</strong>
          {option?.phoneNumber && (
            <span style={{ fontSize: '15px', lineHeight: '15px' }}>{option?.phoneNumber}</span>
          )}
          {option?.email && (
            <span style={{ fontSize: '15px', lineHeight: '15px' }}>{option?.email}</span>
          )}
        </Flex>
        {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
      </Flex>
    )
  }

  return (
    <Select
      placeholder={`Select a ${formattedLabel}`}
      searchable
      searchValue={searchValue}
      nothingFoundMessage={
        loading
          ? `Searching...`
          : `No ${formattedLabel} found ${searchValue ? 'for' : ''} ${searchValue}`
      }
      onSearchChange={setSearchValue}
      label={formattedLabel}
      data={options}
      defaultValue={value}
      onChange={(value) => setValue(value)}
      error={showError ? errorMessage : null}
      required={required}
      my={20}
      renderOption={renderSelectOption}
    />
  )
}

export default SellerSelectField
