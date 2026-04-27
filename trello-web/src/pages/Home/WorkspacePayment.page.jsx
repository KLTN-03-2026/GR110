import { useMemo, useState } from 'react'
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography
} from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import usePayment from '~/hooks/payment.hook'
import PaymentPlanSummary from '~/components/Workspace/workspacePayment/PaymentPlanSummary'
import PaymentCheckoutCard from '~/components/Workspace/workspacePayment/PaymentCheckoutCard'
import PaymentMethodSelector from '~/components/Workspace/workspacePayment/PaymentMethodSelector'

function mapPlanFeatureToUiFeatures(planFeature) {
  if (!planFeature) return []

  const features = []

  if (planFeature?.capabilities?.workspace?.customRole) {
    features.push({ iconKey: 'security', text: 'Custom workspace roles' })
  }
  if (planFeature?.capabilities?.board?.customRole) {
    features.push({ iconKey: 'board', text: 'Custom board roles' })
  }
  if (planFeature?.capabilities?.column?.customColor) {
    features.push({ iconKey: 'layout', text: 'Custom column colors' })
  }
  if (planFeature?.capabilities?.task?.setDue) {
    features.push({ iconKey: 'calendar', text: 'Set due dates' })
  }
  if (planFeature?.capabilities?.task?.assignMembers) {
    features.push({ iconKey: 'observer', text: 'Assign members to tasks' })
  }

  features.push(
    { iconKey: 'member', text: `Up to ${planFeature?.limits?.maxMembers ?? 0} members` },
    { iconKey: 'table', text: `Up to ${planFeature?.limits?.maxBoards ?? 0} boards` },
    { iconKey: 'list', text: `Up to ${planFeature?.limits?.maxColumnsPerBoard ?? 0} columns per board` },
    { iconKey: 'copy', text: `Up to ${planFeature?.limits?.maxCardsPerBoard ?? 0} cards per board` },
    { iconKey: 'checklist', text: `Up to ${planFeature?.limits?.maxChecklistItemsPerCard ?? 0} checklist items per card` },
    { iconKey: 'inbox', text: `Up to ${planFeature?.limits?.maxCommentsPerCard ?? 0} comments per card` },
    { iconKey: 'file', text: `Storage ${planFeature?.limits?.maxStorageMb ?? 0}MB` },
    { iconKey: 'download', text: `Max file size ${planFeature?.limits?.maxFileSizeMb ?? 0}MB` }
  )

  return features
}

export default function WorkspacePaymentPage() {
  const { dataPayment, selectedGateway, setSelectedGateway, localStatus } = usePayment()

  const planFeatures = useMemo(() => {
    return mapPlanFeatureToUiFeatures(dataPayment?.planFeature)
  }, [dataPayment])


  if (!dataPayment) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <Stack alignItems="center" spacing={1.5}>
          <CircularProgress />
          <Typography color="text.secondary">Loading payment details...</Typography>
        </Stack>
      </Box>
    )
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
          <ReceiptLongOutlinedIcon fontSize="large" color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Workspace Payment
          </Typography>
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          minHeight: '75vh',
          bgcolor: theme.palette.mode === 'dark' ? '#151822' : '#f6f8fc',
          display: 'flex',
          alignItems: 'flex-start',
          py: { xs: 4, md: 5 },
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shorter
          })
        })}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: { xs: 5, md: 7 } }}>
            <Stack spacing={1.5} alignItems="center" sx={{ mb: 5 }}>
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
                Complete your workspace upgrade
              </Typography>

              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  fontSize: { xs: 14, md: 17 },
                  maxWidth: 760
                })}
              >
                Review your selected plan, scan the QR code to pay, and wait for payment confirmation.
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: '1.15fr 0.85fr'
                },
                gap: 3,
                alignItems: 'start'
              }}
            >
              <PaymentPlanSummary
                workspaceTitle={dataPayment?.workspaceTitle}
                planTitle={dataPayment?.planTitle}
                planFeatures={planFeatures}
              />

              <Stack spacing={3}>
                <PaymentMethodSelector
                  value={selectedGateway}
                  onChange={setSelectedGateway}
                />

                <PaymentCheckoutCard
                  selectedGateway={selectedGateway}
                  payment={dataPayment?.payment}
                  localStatus={localStatus}
                />
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}