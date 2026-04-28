import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useQuota } from '~/hooks/workspaceQuota.hook'

const dotPatternSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  pointerEvents: 'none'
}

const sectionConfig = {
  workspace: {
    title: 'Workspace limits',
    description: 'Members, boards, custom roles, and storage used by this workspace.',
    icon: DataUsageRoundedIcon,
    color: '#2563eb'
  },
  board: {
    title: 'Board usage peaks',
    description: 'Highest usage found across boards in this workspace.',
    icon: ViewKanbanRoundedIcon,
    color: '#7c3aed'
  },
  card: {
    title: 'Card usage peaks',
    description: 'Highest comments and checklist usage found across cards.',
    icon: CreditScoreRoundedIcon,
    color: '#0891b2'
  },
  rules: {
    title: 'Upload rules',
    description: 'Fixed upload restrictions from the current plan.',
    icon: RuleRoundedIcon,
    color: '#ea580c'
  }
}

const formatValue = (value, unit) => {
  const safeValue = Number(value || 0)
  return `${safeValue.toLocaleString()}${unit ? ` ${unit}` : ''}`
}

const getUsageColor = (percent, theme) => {
  if (percent >= 90) return theme.palette.error.main
  if (percent >= 70) return theme.palette.warning.main
  return theme.palette.primary.main
}

