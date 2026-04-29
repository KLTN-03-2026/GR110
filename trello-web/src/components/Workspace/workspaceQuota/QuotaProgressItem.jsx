import { useTheme } from '@emotion/react'
import { alpha, Box, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

const getUsageColor = (percent, theme) => {
  if (percent >= 90) return theme.palette.error.main
  if (percent >= 70) return theme.palette.warning.main
  return theme.palette.primary.main
}

const formatValue = (value, unit) => {
  const safeValue = Number(value || 0)
  return `${safeValue.toLocaleString()}${unit ? ` ${unit}` : ''}`
}

export function QuotaProgressItem({ item }) {
  const theme = useTheme()
  const color = getUsageColor(item.percent, theme)
  const isNearLimit = item.percent >= 70

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '14px',
        border: `1px solid ${alpha(color, isNearLimit ? 0.28 : 0.12)}`,
        bgcolor: isNearLimit ? alpha(color, 0.045) : 'transparent'
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
              {item.label}
            </Typography>
            {isNearLimit && (
              <WarningAmberRoundedIcon sx={{ fontSize: 16, color }} />
            )}
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.25 }}
          >
            {formatValue(item.used, item.unit)} used of{' '}
            {formatValue(item.limit, item.unit)}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${item.remaining.toLocaleString()}${item.unit ? ` ${item.unit}` : ''} left`}
          sx={{
            height: 28,
            fontWeight: 700,
            color,
            bgcolor: alpha(color, 0.08),
            border: `1px solid ${alpha(color, 0.18)}`
          }}
        />
      </Stack>

      <Box sx={{ mt: 1.75 }}>
        <LinearProgress
          variant="determinate"
          value={item.percent}
          sx={{
            height: 9,
            borderRadius: 999,
            bgcolor: alpha(color, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              bgcolor: color
            }
          }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Current usage
          </Typography>
          <Typography variant="caption" sx={{ color, fontWeight: 800 }}>
            {item.percent}%
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}
