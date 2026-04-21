import { Box, Paper, Stack, Typography } from '@mui/material'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import PayPalIcon from '@mui/icons-material/Payment'

const paymentMethods = [
  {
    value: 'sepay',
    title: 'SePay',
    description: 'Scan QR code and transfer via bank account',
    icon: AccountBalanceRoundedIcon
  },
  {
    value: 'paypal',
    title: 'PayPal',
    description: 'Pay with PayPal balance or linked card',
    icon: PayPalIcon
  }
]

export default function PaymentMethodSelector({
  value,
  onChange
}) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        mt: 3,
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 8px 24px rgba(15, 23, 42, 0.06)'
      })}
    >
      <Stack spacing={2}>
        <Typography
          sx={(theme) => ({
            fontSize: 17,
            fontWeight: 700,
            color: theme.palette.text.primary
          })}
        >
          Choose payment method
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2
          }}
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const selected = value === method.value

            return (
              <Box
                key={method.value}
                onClick={() => onChange(method.value)}
                sx={(theme) => ({
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  border: selected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                  bgcolor: selected
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.12)'
                      : 'rgba(99, 102, 241, 0.06)'
                    : theme.palette.background.default,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Icon sx={{ mt: '2px' }} />
                  <Box>
                    <Typography
                      sx={(theme) => ({
                        fontSize: 15,
                        fontWeight: 700,
                        color: theme.palette.text.primary
                      })}
                    >
                      {method.title}
                    </Typography>

                    <Typography
                      sx={(theme) => ({
                        mt: 0.5,
                        fontSize: 13,
                        color: theme.palette.text.secondary
                      })}
                    >
                      {method.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })}
        </Box>
      </Stack>
    </Paper>
  )
}