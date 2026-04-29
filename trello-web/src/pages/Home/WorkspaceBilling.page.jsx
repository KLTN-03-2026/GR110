import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Skeleton,
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
import {
  createWorkspacePayment,
  selectWorkspaceFreePlan
} from '~/apis/subscriptions.api'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import { useDispatch } from 'react-redux'
import { fetchWorkspacesAPI } from '~/redux/workspace/workspacesSlice'
import ConfirmDialog from '~/components/Workspace/workspaceBilling/ConfirmDialog'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'

const PLAN_FREE = '69dc9cc2454ef403fb52c8ba'

export default function WorkspaceBillingPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { plans, isLoadingPlans } = useBillingPage()
  const [selectedPlan, setSelectedPlan] = useState('')
  const [currentPlanId, setCurrentPlanId] = useState('')
  const [openFreePlanConfirm, setOpenFreePlanConfirm] = useState(false)
  const [isSelectingFreePlan, setIsSelectingFreePlan] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  useEffect(() => {
    if (!plans.length) return

    const currentPlan = plans.find((p) => p.isCurrentPlan)

    if (currentPlan && !currentPlanId) {
      setCurrentPlanId(currentPlan.id)
    }

    if (selectedPlan) return

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
  }, [plans, selectedPlan, currentPlanId])

  const activePlan = plans.find((p) => p.id === selectedPlan)
  const isActivePlanCurrent = activePlan?.id === currentPlanId
  const isDowngradeToFree =
    activePlan?.id === PLAN_FREE && currentPlanId && currentPlanId !== PLAN_FREE

  const renderPlanSkeletons = () =>
    Array.from({ length: 3 }).map((_, idx) => (
      <Box
        key={`plan-skeleton-${idx}`}
        sx={{
          px: { xs: 2, md: 2.25 },
          py: 2.25,
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark
            ? `0 8px 20px ${alpha('#000', 0.16)}`
            : `0 8px 20px ${alpha(theme.palette.common.black, 0.05)}`
        }}
      >
        <Stack spacing={1.75}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Skeleton
              variant="rounded"
              width={42}
              height={42}
              sx={{ borderRadius: '14px', flexShrink: 0 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Skeleton variant="text" width="62%" height={30} />
              <Skeleton variant="text" width="100%" height={18} />
              <Skeleton variant="text" width="88%" height={18} />
            </Box>
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              px: 1.75,
              py: 1.25,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Skeleton variant="text" width={110} height={32} />
            <Skeleton variant="text" width={70} height={18} />
          </Box>

          <Skeleton variant="rounded" width="100%" height={1} />

          <Stack spacing={0.8}>
            {Array.from({ length: 6 }).map((__, i) => (
              <Skeleton key={`feature-skeleton-${idx}-${i}`} height={18} />
            ))}
          </Stack>
        </Stack>
      </Box>
    ))

  const handleSelectPlan = async () => {
    if (!activePlan) return

    if (isDowngradeToFree) {
      setOpenFreePlanConfirm(true)
      return
    }

    const res = await createWorkspacePayment({
      workspaceId,
      planId: activePlan.id
    })

    navigate(`/h/workspaces/${workspaceId}/payment/${res.subscription.id}`, {
      state: res
    })
  }

  const handleCloseFreePlanConfirm = () => {
    if (isSelectingFreePlan) return
    setOpenFreePlanConfirm(false)
  }

  const handleConfirmFreePlan = async () => {
    try {
      setIsSelectingFreePlan(true)

      await selectWorkspaceFreePlan({
        workspaceId,
        planId: PLAN_FREE
      })

      setCurrentPlanId(PLAN_FREE)
      setSelectedPlan(PLAN_FREE)
      setOpenFreePlanConfirm(false)
      dispatch(fetchWorkspacesAPI())
    } finally {
      setIsSelectingFreePlan(false)
    }
  }

  return (
    <>
      <WorkspacePageHeader
        badgeIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="Workspace Plans"
        title="Workspace Billings"
        description="Compare plans, review limits, and upgrade your workspace."
      >
        <Chip
          icon={<ViewKanbanOutlinedIcon sx={{ fontSize: 15 }} />}
          label={`${plans.length} plans`}
          sx={(theme) => ({
            height: 32,
            color:
                theme.palette.mode === 'dark'
                  ? '#bfdbfe'
                  : theme.palette.primary.main,
            fontWeight: 700,
            bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.10)'
                  : alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            '& .MuiChip-icon': { color: 'inherit' }
          })}
        />

        {activePlan && (
          <Chip
            icon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
            label={isActivePlanCurrent ? 'Current plan' : 'Plan selected'}
            sx={(theme) => ({
              height: 32,
              color: isActivePlanCurrent
                ? theme.palette.success.main
                : theme.palette.warning.main,
              fontWeight: 700,
              bgcolor: alpha(
                isActivePlanCurrent
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                theme.palette.mode === 'dark' ? 0.16 : 0.1
              ),
              border: `1px solid ${alpha(
                isActivePlanCurrent
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                0.22
              )}`,
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            })}
          />
        )}
      </WorkspacePageHeader>

      <Box
        sx={{
          minHeight: '72vh',
          overflow: 'hidden',
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
                {isLoadingPlans ? (
                  <>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
                    >
                      <Skeleton variant="circular" width={22} height={22} />
                      <Box>
                        <Skeleton variant="text" width={140} height={28} />
                        <Skeleton variant="text" width={300} height={20} />
                      </Box>
                    </Box>

                    <Skeleton
                      variant="rounded"
                      width={160}
                      height={30}
                      sx={{ borderRadius: '999px' }}
                    />
                  </>
                ) : (
                  <>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
                    >
                      <ReceiptLongOutlinedIcon color="primary" />
                      <Box>
                        <Typography
                          sx={{ fontWeight: 800, color: 'text.primary' }}
                        >
                          Choose a plan
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', mt: 0.25 }}
                        >
                          Pick the limits and capabilities that match your
                          workspace.
                        </Typography>
                      </Box>
                    </Box>

                    {activePlan && (
                      <Chip
                        label={
                          isActivePlanCurrent
                            ? `Current: ${activePlan.title}`
                            : `Selected: ${activePlan.title}`
                        }
                        size="small"
                        sx={{
                          height: 30,
                          fontWeight: 700,
                          color: isActivePlanCurrent
                            ? 'success.main'
                            : 'primary.main',
                          bgcolor: isActivePlanCurrent
                            ? alpha(
                                theme.palette.success.main,
                                isDark ? 0.14 : 0.08
                              )
                            : alpha(
                                theme.palette.primary.main,
                                isDark ? 0.15 : 0.08
                              ),
                          border: `1px solid ${alpha(
                            isActivePlanCurrent
                              ? theme.palette.success.main
                              : theme.palette.primary.main,
                            0.2
                          )}`
                        }}
                      />
                    )}
                  </>
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
              {isLoadingPlans
                ? renderPlanSkeletons()
                : plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      selected={selectedPlan === plan.id}
                      onSelect={setSelectedPlan}
                    />
                  ))}
            </Box>

            <Stack alignItems="center" sx={{ mt: 5 }}>
              {isLoadingPlans ? (
                <>
                  <Skeleton
                    variant="rounded"
                    width={320}
                    height={52}
                    sx={{ borderRadius: '999px', maxWidth: '100%' }}
                  />
                  <Skeleton
                    variant="text"
                    width={360}
                    height={24}
                    sx={{ mt: 2.5, maxWidth: '100%' }}
                  />
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={() => handleSelectPlan()}
                    disabled={isActivePlanCurrent}
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
                    {isActivePlanCurrent
                      ? `Current plan: ${activePlan.title}`
                      : `Select plan${activePlan ? `: ${activePlan.title}` : ''}`}
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2.5,
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
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
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      <ConfirmDialog
        open={openFreePlanConfirm}
        title="Switch to Free plan?"
        description="Your workspace will be moved back to the Free plan. Premium limits and paid capabilities will no longer be available after confirming."
        confirmText="Switch to Free"
        cancelText="Keep current plan"
        confirmColor="warning"
        loading={isSelectingFreePlan}
        onClose={handleCloseFreePlanConfirm}
        onConfirm={handleConfirmFreePlan}
      />
    </>
  )
}
