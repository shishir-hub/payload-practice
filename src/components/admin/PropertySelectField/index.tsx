'use client'

import { Select } from '@mantine/core'
import { useField } from '@payloadcms/ui'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PropertySelectField = ({
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

    axios
      .get(
        `/api/properties?page=${page}&limit=10&where[or][0][title][is like]=${debounceSearchValue}&where[or][0][description][is like]=${debounceSearchValue}&where[or][0][tag.label][is like]=${debounceSearchValue}&select[title]=true&select[description]=true&select[tag]=true&select[id]=true`,
      )
      .then((res) => {
        if (res.data.totalPages) setTotalPages(res.data.totalPages)
        if (res.data.page !== page) setPage(res.data.page)

        if (res.data.docs && res.data.docs?.length) {
          setOptions(
            res.data.docs.map((property: any) => {
              return {
                label: `${property?.title ?? ''} (ID: ${property?.id ?? ''})`,
                value: `${property?.id ?? ''}`,
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
    />
  )
}

export default PropertySelectField
