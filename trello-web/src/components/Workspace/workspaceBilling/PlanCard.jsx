import { Box, Chip, Divider, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
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
        px: { xs: 2, md: 2.25 },
        py: 2.25,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: selected
          ? theme.palette.primary.main
          : isDark
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.common.black, 0.08),
        backgroundColor: selected
          ? isDark
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.04)
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
        minHeight: '100%',
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
            top: 12,
            right: 12,
            height: 26,
            borderRadius: '999px',
            fontWeight: 700,
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}

      <Stack spacing={1.75}>
        <Stack
          direction='row'
          spacing={1.5}
          alignItems='flex-start'
          sx={{ pr: selected ? 9 : 0 }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: selected
                ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
                : isDark
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.primary.main, 0.06),
              color: selected ? 'primary.main' : 'text.secondary'
            }}
          >
            <WorkspacePremiumRoundedIcon fontSize='small' />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: 'text.primary',
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              {plan.title}
            </Typography>

            <Typography
              sx={{
                fontSize: 12.5,
                color: 'text.secondary',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {plan.description || 'A balanced plan for your workspace needs'}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            px: 1.75,
            py: 1.25,
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
            interval={plan.interval}
          />
        </Box>

        <Divider />

        <Stack spacing={0.65}>
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
