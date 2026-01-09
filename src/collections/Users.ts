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
        if (value.length !== 10) return 'Phone Number must be of 10 digits.'
        if (!/^\d{10}/.test(value)) return 'Phone number field can only contain digits 0-9.'
        return true
      },
      admin: {
        components: {
          Field: {
            path: '@/components/admin/TextInputField',
            clientProps: {
              label: 'Phone Number',
              required: true,
            },
          },
        },
      },
    },
    // {
    //   name: 'title',
    //   type: 'text',
    //   virtual: 'true',
    //   hooks: {
    //     afterRead: [getUserTitle],
    //   },
    //   admin: {
    //     hidden: true,
    //   },
    // },
    // {
    //   name: 'testField',
    //   type: 'text',
    //   virtual: 'true',
    //   admin: {
    //     components: {
    //       Field: {
    //         path: '@/components/admin/TextInputField',
    //         clientProps: {
    //           label: 'Test Field',
    //         },
    //       },
    //     },
    //   },
    // },
  ],
}
