import { alpha, Box, Paper, Stack, Typography, useTheme } from '@mui/material'

export default function SummaryCard({ label, value, icon }) {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Typography
            sx={{ fontSize: 24, fontWeight: 800, color: 'text.primary' }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
