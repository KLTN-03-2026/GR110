import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Chip,
  Button
} from '@mui/material'
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { alpha, useTheme } from '@mui/material/styles'

function WorkspaceHeader({ workspace, handleOpenUpdateModal }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const title = workspace?.title || 'Untitled Workspace'
  const description = workspace?.description || 'No description'

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, transparent 48%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent 50%)`
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: 160, sm: 240 },
          height: '100%',
          opacity: isDark ? 0.16 : 0.22,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          color: theme.palette.primary.main
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2.5}
        sx={{ position: 'relative', p: { xs: 2.5, sm: 3 } }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Avatar
            sx={{
              width: { xs: 58, sm: 68 },
              height: { xs: 58, sm: 68 },
              fontSize: { xs: 24, sm: 28 },
              fontWeight: 900,
              borderRadius: '18px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              border: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
              boxShadow: `0 14px 32px ${alpha(theme.palette.primary.main, 0.24)}`,
              flexShrink: 0
            }}
          >
            {workspace?.title?.charAt(0)?.toUpperCase() || 'W'}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              <Chip
                icon={<WorkspacesOutlinedIcon sx={{ fontSize: 15 }} />}
                label="Workspace"
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 800,
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                  '& .MuiChip-icon': { color: 'primary.main' }
                }}
              />

              <Chip
                icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 15 }} />}
                label={`${workspace?.planName || 'Free'} plan`}
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 800,
                  color: isDark ? '#bfdbfe' : '#1d4ed8',
                  bgcolor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : alpha(theme.palette.common.white, 0.75),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                  '& .MuiChip-icon': { color: 'inherit' }
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: 0,
                  color: 'text.primary',
                  overflowWrap: 'anywhere'
                }}
              >
                {title}
              </Typography>

              <IconButton
                size="small"
                onClick={handleOpenUpdateModal}
                sx={{
                  width: 34,
                  height: 34,
                  color: 'text.secondary',
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  flexShrink: 0,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 760,
                lineHeight: 1.65,
                overflowWrap: 'anywhere'
              }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'row', md: 'column' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
          justifyContent="center"
          sx={{ flexShrink: 0 }}
        >
          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={handleOpenUpdateModal}
            sx={{
              borderRadius: '999px',
              px: 2.5,
              minWidth: 140,
              fontWeight: 800,
              boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.26)}`
            }}
          >
            Edit
          </Button>

          <Divider
            flexItem
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 120,
              alignSelf: 'flex-end'
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: '14px',
              color: 'text.secondary',
              bgcolor: alpha(theme.palette.text.primary, isDark ? 0.08 : 0.04),
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`
            }}
          >
            <ViewKanbanOutlinedIcon sx={{ fontSize: 19, color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
              Workspace hub
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default WorkspaceHeader