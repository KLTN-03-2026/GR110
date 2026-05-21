import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentAdmin, updateAdminAPI } from '~/redux/adminUser/adminSlice'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import { createTheme, ThemeProvider } from '@mui/material/styles'

/* ── Brand tokens ── */
const ORANGE = '#ea6b3d'
const ORANGE_DARK = '#d45a2c'
const ORANGE_DEEP = '#b84820'

const adminLightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

const inputSx = {
  '& .MuiInputLabel-root': { color: '#6b7280' },
  '& .MuiInputLabel-root.Mui-focused': { color: ORANGE },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fafafa',
    color: '#111827',
    transition: 'box-shadow 0.2s',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: ORANGE },
    '&.Mui-focused': { boxShadow: `0 0 0 4px rgba(234,107,61,0.10)` }
  },
  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#6b7280' }
}

const disabledInputSx = {
  ...inputSx,
  '& .MuiOutlinedInput-root': {
    ...inputSx['& .MuiOutlinedInput-root'],
    backgroundColor: '#f3f4f6'
  }
}

export default function ProfilePage() {
  const currentAdmin = useSelector(selectCurrentAdmin)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const dispatch = useDispatch()

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
      isBlocked: currentAdmin.isBlocked ? 'Blocked' : 'Not Blocked',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const currentPassword = watch('currentPassword')
  const newPassword = watch('newPassword')
  const confirmPassword = watch('confirmPassword')

  const isChangingPassword =
    currentPassword || newPassword || confirmPassword

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
      setPreviewUrl(null)
    } else {
      await dispatch(updateAdminAPI({
        displayName: data.displayName,
        username: data.username,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }))
    }
  }

  return (
    <ThemeProvider theme={adminLightTheme}>
      <Box>
        {/* ── Page header ── */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background: `linear-gradient(145deg, #1a0a04 0%, #7c2d0e 45%, ${ORANGE} 100%)`,
            color: 'white',
            px: { xs: 3, md: 5 },
            py: { xs: 3.5, md: 4 },
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={dotPatternSx} />
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(234,107,61,0.30) 0%, transparent 70%)`,
              pointerEvents: 'none'
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: 52,
              height: 52,
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 26 }} />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em' }}
            >
              Admin Profile
            </Typography>
            <Typography sx={{ opacity: 0.72, fontSize: '0.875rem', mt: 0.4 }}>
              Manage your personal account information and security settings.
            </Typography>
          </Box>
        </Box>

        {/* ── Main form ── */}
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          elevation={0}
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)'
          }}
        >
          <Grid container>
            {/* ── Left: avatar panel ── */}
            <Grid
              item xs={12} md={3.5}
              sx={{
                borderRight: { md: '1px solid #f0f0f0' },
                borderBottom: { xs: '1px solid #f0f0f0', md: 'none' }
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 2,
                  height: '100%'
                }}
              >
                <Chip
                  label="Profile Photo"
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(234,107,61,0.10)',
                    color: ORANGE_DARK,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: 0.8,
                    border: `1px solid rgba(234,107,61,0.20)`
                  }}
                />

                {/* Avatar with spinning ring */}
                <Box
                  sx={{
                    position: 'relative',
                    mt: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -5,
                      borderRadius: '50%',
                      background: `conic-gradient(from 180deg, ${ORANGE}, #fbbf24, #f97316, ${ORANGE})`,
                      animation: 'spin 4s linear infinite',
                      '@keyframes spin': { to: { transform: 'rotate(360deg)' } }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      background: '#fff'
                    }
                  }}
                >
                  <Avatar
                    src={previewUrl || currentAdmin.avatar}
                    alt={currentAdmin.displayName}
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      width: 108,
                      height: 108,
                      fontSize: '2.2rem',
                      fontWeight: 700,
                      border: '3px solid white'
                    }}
                  />
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                    {currentAdmin.displayName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    @{currentAdmin.username}
                  </Typography>
                </Box>

                {/* Status badges */}
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  <Chip
                    icon={<TaskAltRoundedIcon sx={{ fontSize: '14px !important' }} />}
                    label={currentAdmin.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: currentAdmin.isActive ? '#dcfce7' : '#fee2e2',
                      color: currentAdmin.isActive ? '#15803d' : '#b91c1c',
                      border: `1px solid ${currentAdmin.isActive ? '#bbf7d0' : '#fecaca'}`
                    }}
                  />
                  <Chip
                    icon={<BlockRoundedIcon sx={{ fontSize: '13px !important' }} />}
                    label={currentAdmin.isBlocked ? 'Blocked' : 'Not Blocked'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: currentAdmin.isBlocked ? '#fee2e2' : '#f3f4f6',
                      color: currentAdmin.isBlocked ? '#b91c1c' : '#374151',
                      border: `1px solid ${currentAdmin.isBlocked ? '#fecaca' : '#e5e7eb'}`
                    }}
                  />
                </Stack>

                <Tooltip title="Upload a new image — preview shown immediately">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      px: 2.5,
                      py: 0.9,
                      color: ORANGE,
                      borderColor: `rgba(234,107,61,0.40)`,
                      backgroundColor: 'rgba(234,107,61,0.05)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(234,107,61,0.10)',
                        borderColor: ORANGE,
                        boxShadow: `0 0 18px rgba(234,107,61,0.20)`
                      }
                    }}
                  >
                    Change Avatar
                    <input hidden accept="image/*" type="file" name="avatar" onChange={handleFileChange} />
                  </Button>
                </Tooltip>

                {selectedFile && (
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', wordBreak: 'break-word' }}>
                    📎 {selectedFile.name}
                  </Typography>
                )}

                <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 'auto' }}>
                  JPG, PNG, GIF · Max 5 MB
                </Typography>
              </Box>
            </Grid>

            {/* ── Right: fields panel ── */}
            <Grid item xs={12} md={8.5}>
              <Box sx={{ p: { xs: 3, md: 4 } }}>

                {/* Account Information */}
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminPanelSettingsRoundedIcon sx={{ color: ORANGE, fontSize: 20 }} />
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                    Account Information
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.82rem', color: '#6b7280', mb: 2.5 }}>
                  Display name and username are editable. Email and role are read-only.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      error={!!errors.displayName}
                      {...register('displayName', { required: 'Display name is required' })}
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
                      sx={disabledInputSx}
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
                      sx={disabledInputSx}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3.5 }} />

                {/* Change Password */}
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockRoundedIcon sx={{ color: ORANGE, fontSize: 20 }} />
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                    Change Password
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.82rem', color: '#6b7280', mb: 2.5 }}>
                  Leave all three fields empty if you don't want to change your password.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      error={!!errors.currentPassword}
                      {...register('currentPassword', {
                        validate: (value) => {
                          if (!isChangingPassword) return true
                          if (!value) return 'Current password is required'
                          return true
                        }
                      })}
                      sx={inputSx}
                    />
                    <FieldErrorAlert errors={errors} fieldName="currentPassword" />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      error={!!errors.newPassword}
                      {...register('newPassword', {
                        validate: (value) => {
                          if (!isChangingPassword) return true
                          if (!value) return FIELD_REQUIRED_MESSAGE
                          if (!PASSWORD_RULE.test(value)) return PASSWORD_RULE_MESSAGE
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
                      error={!!errors.confirmPassword}
                      {...register('confirmPassword', {
                        validate: (value) => {
                          if (!isChangingPassword) return true
                          if (!value) return FIELD_REQUIRED_MESSAGE
                          if (value !== watch('newPassword')) return 'Confirm password does not match'
                          return true
                        }
                      })}
                      sx={inputSx}
                    />
                    <FieldErrorAlert errors={errors} fieldName="confirmPassword" />
                  </Grid>
                </Grid>

                {/* Action buttons */}
                <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    sx={{
                      minWidth: 155,
                      height: 46,
                      px: 3,
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      background: `linear-gradient(135deg, ${ORANGE_DEEP}, ${ORANGE})`,
                      boxShadow: `0 8px 22px rgba(234,107,61,0.32)`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${ORANGE_DARK}, ${ORANGE})`,
                        boxShadow: `0 12px 30px rgba(234,107,61,0.46)`,
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Save Changes
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    sx={{
                      minWidth: 100,
                      height: 46,
                      px: 3,
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderColor: '#e5e7eb',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>

  )
}