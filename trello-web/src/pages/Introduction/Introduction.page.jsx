import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'

const TELEGRAM_SUPPORT_LINK =
  'https://web.telegram.org/k/#@taskio_support_demo_bot'

function IntroductionPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const workspaces = useSelector((state) => state.workspaces || [])

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentTime = useMemo(() => {
    return now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }, [now])

  const currentDate = useMemo(() => {
    return now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }, [now])

  const firstWorkspace = workspaces[0]
  const displayName =
    currentUser?.displayName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email?.split('@')?.[0] ||
    'there'

  const quickActions = [
    {
      label: 'Open Tickets',
      description: 'Create support requests and track status updates.',
      icon: <ConfirmationNumberRoundedIcon />,
      onClick: () => navigate('/h/tickets')
    },
    {
      label: 'Workspace Boards',
      description: firstWorkspace
        ? 'Jump into your first workspace boards.'
        : 'Available after creating your first workspace.',
      icon: <DashboardOutlinedIcon />,
      onClick: () =>
        firstWorkspace &&
        navigate(`/h/workspaces/${firstWorkspace._id}/boards`),
      disabled: !firstWorkspace
    },
    {
      label: 'Explore Product',
      description: 'View product overview and guidance.',
      icon: <InfoOutlinedIcon />,
      onClick: () => navigate('/landing-page')
    },
    {
      label: 'Telegram Support',
      description: 'Get automated support through our n8n-powered bot.',
      icon: <SupportAgentRoundedIcon />,
      onClick: () =>
        window.open(TELEGRAM_SUPPORT_LINK, '_blank', 'noopener,noreferrer')
    }
  ]

  const workspaceLinks = [
    {
      label: 'Boards',
      icon: <DashboardOutlinedIcon fontSize="small" />,
      key: 'boards'
    },
    {
      label: 'Members',
      icon: <GroupOutlinedIcon fontSize="small" />,
      key: 'members'
    },
    {
      label: 'Settings',
      icon: <SettingsOutlinedIcon fontSize="small" />,
      key: 'settings'
    },
    {
      label: 'Billing',
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
      key: 'billing'
    },
    {
      label: 'Quota',
      icon: <AssignmentOutlinedIcon fontSize="small" />,
      key: 'quota'
    }
  ]

  const infoCards = [
    {
      label: 'Automation Ready',
      value: 'n8n Bot',
      description: 'Support flow can reply automatically through Telegram.',
      icon: <SmartToyRoundedIcon />
    },
    {
      label: 'Fast Access',
      value: '1 Click',
      description: 'Open your support channel instantly when you need help.',
      icon: <BoltRoundedIcon />
    },
    {
      label: 'System Status',
      value: 'Active',
      description: 'Workspace and ticket actions are ready to use.',
      icon: <CheckCircleRoundedIcon />
    }
  ]

  const dayOfWeek = useMemo(() => {
    return now.toLocaleDateString('en-US', {
      weekday: 'long'
    })
  }, [now])

  const weekNumber = useMemo(() => {
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }, [now])

  const timeZone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon'
  }, [])

  const timeZoneOffset = useMemo(() => {
    const offsetMinutes = -now.getTimezoneOffset()
    const sign = offsetMinutes >= 0 ? '+' : '-'
    const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(
      2,
      '0'
    )
    const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, '0')

    return `UTC${sign}${hours}:${minutes}`
  }, [now])

  return (
    <Stack spacing={2.5}>

      <WorkspacePageHeader
        badgeIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="Welcome"
        title={`Welcome back, ${displayName}`}
        description="Manage workspaces, monitor quotas, and keep delivery moving."
      >
        <Button
          variant="contained"
          startIcon={<RocketLaunchRoundedIcon />}
          onClick={() =>
            firstWorkspace
              ? navigate(`/h/workspaces/${firstWorkspace._id}/boards`)
              : navigate('/h/tickets')
          }
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '999px',
            px: 3,
            py: 1.15,
            backgroundColor: 'white',
            color: '#1d4ed8',
            boxShadow: '0 6px 20px rgba(0,0,0,0.20)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.92)',
              transform: 'translateY(-1px)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.25)'
            }
          }}
        >
          {firstWorkspace ? 'Go to Workspace' : 'Open Tickets'}
        </Button>
      </WorkspacePageHeader>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr 1fr'
          },
          gap: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            minHeight: 126,
            borderRadius: '14px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? '#2c2c2a' : theme.palette.background.paper,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              mb: 1
            }}
          >
            Current Time
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 900,
              fontSize: { xs: 28, md: 32 },
              lineHeight: 1
            }}
          >
            {currentTime}
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              fontSize: '0.95rem',
              mt: 1.2
            }}
          >
            {currentDate}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            minHeight: 126,
            borderRadius: '14px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? '#2c2c2a' : theme.palette.background.paper,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Day of Week
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 900,
              fontSize: 22,
              lineHeight: 1.1
            }}
          >
            {dayOfWeek}
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              fontSize: '0.95rem',
              mt: 1.1
            }}
          >
            Week {weekNumber}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            minHeight: 126,
            borderRadius: '14px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? '#2c2c2a' : theme.palette.background.paper,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              mb: 1.5
            }}
          >
            Your Timezone
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 900,
              fontSize: 18,
              lineHeight: 1.2
            }}
          >
            {timeZone}
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              fontSize: '0.95rem',
              mt: 1.1
            }}
          >
            {timeZoneOffset}
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))'
          },
          gap: 2
        }}
      >
        {quickActions.map((action) => (
          <Paper
            key={action.label}
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
            }}
          >
            <Stack spacing={1.25} sx={{ height: '100%' }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.2 : 0.1
                  ),
                  color: 'primary.main'
                }}
              >
                {action.icon}
              </Box>

              <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                {action.label}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {action.description}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                endIcon={<LaunchRoundedIcon />}
                disabled={action.disabled}
                onClick={action.onClick}
                sx={{
                  mt: 'auto',
                  alignSelf: 'flex-start',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700
                }}
              >
                Open
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.35fr 0.65fr' },
          gap: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: '16px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
                Support Center
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 0.25 }}
              >
                Need help? Message our Telegram support bot. It can be connected
                with n8n to handle common questions automatically.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: '16px',
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.16 : 0.06
                ),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '16px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: theme.palette.primary.main,
                      color: 'primary.contrastText'
                    }}
                  >
                    <SupportAgentRoundedIcon />
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      Taskio Telegram Support
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Auto support workflow powered by n8n.
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  endIcon={<LaunchRoundedIcon />}
                  onClick={() =>
                    window.open(
                      TELEGRAM_SUPPORT_LINK,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  sx={{
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 800,
                    px: 2.5
                  }}
                >
                  Open Telegram
                </Button>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                icon={<SmartToyRoundedIcon />}
                label="Auto Reply"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                icon={<BoltRoundedIcon />}
                label="n8n Workflow"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label="Support Bot Active"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: '16px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(
                    theme.palette.warning.main,
                    isDark ? 0.2 : 0.1
                  ),
                  color: 'warning.main'
                }}
              >
                <TipsAndUpdatesRoundedIcon />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800 }}>Today Tip</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Use tickets for faster tracking.
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create a ticket when you need a clear support history. For instant
              help, use Telegram bot support.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<ConfirmationNumberRoundedIcon />}
              onClick={() => navigate('/h/tickets')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                alignSelf: 'flex-start'
              }}
            >
              Create Ticket
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2
        }}
      >
        {infoCards.map((card) => (
          <Paper
            key={card.label}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(
                    theme.palette.success.main,
                    isDark ? 0.18 : 0.08
                  ),
                  color: 'success.main'
                }}
              >
                {card.icon}
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {card.label}
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '1.05rem' }}>
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.25 }}
                >
                  {card.description}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
              Your Workspaces
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.25 }}
            >
              {workspaces.length > 0
                ? `You currently have ${workspaces.length} workspace${workspaces.length > 1 ? 's' : ''}.`
                : 'No workspace yet. Use the sidebar action to create your first one.'}
            </Typography>
          </Box>

          {!workspaces.length && (
            <Chip
              icon={<AddRoundedIcon />}
              label="Create Workspace from Sidebar"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.18 : 0.08
                ),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            />
          )}
        </Stack>

        {workspaces.length > 0 && (
          <Stack spacing={1.25}>
            {workspaces.slice(0, 5).map((workspace) => (
              <Box
                key={workspace._id}
                sx={{
                  borderRadius: '14px',
                  border: `1px solid ${theme.palette.divider}`,
                  px: { xs: 1.5, md: 2 },
                  py: 1.5,
                  bgcolor: isDark
                    ? alpha(theme.palette.common.white, 0.03)
                    : alpha(theme.palette.primary.main, 0.015)
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.25}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '12px',
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: 'primary.main',
                        fontWeight: 800
                      }}
                    >
                      {workspace?.title?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {workspace.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {workspace?.planName || 'Free'} plan
                      </Typography>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    {workspaceLinks.map((item) => (
                      <Button
                        key={`${workspace._id}-${item.key}`}
                        size="small"
                        variant="outlined"
                        startIcon={item.icon}
                        onClick={() =>
                          navigate(`/h/workspaces/${workspace._id}/${item.key}`)
                        }
                        sx={{
                          borderRadius: '999px',
                          textTransform: 'none',
                          fontWeight: 700
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  )
}

export default IntroductionPage
