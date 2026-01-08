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

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
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
      type: 'select',
      defaultValue: 'buyer',
      saveToJWT: true,
      hooks: {
        beforeChange: [protectRoleHook],
      },
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
    },
  ],
}
