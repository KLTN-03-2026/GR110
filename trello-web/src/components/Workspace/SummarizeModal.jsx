import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { alpha, useTheme } from '@mui/material/styles'
import { summarizeWorkspaceAPI } from '~/apis/workspace.api'

const MarkdownComponents = (theme, isDark) => ({
  h2: ({ children }) => (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 800,
        fontSize: '0.95rem',
        mt: 2.5,
        mb: 1,
        pb: 0.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary'
      }}
    >
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography
      sx={{
        fontSize: '0.9rem',
        lineHeight: 1.8,
        color: 'text.secondary',
        mb: 1
      }}
    >
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 2.5, mb: 1, mt: 0.5 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box
      component="li"
      sx={{
        fontSize: '0.9rem',
        lineHeight: 1.8,
        color: 'text.secondary',
        mb: 0.5
      }}
    >
      {children}
    </Box>
  ),
  strong: ({ children }) => (
    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
      {children}
    </Box>
  )
})

function SummarizeModal({ isOpen, onClose, workspaceId }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (isOpen && !summary && !loading && !error) {
      fetchSummary()
    }
  }, [isOpen])

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    setSummary(null)
    try {
      const result = await summarizeWorkspaceAPI(workspaceId)
      setSummary(result)
    } catch (err) {
      console.error('Error summarizing workspace:', err)
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to summarize workspace. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSummary(null)
    setError(null)
    setLoading(false)
    onClose()
  }

  const renderSkeletons = () => (
    <Stack spacing={1.5}>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
        This AI summary may take up to a minute. Please wait while we analyze
        your workspace…
      </Typography>
      {[60, 100, 95, 85, 70, 60, 100, 90, 75].map((w, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={i % 3 === 0 ? 32 : 20}
          width={`${w}%`}
        />
      ))}
    </Stack>
  )

  const renderContent = () => {
    if (loading) return renderSkeletons()

    if (error) {
      return (
        <Stack spacing={2}>
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            sx={{ borderRadius: '12px' }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={fetchSummary}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Try Again
          </Button>
        </Stack>
      )
    }

    if (summary) {
      return (
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: isDark
                ? alpha(theme.palette.success.main, 0.08)
                : alpha(theme.palette.success.main, 0.06),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ color: 'success.main', flexShrink: 0 }}
            />
            <Typography sx={{ color: 'success.dark', fontSize: '0.9rem' }}>
              Summary generated successfully
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              bgcolor: isDark
                ? alpha(theme.palette.common.white, 0.04)
                : alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <ReactMarkdown components={MarkdownComponents(theme, isDark)}>
              {summary}
            </ReactMarkdown>
          </Paper>
        </Stack>
      )
    }

    return null
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="summarize-modal-title"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '94%', sm: 1000 },
            minHeight: '50vh',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '22px',
            bgcolor: 'background.paper',
            boxShadow: isDark
              ? '0 28px 90px rgba(0,0,0,0.52)'
              : '0 28px 90px rgba(15,23,42,0.20)',
            outline: 'none'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              px: { xs: 2.25, sm: 3 },
              py: 2.25,
              color: isDark ? 'common.white' : 'text.primary',
              background: isDark
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, transparent 48%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent 50%)`
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: isDark
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${isDark
                        ? alpha(theme.palette.common.white, 0.16)
                        : alpha(theme.palette.primary.main, 0.18)
                      }`
                  }}
                >
                  <AutoAwesomeIcon
                    sx={{
                      color: isDark
                        ? '#f0f4ff'
                        : theme.palette.primary.main,
                      fontSize: 22
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    id="summarize-modal-title"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      color: isDark ? 'common.white' : 'text.primary'
                    }}
                  >
                    Workspace Summary
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      color: isDark
                        ? alpha(theme.palette.common.white, 0.72)
                        : 'text.secondary',
                      fontSize: '0.82rem'
                    }}
                  >
                    {loading
                      ? 'Generating summary with AI...'
                      : 'Here is your workspace summary'}
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  color: isDark ? 'common.white' : 'text.primary',
                  bgcolor: isDark
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.text.primary, 0.06),
                  '&:hover': {
                    bgcolor: isDark
                      ? alpha(theme.palette.common.white, 0.18)
                      : alpha(theme.palette.text.primary, 0.1)
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box
            sx={{
              p: { xs: 2.25, sm: 3 },
              maxHeight: 'calc(90vh - 160px)',
              overflowY: 'auto'
            }}
          >
            {renderContent()}
          </Box>

          {/* Footer */}
          {!loading && (
            <Box
              sx={{
                px: { xs: 2.25, sm: 3 },
                pb: { xs: 2.25, sm: 3 },
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  minWidth: 110,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}

export default SummarizeModal
