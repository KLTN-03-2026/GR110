import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded'
import PaypalCheckout from './ButtonPaypal'

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('vi-VN').format(Number(value || 0))

export default function PaymentCheckoutCard({
  payment,
  localStatus,
  onCheckPayment,
  selectedGateway,
  onContinuePaypal
}) {
  const isSepay = selectedGateway === 'sepay'
  const isPaypal = selectedGateway === 'paypal'

  const buttonText =
    localStatus === 'idle'
      ? "I've completed the payment"
      : localStatus === 'checking'
        ? 'Checking payment...'
        : 'Payment confirmed'

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
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
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography
            sx={(theme) => ({
              fontSize: 20,
              fontWeight: 800,
              color: theme.palette.text.primary
            })}
          >
            Payment details
          </Typography>

          <Typography
            sx={(theme) => ({
              fontSize: 14,
              color: theme.palette.text.secondary
            })}
          >
            {isSepay
              ? 'Scan the QR code below and complete the transfer using the exact amount.'
              : 'Continue to PayPal to complete your payment securely.'}
          </Typography>
        </Stack>

        {isSepay && (
          <Box
            sx={(theme) => ({
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(248, 250, 252, 0.9)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            })}
          >
            <Box
              sx={{
                width: { xs: 220, sm: 260 },
                height: { xs: 220, sm: 260 },
                borderRadius: 2,
                bgcolor: '#fff',
                display: 'grid',
                placeItems: 'center',
                p: 1.5,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
              }}
            >
              {payment?.qr ? (
                <Box
                  component='img'
                  src={payment.qr}
                  alt='Payment QR'
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <QrCode2RoundedIcon sx={{ fontSize: 140, color: '#111827' }} />
              )}
            </Box>

            <Typography
              sx={(theme) => ({
                mt: 1.5,
                fontSize: 17,
                color: theme.palette.text.secondary,
                fontWeight: 500,
                textAlign: 'center'
              })}
            >
              Payment note: {payment?.paymentCode || '--'}
            </Typography>

            <Alert
              severity='warning'
              icon={<AccessTimeRoundedIcon />}
              sx={{ borderRadius: 2, mt: 1, width: '100%' }}
            >
              Note: Please do not edit the payment details to proceed with automatic activation.
            </Alert>
          </Box>
        )}

        {isPaypal && (
          <Box
            sx={(theme) => ({
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(248, 250, 252, 0.9)',
              p: { xs: 2.5, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            })}
          >
            <Box
              sx={(theme) => ({
                width: 84,
                height: 84,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(59,130,246,0.16)'
                    : 'rgba(59,130,246,0.10)',
                mb: 2
              })}
            >
              <PaymentRoundedIcon sx={{ fontSize: 40, color: '#2563eb' }} />
            </Box>

            <Typography
              sx={(theme) => ({
                fontSize: 18,
                fontWeight: 800,
                color: theme.palette.text.primary
              })}
            >
              Pay with PayPal
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1,
                fontSize: 14,
                color: theme.palette.text.secondary,
                maxWidth: 420
              })}
            >
              You will be redirected to PayPal to review and complete your payment using
              your PayPal balance or linked bank card.
            </Typography>

            <Stack
              direction='row'
              spacing={1}
              alignItems='center'
              sx={{ mt: 2, color: 'text.secondary' }}
            >
              <AccountBalanceRoundedIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 14 }}>
                Fast and secure international payment
              </Typography>
            </Stack>
          </Box>
        )}

        <Box
          sx={(theme) => ({
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(248, 250, 252, 0.9)',
            p: 2
          })}
        >
          <Stack spacing={1.25}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography sx={(theme) => ({ fontSize: 14, color: theme.palette.text.secondary })}>
                Original price
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: 14,
                  color: theme.palette.text.secondary,
                  textDecoration:
                    Number(payment?.discountAmount || 0) > 0 ? 'line-through' : 'none'
                })}
              >
                ₫ {formatCurrency(payment?.originPrice || 0)}
              </Typography>
            </Stack>

            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography sx={(theme) => ({ fontSize: 14, color: theme.palette.text.secondary })}>
                Discount
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    Number(payment?.discountAmount || 0) > 0
                      ? '#34d399'
                      : theme.palette.text.secondary
                })}
              >
                - ₫ {formatCurrency(payment?.discountAmount || 0)}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography
                sx={(theme) => ({
                  fontSize: 15,
                  fontWeight: 700,
                  color: theme.palette.text.primary
                })}
              >
                Total amount
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: 24,
                  fontWeight: 800,
                  color: theme.palette.text.primary
                })}
              >
                ₫ {formatCurrency(payment?.totalAmount || 0)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {isSepay && localStatus === 'idle' && (
          <Alert severity='info' icon={<AccessTimeRoundedIcon />} sx={{ borderRadius: 2 }}>
            After you complete the transfer, press the button below so the system can verify
            the webhook result.
          </Alert>
        )}

        {isSepay && localStatus === 'checking' && (
          <Alert severity='warning' sx={{ borderRadius: 2 }}>
            We are checking the payment status from the payment gateway...
          </Alert>
        )}

        {isSepay && localStatus === 'success' && (
          <Alert
            severity='success'
            icon={<CheckCircleRoundedIcon />}
            sx={{ borderRadius: 2 }}
          >
            Payment received successfully. Your workspace plan will be updated shortly.
          </Alert>
        )}

        {isPaypal && (
          <Alert severity='info' sx={{ borderRadius: 2 }}>
            You will leave this page briefly and return after PayPal confirms your payment.
          </Alert>
        )}

        {isSepay && (
          <Button
            fullWidth
            variant={localStatus === 'success' ? 'outlined' : 'contained'}
            color={localStatus === 'success' ? 'success' : 'primary'}
            disabled={localStatus === 'checking' || localStatus === 'success'}
            onClick={onCheckPayment}
            sx={{
              height: 50,
              textTransform: 'none',
              fontWeight: 800,
              fontSize: 15,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {buttonText}
          </Button>
        )}

        {isPaypal && (
          // <Button
          //   fullWidth
          //   variant='contained'
          //   onClick={onContinuePaypal}
          //   sx={{
          //     height: 50,
          //     textTransform: 'none',
          //     fontWeight: 800,
          //     fontSize: 15,
          //     borderRadius: 2,
          //     boxShadow: 'none',
          //     background: 'linear-gradient(90deg, #0070ba 0%, #1546a0 100%)',
          //     '&:hover': {
          //       boxShadow: 'none',
          //       background: 'linear-gradient(90deg, #0064a8 0%, #123f93 100%)'
          //     }
          //   }}
          // >
          //   Continue with PayPal
          // </Button>
          <PaypalCheckout 
          payment={payment}
          />
        )}
      </Stack>
    </Paper>
  )
}