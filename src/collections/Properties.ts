import { CollectionAfterReadHook, CollectionConfig, FieldHook } from 'payload'
import { adminSeller, anyone } from './access/roles'
import { checkRole } from './access/checkRole'

type SellerProps = {
  id: string
  email: string
}

const getProvience: FieldHook = ({ siblingData, value }) => {
  const city = siblingData?.city

  if (city && city === 'Kathmandu') {
    return 'Bagmati'
  }

  return value
}

const protectUserSensitiveRead: CollectionAfterReadHook = ({ doc }) => {
  let newDoc = { ...doc }

  if (doc.seller && typeof doc.seller === 'object') {
    newDoc = { ...doc, seller: { id: doc.seller.id, email: doc.seller.email } }
  }
  return newDoc
}

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: {
    read: anyone,
    create: adminSeller,
    update: ({ req: { user }, data }) => {
      if (checkRole('admin', user)) {
        return true
      } else if (checkRole('seller', user) && user?.id) {
        return (user.id = data?.seller)
      }

      return false
    },
    delete: ({ req: { user }, data }) => {
      if (checkRole('admin', user)) {
        return true
      } else if (checkRole('seller', user) && user?.id) {
        return (user.id = data?.seller)
      }

      return false
    },
  },
  hooks: {
    afterRead: [protectUserSensitiveRead],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 255,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'tag',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'provience',
      type: 'text',
      hooks: {
        beforeChange: [getProvience],
      },
    },
    {
      name: 'isSold',
      label: 'Sold',
      type: 'checkbox',
    },
  ],
}
