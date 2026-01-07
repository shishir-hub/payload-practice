import { Access } from 'payload'
import { checkRole } from './checkRole'

export const admins: Access = ({ req: { user } }) => checkRole('admin', user)

export const adminSeller: Access = ({ req: { user } }) => {
  if (checkRole('admin', user) || checkRole('seller', user)) {
    return true
  }

  return false
}

export const anyone: Access = ({ req: { user } }) => true

export const sellers: Access = ({ req: { user } }) => checkRole('seller', user)

export const buyers: Access = ({ req: { user } }) => checkRole('buyer', user)

export const users: Access = ({ req: { user } }) => {
  if (user?.id) {
    return true
  }
  return false
}
