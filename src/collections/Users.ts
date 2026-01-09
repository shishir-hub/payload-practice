import type {
  CollectionAfterLoginHook,
  CollectionAfterReadHook,
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

const getUserTitle: FieldHook = ({ siblingData }) => {
  return `${siblingData?.name ?? ''} ${siblingData?.phoneNumber ?? ''} ${siblingData?.email ?? ''}`
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
            width: '33.33%',
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
            width: '33.33%',
            components: {
              Field: {
                path: '@/components/admin/TextInputField',
                clientProps: {
                  label: 'Name',
                  required: true,
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
            if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(value))
              return 'Phone Number should be in (000) 000-000 format.'
            return true
          },
          admin: {
            width: '33.33%',
            components: {
              Field: {
                path: '@/components/admin/PhoneNumberField',
                clientProps: {
                  label: 'Phone Number',
                  required: true,
                },
              },
            },
          },
        },
      ],
    },
  ],
}
