import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Paper,
  Skeleton,
  Stack,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { alpha } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { fetchPlanApi } from '~/apis/landingPage.api'
import { useNavigate } from 'react-router-dom'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb'
    },
    secondary: {
      main: '#0f172a'
    },
    background: {
      default: '#f6f8fc',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontWeight: 800
    },
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 16
  }
})

const features = [
  {
    title: 'Unified Workspace',
    desc: 'Manage boards, roles, members, and billing in one streamlined flow.',
    icon: <DashboardCustomizeRoundedIcon />
  },
  {
    title: 'Fast Collaboration',
    desc: 'Move tasks quickly with clear ownership and shared progress visibility.',
    icon: <GroupsRoundedIcon />
  },
  {
    title: 'Actionable Insights',
    desc: 'Track usage, quota, and performance signals to reduce delivery risks.',
    icon: <InsightsRoundedIcon />
  },
  {
    title: 'Secure by Design',
    desc: 'Role-driven permission controls for workspace and board level actions.',
    icon: <SecurityRoundedIcon />
  }
]

const workflow = [
  {
    step: '01',
    title: 'Create Workspace',
    desc: 'Set team boundaries and standardize your collaboration model.'
  },
  {
    step: '02',
    title: 'Invite Members',
    desc: 'Assign people to the right roles with clear access controls.'
  },
  {
    step: '03',
    title: 'Run Delivery',
    desc: 'Plan boards, move tasks, and keep execution visible in real time.'
  }
]

const formatPlanPrice = (price) => {
  return Number(price || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

const getPlanHighlights = (plan) => {
  const capabilities = plan?.feature?.capabilities || {}
  const limits = plan?.feature?.limits || {}

  const capabilityHighlights = [
    {
      enabled: !!capabilities?.workspace?.customRole,
      text: capabilities?.workspace?.customRole
        ? 'Custom workspace roles'
        : 'No custom workspace roles'
    },
    {
      enabled: !!capabilities?.board?.customRole,
      text: capabilities?.board?.customRole
        ? 'Custom board roles'
        : 'No custom board roles'
    },
    {
      enabled: !!capabilities?.column?.customColor,
      text: capabilities?.column?.customColor
        ? 'Custom column colors'
        : 'No custom column colors'
    },
    {
      enabled: !!capabilities?.task?.setDue,
      text: capabilities?.task?.setDue ? 'Set due dates' : 'No due dates'
    },
    {
      enabled: !!capabilities?.task?.assignMembers,
      text: capabilities?.task?.assignMembers
        ? 'Assign members to tasks'
        : 'No task assignment'
    }
  ]

  const limitHighlights = [
    { text: `Up to ${limits.maxMembers ?? 0} members`, enabled: true },
    { text: `Up to ${limits.maxBoards ?? 0} boards`, enabled: true },
    {
      text: `Up to ${limits.maxWorkspaceRoles ?? 0} workspace roles`,
      enabled: true
    },
    { text: `Up to ${limits.maxBoardRoles ?? 0} board roles`, enabled: true },
    {
      text: `Up to ${limits.maxColumnsPerBoard ?? 0} columns per board`,
      enabled: true
    },
    {
      text: `Up to ${limits.maxCardsPerBoard ?? 0} cards per board`,
      enabled: true
    },
    {
      text: `Up to ${limits.maxCommentsPerCard ?? 0} comments per card`,
      enabled: true
    },
    {
      text: `Up to ${limits.maxChecklistItemsPerCard ?? 0} checklist items per card`,
      enabled: true
    },
    { text: `Storage ${limits.maxStorageMb ?? 0} MB`, enabled: true },
    { text: `Max file size ${limits.maxFileSizeMb ?? 0} MB`, enabled: true },
    {
      text: `Up to ${limits.maxFilesPerUpload ?? 0} files per upload`,
      enabled: true
    }
  ]

  return [...capabilityHighlights, ...limitHighlights]
}

export default function LandingPage() {
  const [plans, setPlans] = useState([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plansError, setPlansError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchPlans = async () => {
      setIsLoadingPlans(true)
      try {
        const res = await fetchPlanApi()
        if (!isMounted) return

        setPlans(Array.isArray(res) ? res : [])
        setPlansError('')
      } catch {
        if (!isMounted) return

        setPlans([])
        setPlansError(
          'Unable to load plans at the moment. Please try again later.'
        )
      } finally {
        if (!isMounted) return
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary'
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            borderBottom: `1px solid ${alpha('#0f172a', 0.08)}`,
            bgcolor: alpha('#ffffff', 0.9),
            backdropFilter: 'blur(10px)'
          }}
        >
          <Container maxWidth="lg" sx={{ py: 1.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'common.white',
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                  }}
                >
                  <BoltRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Taskio
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  Product
                </Button>
                <Button
                  component="a"
                  href="#plans"
                  variant="text"
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  Pricing
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/auth/login')}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    borderRadius: '999px',
                    px: 2.25,
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    boxShadow: '0 10px 24px rgba(37,99,235,0.26)',
                    '&:hover': { boxShadow: '0 12px 28px rgba(37,99,235,0.34)' }
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              border: `1px solid ${alpha('#1d4ed8', 0.16)}`,
              bgcolor: '#ffffff',
              backgroundImage:
                'radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 38%), radial-gradient(circle at 20% 20%, rgba(16,185,129,0.12), transparent 34%)'
            }}
          >
            <Stack spacing={2}>
              <Chip
                icon={
                  <AutoAwesomeRoundedIcon
                    sx={{ fontSize: '15px !important' }}
                  />
                }
                label="Project Management Platform"
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 700,
                  bgcolor: alpha('#2563eb', 0.1),
                  color: '#1d4ed8',
                  border: `1px solid ${alpha('#2563eb', 0.2)}`
                }}
              />
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: 36, md: 56 }, maxWidth: 780 }}
              >
                Build Faster With A Workspace Built For Real Delivery
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  maxWidth: 700,
                  fontSize: { xs: 15, md: 18 }
                }}
              >
                Plan confidently, coordinate teams, and ship work with better
                visibility. Taskio brings boards, members, quota tracking, and
                billing into one seamless client workflow.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ pt: 1 }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/h/introduction')}
                  size="large"
                  startIcon={<RocketLaunchRoundedIcon />}
                  sx={{
                    borderRadius: '999px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                  }}
                >
                  Start Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: '999px',
                    px: 3,
                    py: 1.2,
                    borderColor: alpha('#1d4ed8', 0.3)
                  }}
                >
                  Explore Product
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, minmax(0,1fr))'
              },
              gap: 2
            }}
          >
            {[
              { label: 'Active Teams', value: '2,500+' },
              { label: 'Tasks Managed', value: '12M+' },
              { label: 'Avg Setup Time', value: '< 10 mins' }
            ].map((item) => (
              <Paper
                key={item.label}
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: '16px',
                  border: `1px solid ${alpha('#0f172a', 0.08)}`
                }}
              >
                <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
                  {item.value}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>

        <Container maxWidth="lg" sx={{ pb: 7 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 26, md: 38 }, mb: 2.5 }}
          >
            Everything You Need To Run A Workspace
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))'
              },
              gap: 2
            }}
          >
            {features.map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: `1px solid ${alpha('#0f172a', 0.1)}`,
                  boxShadow: '0 2px 12px rgba(15,23,42,0.04)'
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.main',
                      bgcolor: alpha('#2563eb', 0.1),
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Container>

        <Container id="plans" maxWidth="lg" sx={{ pb: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 2,
              borderRadius: '20px',
              border: `1px solid ${alpha('#1d4ed8', 0.16)}`,
              background:
                'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.06))'
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Chip
                  icon={
                    <SellRoundedIcon sx={{ fontSize: '15px !important' }} />
                  }
                  label="Plans & Pricing"
                  size="small"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    bgcolor: alpha('#2563eb', 0.1),
                    color: '#1d4ed8',
                    border: `1px solid ${alpha('#2563eb', 0.18)}`
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: 22, md: 30 }, mb: 0.4 }}
                >
                  Flexible Plans For Every Team Stage
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Start free, then upgrade when you need more capacity,
                  security, and controls.
                </Typography>
              </Box>

              <Chip
                icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />}
                label={`${plans.length} plan${plans.length !== 1 ? 's' : ''} available`}
                sx={{
                  height: 34,
                  fontWeight: 800,
                  color: '#1d4ed8',
                  bgcolor: '#ffffff',
                  border: `1px solid ${alpha('#2563eb', 0.22)}`,
                  '& .MuiChip-icon': { color: 'inherit' }
                }}
              />
            </Stack>
          </Paper>

          {plansError && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: '14px' }}>
              {plansError}
            </Alert>
          )}

          {isLoadingPlans ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))'
                },
                gap: 2
              }}
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <Paper
                  key={`plan-skeleton-${idx}`}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: '16px',
                    border: `1px solid ${alpha('#0f172a', 0.08)}`
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={38}
                    height={38}
                    sx={{ borderRadius: '12px', mb: 1.5 }}
                  />
                  <Skeleton variant="text" height={32} width="52%" />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="80%"
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="rounded"
                    height={74}
                    sx={{ borderRadius: '12px', mb: 1.5 }}
                  />
                  <Stack spacing={0.8}>
                    {Array.from({ length: 4 }).map((__, featureIndex) => (
                      <Skeleton
                        key={`${idx}-feature-${featureIndex}`}
                        height={18}
                      />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : plans.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))'
                },
                gap: 2
              }}
            >
              {plans.map((plan) => (
                <Paper
                  key={plan?._id}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: '16px',
                    border: plan?.isDefault
                      ? `1px solid ${alpha('#2563eb', 0.45)}`
                      : `1px solid ${alpha('#0f172a', 0.09)}`,
                    boxShadow: plan?.isDefault
                      ? '0 14px 30px rgba(37,99,235,0.16)'
                      : '0 8px 20px rgba(15,23,42,0.04)',
                    background: plan?.isDefault
                      ? 'linear-gradient(180deg, rgba(59,130,246,0.08), rgba(255,255,255,1) 40%)'
                      : '#ffffff'
                  }}
                >
                  <Stack spacing={1.4}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '12px',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#1d4ed8',
                          bgcolor: alpha('#2563eb', 0.12)
                        }}
                      >
                        <WorkspacePremiumRoundedIcon fontSize="small" />
                      </Box>
                      {plan?.isDefault && (
                        <Chip
                          label="Most Popular"
                          size="small"
                          sx={{
                            height: 24,
                            fontWeight: 700,
                            bgcolor: '#1d4ed8',
                            color: 'white'
                          }}
                        />
                      )}
                    </Stack>

                    <Box>
                      <Typography
                        sx={{ fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}
                      >
                        {plan?.title}
                      </Typography>
                      <Typography
                        sx={{ mt: 0.35, color: 'text.secondary', fontSize: 14 }}
                      >
                        {plan?.description ||
                          'Balanced limits for growing teams and projects.'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.4,
                        borderRadius: '12px',
                        border: `1px solid ${alpha('#2563eb', 0.18)}`,
                        bgcolor: alpha('#2563eb', 0.05)
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 30,
                          fontWeight: 900,
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {formatPlanPrice(plan?.currentPrice)}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontWeight: 600 }}
                      >
                        Billed {plan?.billingCycle || 'monthly'}
                      </Typography>
                    </Box>

                    <Stack spacing={0.75}>
                      {getPlanHighlights(plan).map((item, index) => (
                        <Stack
                          key={`${plan?._id}-${index}`}
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                        >
                          {item.enabled ? (
                            <TaskAltRoundedIcon
                              sx={{ fontSize: 16, color: '#16a34a' }}
                            />
                          ) : (
                            <RemoveCircleOutlineRoundedIcon
                              sx={{ fontSize: 16, color: '#9ca3af' }}
                            />
                          )}
                          <Typography
                            sx={{
                              color: item.enabled
                                ? 'text.secondary'
                                : '#94a3b8',
                              fontSize: 14
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: '16px',
                border: `1px dashed ${alpha('#2563eb', 0.3)}`
              }}
            >
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                No plans available
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Pricing plans are being updated. Please check again soon.
              </Typography>
            </Paper>
          )}
        </Container>

        <Container maxWidth="lg" sx={{ pb: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: '20px',
              border: `1px solid ${alpha('#0f172a', 0.08)}`
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: 22, md: 30 }, mb: 2 }}
            >
              How Teams Move Faster With Taskio
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))'
                },
                gap: 2
              }}
            >
              {workflow.map((item) => (
                <Box
                  key={item.step}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    border: `1px solid ${alpha('#2563eb', 0.18)}`,
                    bgcolor: alpha('#2563eb', 0.04)
                  }}
                >
                  <Chip
                    label={`Step ${item.step}`}
                    size="small"
                    sx={{ mb: 1.25, fontWeight: 700, color: '#1d4ed8' }}
                  />
                  <Typography sx={{ fontWeight: 800, mb: 0.6 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Container>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '22px',
              color: 'common.white',
              background:
                'linear-gradient(120deg, #1e3a8a, #2563eb 52%, #0891b2)',
              boxShadow: '0 22px 44px rgba(37,99,235,0.32)'
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: 26, md: 34 }, mb: 0.75 }}
                >
                  Ready To Upgrade How Your Team Delivers?
                </Typography>
                <Typography
                  sx={{ color: alpha('#ffffff', 0.88), maxWidth: 640 }}
                >
                  Start with your first workspace in minutes and scale from
                  simple boards to full multi-team delivery.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                <Button
                  onClick={() => navigate('/h/workspaces')}
                  variant="contained"
                  color="inherit"
                  startIcon={<TaskAltRoundedIcon />}
                  sx={{
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1.1,
                    color: '#1d4ed8',
                    fontWeight: 800,
                    '&:hover': { bgcolor: alpha('#ffffff', 0.9) }
                  }}
                >
                  Create Workspace
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('https://web.telegram.org/k/#@taskio_support_demo_bot')}
                  startIcon={<VerifiedRoundedIcon />}
                  sx={{
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1.1,
                    color: '#ffffff',
                    borderColor: alpha('#ffffff', 0.5),
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: alpha('#ffffff', 0.1)
                    }
                  }}
                >
                  Contact Sales
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>

        <Box sx={{ borderTop: `1px solid ${alpha('#0f172a', 0.08)}` }}>
          <Container
            maxWidth="lg"
            sx={{
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Copyright 2026 Taskio. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                Privacy
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                Terms
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                Support
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
