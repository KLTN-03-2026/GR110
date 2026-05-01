import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import BoardTab from '../BoardModal/Tab/Tab'
import CloseIcon from '@mui/icons-material/Close'
import modalConfig from '~/config/modalConfig'
import { alpha, Fade, Stack } from '@mui/material'
import { useTheme } from '@emotion/react'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 500,
    md: 1000
  },
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 6,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}

export default function BoardModal({ boardModal }) {
  const { open, handleClose } = boardModal
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Modal {...modalConfig} open={open} onClose={handleClose}>
      <Fade in={open}>
        <Box sx={style}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              px: { xs: 2.5, md: 3 },
              py: 2.5,
              pr: { xs: 7.5, md: 7 },
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: isDark
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, transparent 58%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, transparent 62%)`
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ position: 'relative', zIndex: 1, minWidth: 0, maxWidth: '100%' }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.contrastText',
                  bgcolor: 'primary.main',
                  boxShadow: `0 10px 24px ${alpha(
                    theme.palette.primary.main,
                    0.26
                  )}`,
                  flexShrink: 0
                }}
              >
                <ViewKanbanRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: 'text.primary'
                  }}
                >
                  Board Details
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mt: 0.25,
                    lineHeight: 1.5,
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere'
                  }}
                >
                  View and manage board information, members, and settings.
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'text.secondary',
                bgcolor: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.05),
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: alpha(
                    theme.palette.text.primary,
                    isDark ? 0.16 : 0.08
                  )
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              mt: 2,
              px: 3,
              pb: 3,
              flex: 1,
              overflow: 'auto',
              minHeight: 0
            }}
          >
            <BoardTab />
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
