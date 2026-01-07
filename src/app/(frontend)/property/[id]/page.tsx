import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { formatDate } from '@/app/helpers/formatDate'

type PageProps = {
  params: {
    id: string
  }
}
const PropertyDetails = async ({ params }: PageProps) => {
  const id = params.id

  const payload = await getPayload({ config })

  const propertyDetail = await payload.findByID({
    collection: 'properties',
    id: id,
  })

  if (!propertyDetail.id) {
    return (
      <div className="standard-page">
        <h1>404: Property not found</h1>
      </div>
    )
  }

  return (
    <div className="standard-page">
      <h1>Property Details</h1>

      <div className="property-detail-container">
        <p className="title">{propertyDetail.title}</p>
        <p className="desc">{propertyDetail.description}</p>

        <div className="creation-block">
          <p className="posted-at">Posted at: {formatDate(propertyDetail.updatedAt)}</p>

          <p className="user">Owner: {}</p>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
