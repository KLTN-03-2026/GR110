import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'

function WorkspacePageHeader({
  badgeIcon,
  badgeLabel,
  title,
  description,
  accentColor = '#2563eb',
  children
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        mb: 3,
        px: { xs: 3, md: 5 },
        py: { xs: 3.5, md: 4 },
        border: `1px solid ${
          isDark
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(accentColor, 0.18)
        }`,
        color: isDark ? 'common.white' : 'text.primary',
        background: isDark
          ? `linear-gradient(145deg, #0b1220 0%, ${alpha(accentColor, 0.28)} 58%, #111827 100%)`
          : `linear-gradient(145deg, ${alpha(accentColor, 0.14)} 0%, ${theme.palette.background.paper} 55%, ${alpha(accentColor, 0.06)} 100%)`,
        boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          color: isDark
            ? alpha(theme.palette.common.white, 0.18)
            : alpha(accentColor, 0.18),
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px'
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2.5}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Chip
            icon={badgeIcon}
            label={badgeLabel}
            size="small"
            sx={{
              mb: 1.5,
              height: 28,
              color: isDark ? '#bfdbfe' : accentColor,
              bgcolor: isDark
                ? alpha(theme.palette.common.white, 0.1)
                : alpha(accentColor, 0.08),
              border: `1px solid ${
                isDark
                  ? alpha(theme.palette.common.white, 0.16)
                  : alpha(accentColor, 0.18)
              }`,
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: 1,
              '& .MuiChip-icon': {
                color: isDark ? '#93c5fd' : accentColor
              }
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: 0,
              mb: 0.5,
              color: isDark ? 'common.white' : 'text.primary',
              overflowWrap: 'anywhere'
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: isDark
                ? alpha(theme.palette.common.white, 0.72)
                : 'text.secondary',
              fontSize: '0.875rem',
              maxWidth: 720,
              overflowWrap: 'anywhere'
            }}
          >
            {description}
          </Typography>
        </Box>

        {children && (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {children}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default WorkspacePageHeader
