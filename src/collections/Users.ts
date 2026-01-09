import type {
  CollectionAfterLoginHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldHook,
} from 'payload'
import { admins, anyone, users } from './access/roles'
import { checkRole } from './access/checkRole'
import { cookies } from 'next/headers'

const setCookieToken: CollectionAfterLoginHook = async ({ token }) => {
  const cookieStore = await cookies()
  cookieStore.set('payload-token', token)
}

const protectRoleHook: FieldHook = ({ value, req, originalDoc }) => {
  if (value === 'admin' && req.user?.role !== 'admin') {
    return originalDoc?.role ?? 'buyer'
  }

  return value
}

const cleanupNumberAndEmail: CollectionBeforeChangeHook = ({ data }) => {
  data.email = `${data.email}`.toLowerCase()
  data.phoneNumber = `${data.phoneNumber}`
    .trim()
    .replace('(', '')
    .replace(' ', '')
    .replace(')', '')
    .replace('-', '')

  return data
}

const formatPhoneNumber: FieldHook = ({ value }) => {
  if (!value.includes('(') && value.length === 10) {
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
  }

  return value
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phoneNumber', 'role', 'updatedAt'],
  },
  access: {
    read: admins,
    create: anyone,
    update: users,
    delete: users,
    admin: ({ req: { user } }) => checkRole('admin', user),
  },
  auth: true,
  hooks: {
    afterLogin: [setCookieToken],
    beforeChange: [cleanupNumberAndEmail],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          defaultValue: 'buyer',
          saveToJWT: true,
          hooks: {
            beforeChange: [protectRoleHook],
          },
          admin: {
            components: {
              Field: {
                path: '@/components/admin/SelectCustomField',
                clientProps: {
                  options: [
                    {
                      label: 'Admin',
                      value: 'admin',
                    },
                    {
                      label: 'Seller',
                      value: 'seller',
                    },
                    {
                      label: 'Buyer',
                      value: 'buyer',
                    },
                  ],
                  required: true,
                  width: '32.33%',
                },
              },
            },
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) => {
            if (!value || value.length < 1) return 'User Name is required.'
            return true
          },
          admin: {
            components: {
              Field: {
                path: '@/components/admin/TextInputField',
                clientProps: {
                  label: 'Name',
                  required: true,
                  width: '32.33%',
                },
              },
            },
          },
        },
        {
          name: 'phoneNumber',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) => {
            if (!value || value.length < 1) return 'Phone Number is required.'
            const cleanNumber = value
              .trim()
              .replace('(', '')
              .replace(' ', '')
              .replace(')', '')
              .replace('-', '')

            if (cleanNumber.length != 10) return 'Phone Number must be of 10 digit.'
            return true
          },
          hooks: {
            afterRead: [formatPhoneNumber],
          },
          admin: {
            components: {
              Field: {
                path: '@/components/admin/PhoneNumberField',
                clientProps: {
                  label: 'Phone Number',
                  required: true,
                  width: '32.33%',
                },
              },
            },
          },
        },
      ],
    },
  ],
}
