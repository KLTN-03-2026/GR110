import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

function formatPrice(value, locale = 'en-US') {
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale).format(value)
  }

  if (typeof value === 'string') {
    const numeric = Number(String(value).replace(/[^\d]/g, ''))
    return new Intl.NumberFormat(locale).format(numeric || 0)
  }

  return '0'
}

export function PlanPrice({ price, unit, interval, selected = false }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.75,
          flexWrap: 'nowrap'
        }}
      >
        <Typography
          component='span'
          sx={{
            fontSize: '24px !important',
            fontWeight: 700,
            color: selected
              ? theme.palette.primary.main
              : isDark
                ? alpha(theme.palette.text.primary, 0.72)
                : theme.palette.text.secondary,
            lineHeight: 1,
            flexShrink: 0
          }}
        >
          ₫
        </Typography>

        <Typography
          component='span'
          sx={{
            fontSize: { xs: '34px !important', md: '38px !important' },
            lineHeight: '0.95 !important',
            fontWeight: '900 !important',
            letterSpacing: '-0.05em',
            color: 'text.primary',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block'
          }}
        >
          {formatPrice(price)}
        </Typography>

        <Typography
          component='span'
          sx={{
            fontSize: '15px !important',
            fontWeight: 600,
            color: 'text.secondary',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {unit} / {interval}
        </Typography>
      </Box>
    </Box>
  )
}