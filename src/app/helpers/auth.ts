import axios from 'axios'

export const getUser = async (token?: string) => {
  try {
    if (token) {
      const response = await axios.get('/api/users/me')

      return response.data
    } else {
      return {
        user: null,
        token: null,
        exp: null,
      }
    }
  } catch (error) {
    return {
      user: null,
      token: null,
      exp: null,
    }
  }
}
