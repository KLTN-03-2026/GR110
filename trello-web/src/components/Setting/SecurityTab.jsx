import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'

import {
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { updateUserAPI, logoutUserApi } from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'

const tips = [
  'Use a mix of uppercase, lowercase, numbers, and special characters.',
  'Avoid reusing old passwords or anything easily guessable.',
  'You will be signed out automatically after a successful change.'
]

function SecurityTab() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const dispatch = useDispatch()
  const confirmChangePassword = useConfirm()

  const submitChangePassword = (data) => {
    confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'warning.dark' }} />
          Change Password
        </Box>
      ),
      description:
        'You will be signed out after your password is updated. Continue?',
      confirmationText: 'Yes, change it',
      cancellationText: 'Cancel'
    })
      .then(() => {
        const { current_password, new_password } = data
        toast
          .promise(dispatch(updateUserAPI({ current_password, new_password })), {
            pending: 'Updating password…'
          })
          .then((res) => {
            if (!res.error) {
              toast.success('Password changed successfully!')
              dispatch(logoutUserApi(false))
            }
          })
      })
      .catch(() => {})
  }

  /* shared field sx */
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      transition: 'box-shadow 0.2s'
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(37,99,235,0.12)'
    }
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
            {/* Header */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                icon={<ShieldRoundedIcon sx={{ fontSize: 14, color: '#93c5fd !important' }} />}
                label="Security"
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
                Change Password
              </Typography>
              <Typography
                sx={{ opacity: 0.72, fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 240 }}
              >
                Keep your account secure with a strong, unique password. You'll be signed out once it's updated.
              </Typography>
            </Box>

            {/* Tips card */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  p: 2.5,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ShieldRoundedIcon sx={{ fontSize: 18, color: '#7dd3fc' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#bfdbfe' }}>
                    Security Tips
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
                  {tips.map((tip, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
                      <TaskAltRoundedIcon
                        sx={{ fontSize: 16, color: '#34d399', mt: '2px', flexShrink: 0 }}
                      />
                      <Typography sx={{ fontSize: '0.82rem', opacity: 0.88, lineHeight: 1.55 }}>
                        {tip}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ mb: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SecurityRoundedIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Security Settings
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Enter your current password, then choose a new one. Make it strong!
              </Typography>
            </Box>

            <Divider sx={{ mb: 3.5 }} />

            <form onSubmit={handleSubmit(submitChangePassword)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordIcon fontSize="small" color={errors.current_password ? 'error' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                    {...register('current_password', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                    })}
                    error={!!errors.current_password}
                    sx={fieldSx}
                  />
                  <FieldErrorAlert errors={errors} fieldName="current_password" />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color={errors.new_password ? 'error' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                    {...register('new_password', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                    })}
                    error={!!errors.new_password}
                    sx={fieldSx}
                  />
                  <FieldErrorAlert errors={errors} fieldName="new_password" />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockResetIcon fontSize="small" color={errors.new_password_confirmation ? 'error' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                    {...register('new_password_confirmation', {
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: (value) =>
                        value === watch('new_password') || 'Password confirmation does not match.'
                    })}
                    error={!!errors.new_password_confirmation}
                    sx={fieldSx}
                  />
                  <FieldErrorAlert errors={errors} fieldName="new_password_confirmation" />
                </Box>

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
                    You will be signed out after this action.
                  </Typography>

                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={<ShieldRoundedIcon />}
                    sx={{
                      minWidth: 190,
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
                    Update Password
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

export default SecurityTab