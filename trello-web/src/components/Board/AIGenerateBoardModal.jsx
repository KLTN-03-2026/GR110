import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

function AIGenerateBoardModal({
  isOpen,
  handleClose,
  handleGenerate,
  isSubmitting
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const onClose = () => {
    if (isSubmitting) return
    setPrompt('')
    handleClose()
  }

  const onGenerate = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isSubmitting) return

    try {
      const board = await handleGenerate(trimmed)
      if (board?._id) {
        setPrompt('')
        handleClose()
        navigate(`/boards/${board._id}`)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AI board generation error:', err)
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '94%', sm: 560 },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '22px',
          boxShadow: isDark
            ? '0 28px 90px rgba(0,0,0,0.52)'
            : '0 28px 90px rgba(15,23,42,0.20)',
          outline: 'none'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 2.25, sm: 3 },
            py: 2.25,
            color: 'white',
            background: 'linear-gradient(135deg, #92400e, #d97706)'
          }}
        >
          <Box sx={dotPatternSx} />

          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.16)'
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{ color: '#fbbf24', fontSize: 22 }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  AI Generate Board
                </Typography>
                <Typography
                  sx={{
                    mt: 0.25,
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5
                  }}
                >
                  Describe your project and AI will create a complete board.
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              size="small"
              disabled={isSubmitting}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.10)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2.25, sm: 3 } }}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '18px',
              p: 2.25,
              mb: 2.25,
              background: isDark
                ? 'linear-gradient(135deg, rgba(180,83,9,0.20), rgba(15,23,42,0.54))'
                : 'linear-gradient(135deg, #fff7ed, #ffffff)',
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(
                    theme.palette.warning.main,
                    isDark ? 0.18 : 0.14
                  ),
                  color: isDark
                    ? theme.palette.warning.light
                    : theme.palette.warning.dark
                }}
              >
                <AutoAwesomeRoundedIcon />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                  Generate from a prompt
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                >
                  AI will create board columns and cards from your description.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="E.g. A mobile app launch for a food delivery startup with marketing, development, and testing phases..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSubmitting}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                alignItems: 'flex-start'
              }
            }}
          />

          {isSubmitting && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: '12px',
                bgcolor: isDark
                  ? alpha(theme.palette.warning.main, 0.08)
                  : alpha(theme.palette.warning.main, 0.06)
              }}
            >
              <CircularProgress size={20} sx={{ color: '#f59e0b' }} />
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                AI is generating your board... this may take a few seconds.
              </Typography>
            </Stack>
          )}

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1.5}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                minWidth: 108,
                textTransform: 'none',
                borderRadius: '999px',
                fontWeight: 700
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={onGenerate}
              disabled={!prompt.trim() || isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AutoAwesomeRoundedIcon />
                )
              }
              sx={{
                minWidth: 156,
                textTransform: 'none',
                borderRadius: '999px',
                fontWeight: 800,
                bgcolor: '#d97706',
                boxShadow: '0 8px 22px rgba(217,119,6,0.26)',
                '&:hover': { bgcolor: '#b45309' }
              }}
            >
              {isSubmitting ? 'Generating...' : 'Generate Board'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}

export default AIGenerateBoardModal
