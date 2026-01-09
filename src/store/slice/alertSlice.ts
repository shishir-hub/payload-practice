import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    alerts: <any>[],
  },
}

const alert = createSlice({
  name: 'alertReducer',
  initialState,
  reducers: {
    setAlert: (state, { payload }) => {
      const id = state.value.alerts.length

      if (state.value.alerts.length >= 3) {
        state.value.alerts.splice(0, 1)
      }

      state.value.alerts.push({
        id: id,
        show: payload.show,
        type: payload.type,
        message: payload.message,
      })
    },
    clearAlert: (state, { payload }) => {
      if (payload.id) {
        state.value.alerts = state.value.alerts.filter((el: any) => el.id !== payload.id)
      } else {
        state.value.alerts.splice(0, 1)
      }
    },
  },
})

export const { setAlert, clearAlert } = alert.actions

export default alert.reducer
