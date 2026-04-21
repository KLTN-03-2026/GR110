import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ICON_MAP } from '~/constant/BillingIcons'

export function FeatureItem({ iconKey, text, selected = false }) {
  const Icon = ICON_MAP[iconKey]
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr',
        gap: 1.25,
        alignItems: 'start'
      }}
    >
      <Box
        sx={{
          mt: '1px',
          width: 28,
          height: 28,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected
            ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1)
            : isDark
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.04),
          color: selected
            ? theme.palette.primary.main
            : isDark
              ? alpha(theme.palette.text.primary, 0.72)
              : theme.palette.text.secondary
        }}
      >
        {Icon ? <Icon fontSize='small' /> : null}
      </Box>

      <Typography
        variant='body2'
        sx={{
          color: 'text.secondary',
          lineHeight: 1.5,
          fontSize: 14,
          fontWeight: 500
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}