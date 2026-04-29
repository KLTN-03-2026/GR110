import { useTheme } from '@emotion/react'
import { alpha, Box, Paper, Stack, Typography } from '@mui/material'
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'

const sectionConfig = {
  workspace: {
    title: 'Workspace limits',
    description:
      'Members, boards, custom roles, and storage used by this workspace.',
    icon: DataUsageRoundedIcon,
    color: '#2563eb'
  },
  rules: {
    title: 'Upload rules',
    description: 'Fixed upload restrictions from the current plan.',
    icon: RuleRoundedIcon,
    color: '#ea580c'
  }
}

const formatValue = (value, unit) => {
  const safeValue = Number(value || 0)
  return `${safeValue.toLocaleString()}${unit ? ` ${unit}` : ''}`
}

export function RuleSection({ items }) {
  const theme = useTheme()
  const config = sectionConfig.rules
  const Icon = config.icon

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : '#f8fafc',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              color: config.color,
              bgcolor: alpha(config.color, 0.1)
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800 }}>{config.title}</Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.25 }}
            >
              {config.description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 1.5
        }}
      >
        {items.map((item) => (
          <Box
            key={item.key}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: `1px solid ${alpha(config.color, 0.16)}`,
              bgcolor: alpha(config.color, 0.045)
            }}
          >
            <Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>
            <Typography
              sx={{ fontSize: 26, fontWeight: 900, color: config.color, mt: 1 }}
            >
              {formatValue(item.limit, item.unit)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.5 }}
            >
              Plan rule
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
