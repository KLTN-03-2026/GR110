import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { PlanCard } from '~/components/Workspace/workspaceBilling/PlanCard'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import useBillingPage from '~/hooks/workspaceBilling.hook'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkspacePayment } from '~/apis/subscriptions.api'

export default function WorkspaceBillingPage() {
  const { plans } = useBillingPage()
  const [selectedPlan, setSelectedPlan] = useState('')

  useEffect(() => {
    if (!plans.length || selectedPlan) return

    const PLAN_FREE = '69dc9cc2454ef403fb52c8ba'
    const currentPlan = plans.find((plan) => plan.isCurrentPlan)

    if (currentPlan) {
      setSelectedPlan(currentPlan.id)
      return
    }

    const defaultPlan = plans.find((plan) => plan.id === PLAN_FREE)
    if (defaultPlan) {
      setSelectedPlan(defaultPlan.id)
      return
    }

    setSelectedPlan(plans[0].id)
  }, [plans, selectedPlan])

  const activePlan = plans.find((plan) => plan.id === selectedPlan)

  const navigate = useNavigate()
  const { workspaceId } = useParams()

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptLongOutlinedIcon fontSize='large' color='primary' />
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Workspace Billings
          </Typography>
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          minHeight: '75vh',
          bgcolor: theme.palette.mode === 'dark' ? '#151822' : '#f6f8fc',
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'flex-start',
          py: { xs: 4, md: 5 },
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shorter
          })
        })}
      >
        <Container maxWidth='xl'>
          <Box sx={{ py: { xs: 5, md: 7 } }}>
            <Stack spacing={1.5} alignItems='center' sx={{ mb: 5 }}>
              <Typography
                sx={(theme) => ({
                  fontSize: { xs: 26, md: 40 },
                  lineHeight: 1.2,
                  fontWeight: 800,
                  textAlign: 'center',
                  maxWidth: 900,
                  color: theme.palette.text.primary
                })}
              >
                Upgrade to capture, organize, and tackle your to-dos from
                anywhere
              </Typography>

              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  fontSize: { xs: 14, md: 17 },
                  maxWidth: 760
                })}
              >
                Maximize your productivity potential with more features, more
                integrations, and more automation.
              </Typography>
            </Stack>

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

            <Stack alignItems='center' sx={{ mt: 4 }}>
              <Button
                variant='contained'
                onClick={() => handleSelectPlan()}
                disabled={activePlan?.isCurrentPlan}
                sx={{
                  minWidth: 320,
                  maxWidth: '100%',
                  height: 48,
                  px: 4,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Select plan{activePlan ? `: ${activePlan.title}` : ''}
              </Button>

              <Typography
                variant='body2'
                sx={(theme) => ({
                  mt: 3,
                  color: theme.palette.text.secondary,
                  textAlign: 'center'
                })}
              >
                For more control, security, and support, check out Trello
                Enterprise{' '}
                <Box
                  component='span'
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  })}
                >
                  Learn more
                </Box>
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  )
}