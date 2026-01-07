import React from 'react'

import './styles.css'
import { getPayload } from 'payload'
import config from '@payload-config'
import PropertyCard from '@/components/frontend/PropertyCard'

export default async function HomePage() {
  try {
    const payload = await getPayload({ config })

    const properties = await payload.find({
      collection: 'properties',
    })

    return (
      <div className="home">
        <div className="content">
          <h1>Properties List</h1>

          <div className="properties">
            {properties.docs.map((pro) => {
              return <PropertyCard key={pro.id} data={pro} />
            })}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load properties:', error)

    return (
      <div className="home">
        <div className="content">
          <h1>Something went wrong</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    )
  }
}
