import {
  alpha,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

const TICKET_TYPES = [
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'bug', label: 'Bug' },
  { value: 'feedback', label: 'Feedback' }
]

function formatDateTime(value) {
  if (!value) return '--'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function getStatusConfig(status, theme) {
  const map = {
    pending: {
      label: 'Pending',
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, 0.14),
      icon: <HourglassTopRoundedIcon sx={{ fontSize: 16 }} />
    },
    processing: {
      label: 'Processing',
      color: theme.palette.info.main,
      bg: alpha(theme.palette.info.main, 0.14),
      icon: <AutorenewRoundedIcon sx={{ fontSize: 16 }} />
    },
    resolved: {
      label: 'Resolved',
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.14),
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
    },
    rejected: {
      label: 'Rejected',
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, 0.14),
      icon: <HighlightOffRoundedIcon sx={{ fontSize: 16 }} />
    }
  }

  return (
    map[status] || {
      label: status || 'Unknown',
      color: theme.palette.text.secondary,
      bg: alpha(theme.palette.text.secondary, 0.12),
      icon: <HighlightOffRoundedIcon sx={{ fontSize: 16 }} />
    }
  )
}

export default function TicketCard({ ticket }) {
  const theme = useTheme()

  const status = getStatusConfig(ticket.status, theme)

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        transition: 'all .2s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 10px 24px rgba(0,0,0,0.24)'
              : '0 10px 24px rgba(15,23,42,0.08)'
        }
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: 0.3,
                mb: 0.75
              }}
            >
              {'TICKET_' + ticket._id}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <TitleRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'text.primary',
                  wordBreak: 'break-word'
                }}
              >
                {ticket.title}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <MailOutlineRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'text.primary',
                  wordBreak: 'break-word'
                }}
              >
                {ticket.email}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {TICKET_TYPES.find((item) => item.value === ticket.type)
                  ?.label || ticket.type}
              </Typography>
            </Stack>
          </Box>

          <Chip
            size="small"
            icon={status.icon}
            label={status.label}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'flex-start' },
              color: status.color,
              bgcolor: status.bg,
              fontWeight: 700
            }}
          />
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(15,23,42,0.03)',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <NotesRoundedIcon
              sx={{ fontSize: 18, color: 'text.secondary', mt: '2px' }}
            />
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'text.primary',
                whiteSpace: 'pre-wrap',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {ticket.content}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTimeRoundedIcon
            sx={{ fontSize: 16, color: 'text.secondary' }}
          />
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {formatDateTime(ticket.updatedAt || ticket.createdAt)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
