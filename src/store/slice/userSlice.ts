import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { user: null, token: null, exp: null },
}

const user = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      state.value.user = payload.user
      state.value.token = payload.token
      state.value.exp = payload.exp
    },
    clearUser: () => {
      return { ...initialState }
    },
  },
})

export const { addUser, clearUser } = user.actions

export default user.reducer
