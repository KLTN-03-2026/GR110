import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
  Avatar,
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Chip
} from '@mui/material'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'

import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'

/* ─── Subtle animated background dots ─── */
const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

function AccountTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      displayName: currentUser?.displayName || ''
    }
  })

  useEffect(() => {
    reset({ displayName: currentUser?.displayName || '' })
  }, [currentUser, reset])

  const displayNameValue = watch('displayName')
  const isDisplayNameChanged =
    (displayNameValue || '').trim() !== (currentUser?.displayName || '').trim()

  const submitChangeGeneralInformation = (data) => {
    const trimmedDisplayName = data.displayName?.trim()
    if (!trimmedDisplayName || trimmedDisplayName === currentUser?.displayName) return

    toast
      .promise(dispatch(updateUserAPI({ displayName: trimmedDisplayName })), {
        pending: 'Saving changes…'
      })
      .then((res) => {
        if (!res.error) toast.success('Profile updated successfully!')
      })
  }

  const uploadAvatar = (e) => {
    const file = e.target?.files[0]
    const error = singleFileValidator(file)
    if (error) { toast.error(error); return }

    const reqData = new FormData()
    reqData.append('file', file)

    toast
      .promise(dispatch(updateUserAPI(reqData)), { pending: 'Uploading avatar…' })
      .then((res) => {
        if (!res.error) toast.success('Avatar updated!')
        e.target.value = ''
      })
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 1.5, sm: 3 },
        py: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1100,
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 32px 80px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }
          }}
        >
          {/* ── Left panel ── */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              p: 4,
              background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              color: 'white'
            }}
          >
            {/* dot texture */}
            <Box sx={dotPatternSx} />

            {/* Header label */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: 14, color: '#93c5fd !important' }} />}
                label="Account Settings"
                size="small"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  color: '#bfdbfe',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: 1,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)'
                }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, lineHeight: 1.25, mb: 1 }}
              >
                Your Public Profile
              </Typography>
              <Typography
                sx={{ opacity: 0.72, fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 240 }}
              >
                Update your avatar and display name to make your profile stand out.
              </Typography>
            </Box>

            {/* Avatar block */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {/* Glow ring behind avatar */}
              <Box
                sx={{
                  position: 'relative',
                  mb: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    background:
                      'conic-gradient(from 180deg, #38bdf8, #818cf8, #34d399, #38bdf8)',
                    animation: 'spin 4s linear infinite',
                    '@keyframes spin': { to: { transform: 'rotate(360deg)' } }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #0f172a, #1e3a8a)'
                  }
                }}
              >
                <Avatar
                  alt={currentUser?.displayName || 'User'}
                  src={currentUser?.avatar}
                  sx={{
                    width: 108,
                    height: 108,
                    position: 'relative',
                    zIndex: 1,
                    border: '3px solid rgba(255,255,255,0.85)',
                    fontSize: '2.5rem',
                    fontWeight: 700
                  }}
                />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25 }}>
                {currentUser?.displayName}
              </Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '0.82rem', mb: 2.5 }}>
                @{currentUser?.username}
              </Typography>

              <Tooltip title="Upload a new image — changes apply immediately">
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
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.35)',
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      borderColor: 'rgba(255,255,255,0.6)',
                      boxShadow: '0 0 20px rgba(56,189,248,0.3)'
                    }
                  }}
                >
                  Change Avatar
                  <input hidden type="file" accept="image/*" onChange={uploadAvatar} />
                </Button>
              </Tooltip>
            </Box>

            {/* Footer hint */}
            <Typography
              sx={{
                position: 'relative',
                zIndex: 1,
                opacity: 0.45,
                fontSize: '0.72rem',
                textAlign: 'center',
                lineHeight: 1.5
              }}
            >
              Supported formats: JPG, PNG, GIF · Max 5 MB
            </Typography>
          </Box>

          {/* ── Right form panel ── */}
          <Box
            sx={{
              p: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* Section header */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}
              >
                Edit Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Your email and username are fixed. You can freely update your display name below.
              </Typography>
            </Box>

            <Divider sx={{ mb: 3.5 }} />

            <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Read-only fields */}
                <TextField
                  disabled
                  fullWidth
                  label="Email Address"
                  defaultValue={currentUser?.email}
                  variant="filled"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiFilledInput-root': { borderRadius: '12px' }
                  }}
                />

                <TextField
                  disabled
                  fullWidth
                  label="Username"
                  defaultValue={currentUser?.username}
                  variant="filled"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBoxIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiFilledInput-root': { borderRadius: '12px' }
                  }}
                />

                {/* Editable display name */}
                <Box>
                  <TextField
                    fullWidth
                    label="Display Name"
                    type="text"
                    variant="outlined"
                    {...register('displayName', { required: FIELD_REQUIRED_MESSAGE })}
                    error={!!errors.displayName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentIndIcon
                            fontSize="small"
                            color={errors.displayName ? 'error' : 'primary'}
                          />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'box-shadow 0.2s'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        boxShadow: '0 0 0 4px rgba(37,99,235,0.12)'
                      }
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName="displayName" />
                </Box>

                {/* Save button */}
                <Box
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5
                  }}
                >
                  <Typography variant="caption" color="text.disabled">
                    Last updated: {currentUser?.updatedAt
                      ? new Date(currentUser.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })
                      : '—'}
                  </Typography>

                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    disabled={!isDisplayNameChanged || isSubmitting}
                    startIcon={<SaveRoundedIcon />}
                    sx={{
                      minWidth: 160,
                      py: 1.2,
                      px: 3,
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                      boxShadow: '0 8px 24px rgba(37,99,235,0.30)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 12px 32px rgba(37,99,235,0.45)',
                        transform: 'translateY(-1px)'
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.08)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AccountTab