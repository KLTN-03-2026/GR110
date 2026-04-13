import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentAdmin,
  updateAdminAPI
} from '~/redux/adminUser/adminSlice'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const inputSx = {
  '& .MuiInputLabel-root': {
    color: '#6b7280'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ea6b3d'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    color: '#111827',
    '& fieldset': {
      borderColor: '#d1d5db'
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ea6b3d'
    }
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#4b5563'
  }
}

const sectionTitleSx = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#111827'
}

export default function ProfilePage() {
  const currentAdmin = useSelector(selectCurrentAdmin)
  const [selectedFile, setSelectedFile] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      avatar: currentAdmin.avatar,
      displayName: currentAdmin.displayName,
      email: currentAdmin.email,
      username: currentAdmin.username,
      role: currentAdmin.role,
      isActive: currentAdmin.isActive ? 'Active' : 'Inactive',
      isBlocked: currentAdmin.isBlocked ? 'Blocked' : 'No Block',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  })

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
  }

  const dispatch = useDispatch()
  const onSubmit = async (data) => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('displayName', data.displayName)
      formData.append('username', data.username)
      formData.append('currentPassword', data.currentPassword || '')
      formData.append('newPassword', data.newPassword || '')
      formData.append('confirmPassword', data.confirmPassword || '')
      formData.append('file', selectedFile)

      await dispatch(updateAdminAPI(formData))

      setSelectedFile(null)
    } else {
      await dispatch(
        updateAdminAPI({
          displayName: data.displayName,
          username: data.username,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      )
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '40px',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.2
          }}
        >
          Profile
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: '22px',
            color: '#374151'
          }}
        >
          Manage your personal account information
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          p: { xs: 2, md: 3 },
          backgroundColor: '#ffffff'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                p: 3,
                height: '100%'
              }}
            >
              <Typography sx={sectionTitleSx}>Profile Photo</Typography>

              <Stack alignItems="center" spacing={2.5} sx={{ mt: 3 }}>
                <Avatar
                  src={currentAdmin.avatar}
                  alt={currentAdmin.displayName}
                  sx={{
                    width: 110,
                    height: 110,
                    border: '3px solid #f3f4f6'
                  }}
                />

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCameraOutlinedIcon />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb'
                    }
                  }}
                >
                  Change Avatar
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                  />
                </Button>

                {selectedFile && (
                  <Typography
                    sx={{
                      mt: -1,
                      fontSize: '13px',
                      color: '#6b7280',
                      textAlign: 'center',
                      wordBreak: 'break-word'
                    }}
                  >
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                p: 3
              }}
            >
              <Typography sx={sectionTitleSx}>Account Information</Typography>

              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    error={!!errors.displayName}
                    {...register('displayName', {
                      required: 'Display name is required'
                    })}
                    sx={inputSx}
                    helperText={errors.displayName?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    disabled
                    {...register('email')}
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    {...register('username')}
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    disabled
                    {...register('role')}
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Status"
                    disabled
                    {...register('isActive')}
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Block Status"
                    disabled
                    {...register('isBlocked')}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <LockOutlinedIcon sx={{ color: '#6b7280' }} />
                <Typography sx={sectionTitleSx}>Change Password</Typography>
              </Stack>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    error={!!errors.currentPassword}
                    {...register('currentPassword', {
                      validate: (value) => {
                        const newPassword = watch('newPassword')
                        const confirmPassword = watch('confirmPassword')

                        if (!value && !newPassword && !confirmPassword)
                          return true
                        if (!value && (newPassword || confirmPassword)) {
                          return 'Current password is required'
                        }
                        return true
                      }
                    })}
                    sx={inputSx}
                  />
                  <FieldErrorAlert
                    errors={errors}
                    fieldName="currentPassword"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                    error={!!errors.newPassword}
                    {...register('newPassword', {
                      validate: (value) => {
                        const currentPassword = watch('currentPassword')
                        const confirmPassword = watch('confirmPassword')

                        if (!value && !currentPassword && !confirmPassword)
                          return true
                        if (!value && (currentPassword || confirmPassword)) {
                          return 'New password is required'
                        }
                        if (value && !PASSWORD_RULE.test(value)) {
                          return PASSWORD_RULE_MESSAGE
                        }
                        return true
                      }
                    })}
                    sx={inputSx}
                  />
                  <FieldErrorAlert errors={errors} fieldName="newPassword" />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    {...register('confirmPassword', {
                      validate: (value) => {
                        const newPassword = watch('newPassword')
                        const currentPassword = watch('currentPassword')

                        if (!value && !newPassword && !currentPassword)
                          return true
                        if (!value && (newPassword || currentPassword)) {
                          return 'Confirm password is required'
                        }
                        if (value !== newPassword) {
                          return 'Confirm password does not match'
                        }
                        return true
                      }
                    })}
                    sx={inputSx}
                  />
                  <FieldErrorAlert
                    errors={errors}
                    fieldName="confirmPassword"
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  sx={{
                    minWidth: 140,
                    height: 42,
                    px: 2,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#ea6b3d',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#dc5f31',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Save Changes
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    minWidth: 100,
                    height: 42,
                    px: 2,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#5b5b5b',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#4b4b4b',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
