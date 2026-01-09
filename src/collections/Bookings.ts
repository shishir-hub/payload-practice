import { CollectionConfig } from 'payload'
import { adminBuyer, adminSeller, users } from './access/roles'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    read: users,
    create: adminBuyer,
    update: adminBuyer,
    delete: adminSeller,
  },
  fields: [
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        components: {
          Field: {
            path: '@/components/admin/BuyerSelectField',
            clientProps: {
              required: true,
            },
          },
        },
      },
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      admin: {
        components: {
          Field: {
            path: '@/components/admin/PropertySelectField',
            clientProps: {
              required: true,
            },
          },
        },
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
