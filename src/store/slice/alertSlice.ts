import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { show: false, type: '', message: '' },
}

const alert = createSlice({
  name: 'alertReducer',
  initialState,
  reducers: {
    setAlert: (state, { payload }) => {
      return {
        value: { show: payload.show, type: payload.type, message: payload.message },
      }
    },
    resetAlert: () => {
      return {
        ...initialState,
      }
    },
  },
})

export const { setAlert, resetAlert } = alert.actions

export default alert.reducer
