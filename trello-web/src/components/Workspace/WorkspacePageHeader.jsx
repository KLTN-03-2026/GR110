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
        minHeight: 140,
        borderRadius: '24px',
        mb: 3,
        px: { xs: 3, md: 3.5 },
        py: { xs: 3.5, md: 2.5 },
        border: `1px solid ${
          isDark
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(accentColor, 0.18)
        }`,
        color: isDark ? 'common.white' : 'text.primary',
        background: isDark
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, transparent 48%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent 50%)`
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
            variant="h6"
            sx={{
              lineHeight: 1.2,
              letterSpacing: 0,
              fontWeight: 700,
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
