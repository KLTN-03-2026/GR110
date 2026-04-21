import { Box, Tooltip, Typography } from '@mui/material'
import { getFeatureDisplayData } from './getFeatureDisplayData'

export function FeatureCell({ feature, truncateText }) {
  const { limitLine, capabilityLine, detailLines } =
    getFeatureDisplayData(feature)

  return (
    <Tooltip
      arrow
      placement="top-start"
      title={
        <Box sx={{ py: 0.5 }}>
          {detailLines.map((line, index) => (
            <Typography key={index} sx={{ fontSize: '12px', lineHeight: 1.6 }}>
              {line}
            </Typography>
          ))}
        </Box>
      }
    >
      <Box sx={{ minWidth: 260, maxWidth: 340 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.5
          }}
        >
          {limitLine}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.5
          }}
        >
          {truncateText(capabilityLine, 55)}
        </Typography>
      </Box>
    </Tooltip>
  )
}
