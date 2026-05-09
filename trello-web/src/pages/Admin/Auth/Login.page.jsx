import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { loginAdminApi } from '~/redux/adminUser/adminSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

/* ── Brand token ── */
const ORANGE = '#ea6b3d'
const ORANGE_DARK = '#d45a2c'
const ORANGE_DEEP = '#b84820'

const inputSx = {
  '& .MuiInputLabel-root': { color: '#9ca3af' },
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
  '& .MuiInputBase-input': { color: '#111827' }
}

const defaultValues = { email: '', password: '' }

/* ── tiny dot texture ── */
const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  pointerEvents: 'none'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues, mode: 'onBlur' })

  const onSubmit = async (data) => {
    try {
      setSubmitError('')
      toast
        .promise(dispatch(loginAdminApi(data)), { pending: 'Signing in…' })
        .then((res) => {
          if (!res.error) navigate('/admin/dashboard')
        })
    } catch {
      setSubmitError('Invalid email or password')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        background: '#f6f8fc'
      }}
    >
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 5,
          background: `linear-gradient(145deg, #1a0a04 0%, #7c2d0e 45%, ${ORANGE} 100%)`,
          color: 'white'
        }}
      >
        <Box sx={dotPatternSx} />

        {/* Glow orb */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(234,107,61,0.35) 0%, transparent 70%)`,
            pointerEvents: 'none'
          }}
        />

        {/* Top: logo mark */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              mb: 3
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 26 }} />
          </Box>

          <Typography
            sx={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              mb: 1.5
            }}
          >
            Admin Portal
          </Typography>
          <Typography sx={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300 }}>
            Secure access for administrators to manage users, workspaces, billing, and support tickets.
          </Typography>
        </Box>

        {/* Bottom: trust badges */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {[
            'Role-based access control',
            'Activity logging & audit trail',
            'Two-layer authentication'
          ].map((item) => (
            <Box
              key={item}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                mb: 1.25,
                opacity: 0.85
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: ORANGE,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${ORANGE}`
                }}
              />
              <Typography sx={{ fontSize: '0.82rem' }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 4, md: 6 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile-only logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ color: ORANGE, fontSize: 28 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
              Admin Portal
            </Typography>
          </Box>

          {/* Heading */}
          <Chip
            icon={<LockRoundedIcon sx={{ fontSize: 13, color: `${ORANGE} !important` }} />}
            label="Restricted Access"
            size="small"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(234,107,61,0.10)',
              color: ORANGE_DARK,
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 0.8,
              border: `1px solid rgba(234,107,61,0.22)`
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 28, md: 30 },
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              mb: 0.75
            }}
          >
            Sign In
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', mb: 3.5, lineHeight: 1.6 }}>
            Enter your credentials to access the admin dashboard.
          </Typography>

          {submitError && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}
            >
              {submitError}
            </Alert>
          )}

          {/* Form */}
          <Paper
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            elevation={0}
            sx={{ backgroundColor: 'transparent' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Email */}
              <Box>
                <Typography
                  sx={{ mb: 0.75, fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="admin@example.com"
                  type="text"
                  variant="outlined"
                  error={!!errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon fontSize="small" sx={{ color: errors.email ? 'error.main' : '#9ca3af' }} />
                      </InputAdornment>
                    )
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  })}
                  sx={inputSx}
                />
                <FieldErrorAlert errors={errors} fieldName="email" />
              </Box>

              {/* Password */}
              <Box>
                <Typography
                  sx={{ mb: 0.75, fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" sx={{ color: errors.password ? 'error.main' : '#9ca3af' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: '#9ca3af' }}
                        >
                          {showPassword
                            ? <VisibilityOffOutlinedIcon fontSize="small" />
                            : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...register('password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                  sx={inputSx}
                />
                <FieldErrorAlert errors={errors} fieldName="password" />
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 0.5,
                  height: 50,
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: `linear-gradient(135deg, ${ORANGE_DEEP}, ${ORANGE})`,
                  boxShadow: `0 8px 24px rgba(234,107,61,0.35)`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ORANGE_DARK}, ${ORANGE})`,
                    boxShadow: `0 12px 32px rgba(234,107,61,0.48)`,
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.08)',
                    boxShadow: 'none'
                  }
                }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>
          </Paper>

          <Typography
            sx={{ mt: 3.5, textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}
          >
            This portal is restricted to authorized administrators only.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}