import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { alpha, useTheme } from '@mui/material/styles'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useState } from 'react'
import SummarizeModal from './SummarizeModal'

function WorkspaceHeader({ workspace, handleOpenUpdateModal }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false)
  const title = workspace?.title || 'Untitled Workspace'
  const description = workspace?.description || 'No description'

  const handleOpenSummarizeModal = () => {
    setIsSummarizeOpen(true)
  }

  const handleCloseSummarizeModal = () => {
    setIsSummarizeOpen(false)
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          height: '120px'
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
                width: { xs: 58, sm: 60 },
                height: { xs: 58, sm: 60 },
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
                sx={{ minWidth: 0 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: 0,
                    color: 'text.primary',
                    overflowWrap: 'anywhere',
                    fontSize: 25
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
            <Chip
              icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 15 }} />}
              label={`${workspace?.planName || 'Free'} plan`}
              size="small"
              sx={{
                height: 25,
                fontWeight: 800,
                color: isDark ? '#bfdbfe' : '#1d4ed8',
                p: '0 10px',
                bgcolor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : alpha(theme.palette.common.white, 0.75),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                '& .MuiChip-icon': { color: 'inherit' }
              }}
            />
            <Divider
              flexItem
              sx={{
                display: { xs: 'none', md: 'block' },
                width: 120,
                alignSelf: 'flex-end'
              }}
            />
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleOpenSummarizeModal}
              sx={(theme) => ({
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '999px',
                px: 3,
                py: 1.2,
                minWidth: 200,
                fontWeight: 800,
                height: 35,
                letterSpacing: 0.4,
                textTransform: 'none',

                // 🌈 Gradient AI style
                background: `linear-gradient(135deg,
      ${theme.palette.primary.main},
      ${theme.palette.secondary.main}
    )`,

                transition: 'all .25s ease',

                // 👆 Hover nâng lên + glow mạnh hơn
                '&:hover': {
                  transform: 'translateY(-2px)'
                },

                // 🫧 Light effect chạy ngang (AI vibe)
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-120%',
                  width: '120%',
                  height: '100%',
                  background: `linear-gradient(
        120deg,
        transparent,
        ${alpha('#fff', 0.25)},
        transparent
      )`,
                  transition: 'all .6s ease'
                },

                '&:hover::before': {
                  left: '120%'
                },

                // Icon spacing đẹp hơn
                '& .MuiButton-startIcon': {
                  marginRight: 1
                }
              })}
            >
              Summarize with AI
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <SummarizeModal
        isOpen={isSummarizeOpen}
        onClose={handleCloseSummarizeModal}
        workspaceId={workspace?._id}
      />
    </>
  )
}

export default WorkspaceHeader
