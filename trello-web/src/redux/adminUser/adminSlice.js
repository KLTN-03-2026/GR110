import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAdminAxiosInstance from '~/utils/authorizeAdminAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentAdmin: null
}

export const loginAdminApi = createAsyncThunk(
  'user/loginAdminApi',
  async (data) => {
    const response = await authorizeAdminAxiosInstance.post(
      `${API_ROOT}/v1/admin/login`,
      data
    )
    return response.data.metadata
  }
)

export const logoutAdminApi = createAsyncThunk(
  'user/logoutAdminApi',
  async (showSuccessMessage = true) => {
    const response = await authorizeAdminAxiosInstance.delete(
      `${API_ROOT}/v1/admin/logout`
    )
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data.metadata
  }
)

export const updateAdminAPI = createAsyncThunk(
  'user/updateAdminAPI',
  async (data) => {
    const response = await authorizeAdminAxiosInstance.put(
      `${API_ROOT}/v1/admin/update`,
      data
    )
    if(response.data?.metadata) {
      toast.success('Updated successfully')
    }
    return response.data.metadata
  }
)

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAdminApi.fulfilled, (state, action) => {
      state.currentAdmin = action.payload
    })

    builder.addCase(logoutAdminApi.fulfilled, (state) => {
      state.currentAdmin = null
    })

    builder.addCase(updateAdminAPI.fulfilled, (state, action) => {
      const admin = action.payload
      state.currentAdmin = admin
    })
  }
})

export const selectCurrentAdmin= (state) => {
  return state.admin.currentAdmin
}

export const adminReducer = adminSlice.reducer
