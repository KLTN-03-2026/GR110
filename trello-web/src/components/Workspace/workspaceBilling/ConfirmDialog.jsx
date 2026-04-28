import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { alpha, useTheme } from '@mui/material/styles'

/* Map confirmColor → icon + accent colors */
function getAccent(confirmColor, theme) {
  const isDark = theme.palette.mode === 'dark'
  switch (confirmColor) {
    case 'error':
      return {
        icon: <ErrorRoundedIcon sx={{ fontSize: 28 }} />,
        bgColor: alpha(theme.palette.error.main, isDark ? 0.18 : 0.10),
        iconColor: theme.palette.error.main,
        stripColor: theme.palette.error.main
      }
    case 'warning':
      return {
        icon: <WarningAmberRoundedIcon sx={{ fontSize: 28 }} />,
        bgColor: alpha(theme.palette.warning.main, isDark ? 0.18 : 0.10),
        iconColor: theme.palette.warning.main,
        stripColor: theme.palette.warning.main
      }
    case 'success':
      return {
        icon: <CheckCircleRoundedIcon sx={{ fontSize: 28 }} />,
        bgColor: alpha(theme.palette.success.main, isDark ? 0.18 : 0.10),
        iconColor: theme.palette.success.main,
        stripColor: theme.palette.success.main
      }
    default:
      return {
        icon: <InfoRoundedIcon sx={{ fontSize: 28 }} />,
        bgColor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.10),
        iconColor: theme.palette.primary.main,
        stripColor: `linear-gradient(90deg, #1d4ed8, #38bdf8)`
      }
  }
}

function ConfirmDialog({
  open,
  title = 'Confirm Action',
  description = 'Are you sure you want to continue? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  loading = false,
  onClose,
  onConfirm
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const accent = getAccent(confirmColor, theme)

  /* Confirm button gradient per color */
  const confirmGradient = {
    error:   'linear-gradient(135deg, #b91c1c, #ef4444)',
    warning: 'linear-gradient(135deg, #b45309, #f59e0b)',
    success: 'linear-gradient(135deg, #15803d, #22c55e)',
    primary: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
    info:    'linear-gradient(135deg, #0369a1, #0ea5e9)'
  }

  const confirmShadow = {
    error:   'rgba(239,68,68,0.35)',
    warning: 'rgba(245,158,11,0.35)',
    success: 'rgba(34,197,94,0.35)',
    primary: 'rgba(37,99,235,0.35)',
    info:    'rgba(14,165,233,0.35)'
  }

  const gradient = confirmGradient[confirmColor] || confirmGradient.primary
  const shadow   = confirmShadow[confirmColor]   || confirmShadow.primary

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.55)'
            : '0 32px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Top accent strip */}
      <Box
        sx={{
          height: 5,
          background: typeof accent.stripColor === 'string' && accent.stripColor.startsWith('linear')
            ? accent.stripColor
            : accent.stripColor,
          bgcolor: typeof accent.stripColor === 'string' && !accent.stripColor.startsWith('linear')
            ? accent.stripColor
            : undefined
        }}
      />

      <DialogTitle sx={{ pt: 3, pb: 0, px: 3 }}>
        {/* Icon + title row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              backgroundColor: accent.bgColor,
              display: 'grid',
              placeItems: 'center',
              color: accent.iconColor,
              flexShrink: 0
            }}
          >
            {accent.icon}
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.7,
            fontSize: '0.875rem'
          }}
        >
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '999px',
            px: 2.5,
            py: 0.9,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.06)
            }
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          startIcon={
            loading
              ? <CircularProgress size={15} sx={{ color: 'inherit' }} />
              : null
          }
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '999px',
            px: 3,
            py: 0.9,
            fontSize: '0.875rem',
            background: gradient,
            boxShadow: `0 6px 18px ${shadow}`,
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: `0 10px 26px ${shadow}`,
              transform: 'translateY(-1px)',
              filter: 'brightness(1.08)'
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.10)',
              boxShadow: 'none',
              color: 'rgba(0,0,0,0.35)'
            }
          }}
        >
          {loading ? 'Processing…' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog