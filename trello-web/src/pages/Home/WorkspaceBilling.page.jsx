import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { PlanCard } from '~/components/Workspace/workspaceBilling/PlanCard'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import useBillingPage from '~/hooks/workspaceBilling.hook'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkspacePayment } from '~/apis/subscriptions.api'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

export default function WorkspaceBillingPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { plans } = useBillingPage()
  const [selectedPlan, setSelectedPlan] = useState('')

  const navigate = useNavigate()
  const { workspaceId } = useParams()

  useEffect(() => {
    if (!plans.length || selectedPlan) return
    const PLAN_FREE = '69dc9cc2454ef403fb52c8ba'
    const currentPlan = plans.find((p) => p.isCurrentPlan)
    if (currentPlan) {
      setSelectedPlan(currentPlan.id)
      return
    }
    const defaultPlan = plans.find((p) => p.id === PLAN_FREE)
    if (defaultPlan) {
      setSelectedPlan(defaultPlan.id)
      return
    }
    setSelectedPlan(plans[0].id)
  }, [plans, selectedPlan])

  const activePlan = plans.find((p) => p.id === selectedPlan)

  const handleSelectPlan = async () => {
    const res = await createWorkspacePayment({
      workspaceId,
      planId: activePlan.id
    })

    navigate(`/h/workspaces/${workspaceId}/payment/${res.subscription.id}`, {
      state: res
    })
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
          color: 'white',
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4 },
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={dotPatternSx} />

        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
          <Chip
            icon={
              <AutoAwesomeRoundedIcon
                sx={{ fontSize: 13, color: '#fde68a !important' }}
              />
            }
            label="Workspace Plans"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#fde68a',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1,
              border: '1px solid rgba(253,230,138,0.30)',
              backdropFilter: 'blur(6px)'
            }}
          />

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: 0,
              mb: 0.5
            }}
          >
            Workspace Billings
          </Typography>

          <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
            Compare plans, review limits, and upgrade your workspace.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Chip
            icon={<ViewKanbanOutlinedIcon sx={{ fontSize: 15 }} />}
            label={`${plans.length} plans`}
            sx={{
              height: 32,
              color: '#bfdbfe',
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              '& .MuiChip-icon': { color: '#93c5fd' }
            }}
          />

          {activePlan && (
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
              label={activePlan.isCurrentPlan ? 'Current plan' : 'Plan selected'}
              sx={{
                height: 32,
                color: activePlan.isCurrentPlan ? '#bbf7d0' : '#fde68a',
                fontWeight: 700,
                bgcolor: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.16)',
                '& .MuiChip-icon': {
                  color: activePlan.isCurrentPlan ? '#86efac' : '#fde68a'
                }
              }}
            />
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          minHeight: '72vh',
          borderRadius: '24px',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)',
          bgcolor: isDark ? '#0f1623' : '#f6f8fc'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                mb: 3,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                boxShadow: isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.04)'
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <ReceiptLongOutlinedIcon color="primary" />
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                      Choose a plan
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 0.25 }}
                    >
                      Pick the limits and capabilities that match your workspace.
                    </Typography>
                  </Box>
                </Box>

                {activePlan && (
                  <Chip
                    label={
                      activePlan.isCurrentPlan
                        ? `Current: ${activePlan.title}`
                        : `Selected: ${activePlan.title}`
                    }
                    size="small"
                    sx={{
                      height: 30,
                      fontWeight: 700,
                      color: activePlan.isCurrentPlan
                        ? 'success.main'
                        : 'primary.main',
                      bgcolor: activePlan.isCurrentPlan
                        ? alpha(theme.palette.success.main, isDark ? 0.14 : 0.08)
                        : alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
                      border: `1px solid ${alpha(
                        activePlan.isCurrentPlan
                          ? theme.palette.success.main
                          : theme.palette.primary.main,
                        0.2
                      )}`
                    }}
                  />
                )}
              </Stack>
            </Paper>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))'
                },
                gap: 3,
                alignItems: 'start'
              }}
            >
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan === plan.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </Box>

            <Stack alignItems="center" sx={{ mt: 5 }}>
              <Button
                variant="contained"
                onClick={() => handleSelectPlan()}
                disabled={activePlan?.isCurrentPlan}
                startIcon={<RocketLaunchRoundedIcon />}
                sx={{
                  minWidth: 300,
                  maxWidth: '100%',
                  height: 52,
                  px: 5,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.30)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(37,99,235,0.45)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.08)',
                    boxShadow: 'none'
                  }
                }}
              >
                {activePlan?.isCurrentPlan
                  ? `Current plan: ${activePlan.title}`
                  : `Select plan${activePlan ? `: ${activePlan.title}` : ''}`}
              </Button>

              <Typography
                variant="body2"
                sx={{ mt: 2.5, color: 'text.secondary', textAlign: 'center' }}
              >
                Need more control, security, or dedicated support?{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  Explore Enterprise
                </Box>
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  )
}