function SummaryCard({ icon: Icon, label, value, caption, color }) {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)'
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            color,
            bgcolor: alpha(color, 0.1),
            flexShrink: 0
          }}
        >
          <Icon fontSize="small" />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.25 }}
          >
            {label}
          </Typography>
          {caption && (
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.disabled', mt: 0.25 }}
            >
              {caption}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}

function QuotaProgressItem({ item }) {
  const theme = useTheme()
  const color = getUsageColor(item.percent, theme)
  const isNearLimit = item.percent >= 70

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '14px',
        border: `1px solid ${alpha(color, isNearLimit ? 0.28 : 0.12)}`,
        bgcolor: isNearLimit ? alpha(color, 0.045) : 'transparent'
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
              {item.label}
            </Typography>
            {isNearLimit && (
              <WarningAmberRoundedIcon sx={{ fontSize: 16, color }} />
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {formatValue(item.used, item.unit)} used of{' '}
            {formatValue(item.limit, item.unit)}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${item.remaining.toLocaleString()}${item.unit ? ` ${item.unit}` : ''} left`}
          sx={{
            height: 28,
            fontWeight: 700,
            color,
            bgcolor: alpha(color, 0.08),
            border: `1px solid ${alpha(color, 0.18)}`
          }}
        />
      </Stack>

      <Box sx={{ mt: 1.75 }}>
        <LinearProgress
          variant="determinate"
          value={item.percent}
          sx={{
            height: 9,
            borderRadius: 999,
            bgcolor: alpha(color, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              bgcolor: color
            }
          }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Current usage
          </Typography>
          <Typography variant="caption" sx={{ color, fontWeight: 800 }}>
            {item.percent}%
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

function QuotaSection({ type, items }) {
  const theme = useTheme()
  const config = sectionConfig[type]
  const Icon = config.icon

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : '#f8fafc',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              color: config.color,
              bgcolor: alpha(config.color, 0.1)
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800 }}>{config.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {config.description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ p: 2 }}>
        {items.map((item) => (
          <QuotaProgressItem key={item.key} item={item} />
        ))}
      </Stack>
    </Paper>
  )
}

function RuleSection({ items }) {
  const theme = useTheme()
  const config = sectionConfig.rules
  const Icon = config.icon

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : '#f8fafc',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              color: config.color,
              bgcolor: alpha(config.color, 0.1)
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800 }}>{config.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {config.description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 1.5
        }}
      >
        {items.map((item) => (
          <Box
            key={item.key}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: `1px solid ${alpha(config.color, 0.16)}`,
              bgcolor: alpha(config.color, 0.045)
            }}
          >
            <Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>
            <Typography
              sx={{ fontSize: 26, fontWeight: 900, color: config.color, mt: 1 }}
            >
              {formatValue(item.limit, item.unit)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Plan rule
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

function QuotaSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Paper
          key={item}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Skeleton width={180} height={28} />
          <Skeleton height={18} width="64%" />
          <Skeleton height={54} sx={{ mt: 2, borderRadius: 2 }} />
        </Paper>
      ))}
    </Stack>
  )
}

export function WorkspaceQuotaPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { quota } = useQuota()

  const workspaceQuotas = quota?.workspace || []
  const boardQuotas = quota?.board || []
  const cardQuotas = quota?.card || []
  const rules = quota?.rules || []
  const usageItems = [...workspaceQuotas, ...boardQuotas, ...cardQuotas]

  const trackedLimits = usageItems.length
  const averageUsage = trackedLimits
    ? Math.round(
      usageItems.reduce((total, item) => total + Number(item.percent || 0), 0) /
        trackedLimits
    )
    : 0
  const nearLimitCount = usageItems.filter((item) => item.percent >= 70).length
  const storageQuota = workspaceQuotas.find((item) => item.key === 'maxStorageMb')

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
              <SpeedRoundedIcon
                sx={{ fontSize: 13, color: '#93c5fd !important' }}
              />
            }
            label="Usage & Limits"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#bfdbfe',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1,
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)'
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: 0,
              mb: 0.5
            }}
          >
            Workspace Quota
          </Typography>

          <Typography sx={{ opacity: 0.72, fontSize: '0.875rem' }}>
            Track workspace limits, board peaks, card peaks, and upload rules.
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
            icon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
            label={`${trackedLimits} tracked limits`}
            sx={{
              height: 32,
              color: '#bfdbfe',
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              '& .MuiChip-icon': { color: '#93c5fd' }
            }}
          />

          <Chip
            icon={<WarningAmberRoundedIcon sx={{ fontSize: 15 }} />}
            label={`${nearLimitCount} near limit`}
            sx={{
              height: 32,
              color: nearLimitCount ? '#fde68a' : '#bbf7d0',
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              '& .MuiChip-icon': {
                color: nearLimitCount ? '#fde68a' : '#86efac'
              }
            }}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          minHeight: '72vh',
          borderRadius: '24px',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.08)',
          bgcolor: isDark ? '#0f1623' : '#f6f8fc',
          p: { xs: 2, md: 3 }
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))'
            },
            gap: 2,
            mb: 3
          }}
        >
          <SummaryCard
            icon={DataUsageRoundedIcon}
            label="Tracked limits"
            value={trackedLimits}
            caption="Workspace, board, and card quotas"
            color="#2563eb"
          />
          <SummaryCard
            icon={SpeedRoundedIcon}
            label="Average usage"
            value={`${averageUsage}%`}
            caption="Across all tracked limits"
            color="#7c3aed"
          />
          <SummaryCard
            icon={WarningAmberRoundedIcon}
            label="Near limit"
            value={nearLimitCount}
            caption="Items at 70% usage or higher"
            color={nearLimitCount ? '#f59e0b' : '#16a34a'}
          />
          <SummaryCard
            icon={StorageRoundedIcon}
            label="Storage remaining"
            value={
              storageQuota
                ? formatValue(storageQuota.remaining, storageQuota.unit)
                : '0 MB'
            }
            caption="Available plan storage"
            color="#0891b2"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {!quota ? (
          <QuotaSkeleton />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
              gap: 2.5,
              alignItems: 'start'
            }}
          >
            <QuotaSection type="workspace" items={workspaceQuotas} />
            <QuotaSection type="board" items={boardQuotas} />
            <QuotaSection type="card" items={cardQuotas} />
            <RuleSection items={rules} />
          </Box>
        )}
      </Box>
    </>
  )
}
