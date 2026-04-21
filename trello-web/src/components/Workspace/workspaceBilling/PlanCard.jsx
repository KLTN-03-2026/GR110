import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { PlanPrice } from './PlanPrice'
import { FeatureItem } from './FeatureItem'

export function PlanCard({ plan, selected, onSelect }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      onClick={() => onSelect(plan.id)}
      role='button'
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(plan.id)
        }
      }}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        px: { xs: 2.5, md: 3 },
        py: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: selected
          ? theme.palette.primary.main
          : isDark
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.common.black, 0.08),
        backgroundColor: selected
          ? isDark
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.primary.main, 0.035)
          : theme.palette.background.paper,
        boxShadow: selected
          ? isDark
            ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.16)}, 0 16px 30px ${alpha('#000', 0.28)}`
            : `0 0 0 1px ${alpha(theme.palette.primary.main, 0.12)}, 0 12px 24px ${alpha(theme.palette.common.black, 0.08)}`
          : isDark
            ? `0 8px 20px ${alpha('#000', 0.16)}`
            : `0 8px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        transition: 'all 0.25s ease',
        transform: selected ? 'translateY(-3px)' : 'translateY(0)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: selected
            ? theme.palette.primary.main
            : isDark
              ? alpha(theme.palette.common.white, 0.18)
              : alpha(theme.palette.primary.main, 0.2)
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '3px'
        }
      }}
    >
      {selected && (
        <Chip
          icon={<CheckCircleRoundedIcon sx={{ fontSize: '18px !important' }} />}
          label='Selected'
          size='small'
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            height: 28,
            borderRadius: 999,
            fontWeight: 700,
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}

      <Stack spacing={2.5}>
        <Box sx={{ textAlign: 'center', pt: selected ? 1.25 : 0.5 }}>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 800,
              color: 'text.primary',
              lineHeight: 1.2,
              mb: 0.75
            }}
          >
            {plan.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: 'text.secondary',
              minHeight: 20
            }}
          >
            {plan.description || 'A balanced plan for your workspace needs'}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: 2.5,
            px: 2,
            py: 1.75,
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.primary.main, 0.03),
            border: '1px solid',
            borderColor: isDark
              ? alpha(theme.palette.common.white, 0.06)
              : alpha(theme.palette.common.black, 0.06)
          }}
        >
          <PlanPrice
            price={plan.price}
            unit={plan.currency}
            interval={plan.interval}
            selected={selected}
          />
        </Box>

        <Stack spacing={1.35}>
          {plan.features.map((feature, index) => (
            <FeatureItem
              key={`${plan.id}-${feature.iconKey}-${index}`}
              iconKey={feature.iconKey}
              text={feature.text}
              selected={selected}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}