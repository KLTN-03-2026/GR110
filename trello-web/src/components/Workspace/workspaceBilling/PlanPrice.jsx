import { Box, Typography } from '@mui/material'
import { formatPrice } from '~/helpers/formatPrice'

export function PlanPrice({ price, interval}) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.75,
          flexWrap: 'nowrap'
        }}
      >

        <Typography
          component="span"
          sx={{
            fontSize: '30px !important',
            lineHeight: '0.95 !important',
            fontWeight: '900 !important',
            letterSpacing: 0,
            color: 'text.primary',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'inline-block'
          }}
        >
          {formatPrice(price)}
        </Typography>

        <Typography
          component="span"
          sx={{
            fontSize: '13px !important',
            fontWeight: 600,
            color: 'text.secondary',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          / {interval}
        </Typography>
      </Box>
    </Box>
  )
}
