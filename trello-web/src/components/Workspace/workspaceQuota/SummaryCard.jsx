import { useTheme } from '@emotion/react'
import { alpha, Box, Paper, Stack, Typography } from '@mui/material'

export function SummaryCard({ icon: Icon, label, value, caption, color }) {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)'
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            color,
            bgcolor: alpha(color, 0.1),
            flexShrink: 0
          }}
        >
          <Icon fontSize="small" />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.25 }}
          >
            {label}
          </Typography>
          {caption && (
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.disabled', mt: 0.25 }}
            >
              {caption}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}
