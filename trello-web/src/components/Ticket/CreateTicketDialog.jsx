import { useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import MailRoundedIcon from '@mui/icons-material/MailRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import { createTicketApi } from '~/apis/ticket.api'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

/* ── dot pattern ── */
const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  pointerEvents: 'none'
}

export default function CreateTicketDialog({
  open,
  onClose,
  loading = false,
  TICKET_TYPES,
  refetchTickets
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const currentUser = useSelector(selectCurrentUser)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: currentUser?.email,
      title: '',
      type: 'support',
      content: ''
    }
  })

  useEffect(() => {
    if (!open) return
    reset({
      email: currentUser?.email,
      title: '',
      type: 'support',
      content: ''
    })
  }, [open, reset])

  const onSubmit = async (data) => {
    await createTicketApi({ ticketData: data })
    reset({ email: currentUser?.email, title: '', type: 'support', content: '' })
    refetchTickets()
    onClose?.()
  }

  const busy = loading || isSubmitting

  /* shared field style */
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      transition: 'box-shadow 0.2s',
      '&.Mui-focused': {
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.10)}`
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.55)'
            : '0 32px 80px rgba(0,0,0,0.16)'
        }
      }}
    >
      {/* ── Gradient header ── */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
            color: 'white',
            px: 3.5,
            py: 3
          }}
        >
          <Box sx={dotPatternSx} />
          {/* glow orb */}
          <Box
            sx={{
              position: 'absolute',
              top: -40, right: -40,
              width: 180, height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<ConfirmationNumberRoundedIcon sx={{ fontSize: 13, color: '#93c5fd !important' }} />}
              label="New Ticket"
              size="small"
              sx={{
                mb: 1.5,
                backgroundColor: 'rgba(255,255,255,0.10)',
                color: '#bfdbfe',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: 1,
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)'
              }}
            />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
              Create a Ticket
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', opacity: 0.72 }}>
              Submit a support request, billing issue, or product feedback.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      {/* ── Form body ── */}
      <DialogContent sx={{ px: 3.5, pt: '24px !important', pb: 3.5 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root': {
                  ...fieldSx['& .MuiOutlinedInput-root'],
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'
                }
              }}
            />

            {/* Title */}
            <TextField
              fullWidth
              label="Title"
              placeholder="Enter a short, descriptive title"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleRoundedIcon
                      fontSize="small"
                      color={errors.title ? 'error' : 'action'}
                    />
                  </InputAdornment>
                )
              }}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 200, message: 'Title must not exceed 200 characters' }
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={fieldSx}
            />

            {/* Type */}
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Ticket Type"
                  {...field}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryRoundedIcon
                          fontSize="small"
                          color={errors.type ? 'error' : 'action'}
                        />
                      </InputAdornment>
                    )
                  }}
                  sx={fieldSx}
                >
                  {TICKET_TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value} sx={{ fontWeight: 600 }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* Content */}
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Content"
              placeholder="Describe your issue or request in detail…"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: 'flex-start', mt: 1.4 }}
                  >
                    <NotesRoundedIcon
                      fontSize="small"
                      color={errors.content ? 'error' : 'action'}
                    />
                  </InputAdornment>
                )
              }}
              {...register('content', {
                required: 'Content is required',
                minLength: { value: 10, message: 'Content must be at least 10 characters' },
                maxLength: { value: 5000, message: 'Content must not exceed 5000 characters' }
              })}
              error={!!errors.content}
              helperText={errors.content?.message}
              sx={fieldSx}
            />

            {/* Actions */}
            <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 0.5 }}>
              <Button
                variant="text"
                onClick={onClose}
                disabled={busy}
                sx={{
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '999px',
                  px: 2.5,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.06)
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={busy}
                startIcon={
                  busy
                    ? <CircularProgress size={15} sx={{ color: 'inherit' }} />
                    : <ConfirmationNumberRoundedIcon fontSize="small" />
                }
                sx={{
                  minWidth: 150,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '999px',
                  px: 3,
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  boxShadow: '0 8px 22px rgba(37,99,235,0.30)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(37,99,235,0.44)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.08)',
                    boxShadow: 'none'
                  }
                }}
              >
                {busy ? 'Submitting…' : 'Submit Ticket'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}