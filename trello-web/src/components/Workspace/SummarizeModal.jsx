import { useEffect, useState } from 'react'
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
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { alpha, useTheme } from '@mui/material/styles'
import { summarizeWorkspaceAPI } from '~/apis/workspace.api'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

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
      // eslint-disable-next-line no-console
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

  const handleRetry = () => {
    fetchSummary()
  }

  const modalConfig = {
    'aria-labelledby': 'summarize-modal-title',
    closeAfterTransition: true,
    slots: { backdrop: Backdrop },
    slotProps: {
      backdrop: {
        timeout: 400
      }
    }
  }

  const renderSkeletons = () => (
    <Stack spacing={1.5}>
      <Typography>
        This AI summary may take up to a minute. Please wait while we analyze
        your workspace…
      </Typography>
      <Skeleton variant="text" height={32} width="60%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Skeleton variant="text" height={20} width="95%" />
      <Skeleton variant="text" height={20} width="85%" />
      <Box sx={{ pt: 1 }}>
        <Skeleton variant="text" height={20} width="70%" />
      </Box>
      <Skeleton variant="text" height={32} width="60%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Skeleton variant="text" height={20} width="95%" />
      <Skeleton variant="text" height={20} width="85%" />
      <Box sx={{ pt: 1 }}>
        <Skeleton variant="text" height={20} width="70%" />
      </Box>
      <Skeleton variant="text" height={32} width="60%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Skeleton variant="text" height={20} width="95%" />
      <Skeleton variant="text" height={20} width="85%" />
      <Box sx={{ pt: 1 }}>
        <Skeleton variant="text" height={20} width="70%" />
      </Box>
    </Stack>
  )

  const renderContent = () => {
    if (loading) {
      return renderSkeletons()
    }

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
            onClick={handleRetry}
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
      const summaryData = typeof summary === 'string' ? { summary } : summary
      const { summary: summaryText, insights, risks, suggestions } = summaryData

      return (
        <Stack spacing={2.5}>
          {/* Success Alert */}
          <Stack
            direction="row"
            alignItems="flex-start"
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
              sx={{
                color: 'success.main',
                mt: 0.5,
                flexShrink: 0
              }}
            />
            <Typography
              sx={{
                color: 'success.dark',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              Summary generated successfully
            </Typography>
          </Stack>

          {/* Summary Section */}
          {summaryText && (
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
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                  mb: 1.5
                }}
              >
                📋 Summary
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {summaryText}
              </Typography>
            </Paper>
          )}

          {/* Insights Section */}
          {insights && Array.isArray(insights) && insights.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                bgcolor: isDark
                  ? alpha(theme.palette.info.main, 0.05)
                  : alpha(theme.palette.info.main, 0.03),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LightbulbIcon sx={{ fontSize: 20, color: 'info.main' }} />
                Insights
              </Typography>
              <List sx={{ p: 0 }}>
                {insights.map((insight, idx) => (
                  <Box key={idx}>
                    <ListItem
                      sx={{
                        py: 1.5,
                        px: 0,
                        alignItems: 'flex-start'
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          mt: 0.25,
                          color: 'info.main'
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'info.main'
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              color: 'text.primary'
                            }}
                          >
                            {insight}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < insights.length - 1 && <Divider sx={{ my: 0 }} />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}

          {/* Risks Section */}
          {risks && Array.isArray(risks) && risks.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                bgcolor: isDark
                  ? alpha(theme.palette.warning.main, 0.05)
                  : alpha(theme.palette.warning.main, 0.03),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <WarningAmberIcon
                  sx={{ fontSize: 20, color: 'warning.main' }}
                />
                Risks
              </Typography>
              <List sx={{ p: 0 }}>
                {risks.map((risk, idx) => (
                  <Box key={idx}>
                    <ListItem
                      sx={{
                        py: 1.5,
                        px: 0,
                        alignItems: 'flex-start'
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          mt: 0.25,
                          color: 'warning.main'
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'warning.main'
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              color: 'text.primary'
                            }}
                          >
                            {risk}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < risks.length - 1 && <Divider sx={{ my: 0 }} />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}

          {/* Suggestions Section */}
          {suggestions &&
            Array.isArray(suggestions) &&
            suggestions.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  bgcolor: isDark
                    ? alpha(theme.palette.success.main, 0.05)
                    : alpha(theme.palette.success.main, 0.03),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'text.primary',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TipsAndUpdatesIcon
                    sx={{ fontSize: 20, color: 'success.main' }}
                  />
                  Suggestions
                </Typography>
                <List sx={{ p: 0 }}>
                  {suggestions.map((suggestion, idx) => (
                    <Box key={idx}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 0,
                          alignItems: 'flex-start'
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            mt: 0.25,
                            color: 'success.main'
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'success.main'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                color: 'text.primary'
                              }}
                            >
                              {suggestion}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {idx < suggestions.length - 1 && (
                        <Divider sx={{ my: 0 }} />
                      )}
                    </Box>
                  ))}
                </List>
              </Paper>
            )}
        </Stack>
      )
    }

    return null
  }

  return (
    <Modal open={isOpen} onClose={handleClose} {...modalConfig}>
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
              color: 'white',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
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
                  <AutoAwesomeIcon sx={{ color: '#f0f4ff', fontSize: 22 }} />
                </Box>

                <Box>
                  <Typography
                    id="summarize-modal-title"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      lineHeight: 1.3
                    }}
                  >
                    Workspace Summary
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.25,
                      color: 'rgba(255,255,255,0.72)',
                      fontSize: '0.82rem',
                      lineHeight: 1.5
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
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.10)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' }
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
                gap: 1.5,
                justifyContent: 'flex-end'
              }}
            >
              <Button
                type="button"
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
