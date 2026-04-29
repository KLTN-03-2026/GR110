import {
  Box,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useQuota } from '~/hooks/workspaceQuota.hook'
import WorkspacePageHeader from '~/components/Workspace/WorkspacePageHeader'
import { SummaryCard } from '~/components/Workspace/workspaceQuota/SummaryCard'
import { QuotaSection } from '~/components/Workspace/workspaceQuota/QuotaSection'
import { RuleSection } from '~/components/Workspace/workspaceQuota/RuleSection'
import { BoardUsageSection } from '~/components/Workspace/workspaceQuota/BoardUsageSection'

const formatValue = (value, unit) => {
  const safeValue = Number(value || 0)
  return `${safeValue.toLocaleString()}${unit ? ` ${unit}` : ''}`
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

  const workspaceQuotas = Array.isArray(quota?.workspace) ? quota.workspace : []
  const boardQuotas = Array.isArray(quota?.board) ? quota.board : []
  const cardQuotas = Array.isArray(quota?.card) ? quota.card : []
  const rules = Array.isArray(quota?.rules) ? quota.rules : []
  const boardUsageItems =
    quota?.board && !Array.isArray(quota.board)
      ? Object.entries(quota.board)
      : []
  const usageItems = [...workspaceQuotas, ...boardQuotas, ...cardQuotas]

  const trackedLimits = usageItems.length
  const averageUsage = trackedLimits
    ? Math.round(
        usageItems.reduce(
          (total, item) => total + Number(item.percent || 0),
          0
        ) / trackedLimits
      )
    : 0
  const nearLimitCount = usageItems.filter((item) => item.percent >= 70).length
  const storageQuota = workspaceQuotas.find(
    (item) => item.key === 'maxStorageMb'
  )

  return (
    <>
      <WorkspacePageHeader
        badgeIcon={<SpeedRoundedIcon sx={{ fontSize: 13 }} />}
        badgeLabel="Usage & Limits"
        title="Workspace Quota"
        description="Track workspace limits, board peaks, card peaks, and upload rules."
      >
        <Chip
          icon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
          label={`${trackedLimits} tracked limits`}
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

        <Chip
          icon={<WarningAmberRoundedIcon sx={{ fontSize: 15 }} />}
          label={`${nearLimitCount} near limit`}
          sx={(theme) => ({
            height: 32,
            color: nearLimitCount
              ? theme.palette.warning.main
              : theme.palette.success.main,
            fontWeight: 700,
            bgcolor: alpha(
              nearLimitCount
                ? theme.palette.warning.main
                : theme.palette.success.main,
              theme.palette.mode === 'dark' ? 0.16 : 0.1
            ),
            border: `1px solid ${alpha(
              nearLimitCount
                ? theme.palette.warning.main
                : theme.palette.success.main,
              0.22
            )}`,
            '& .MuiChip-icon': {
              color: 'inherit'
            }
          })}
        />
      </WorkspacePageHeader>

      <Box
        sx={{
          minHeight: '72vh',
          overflow: 'hidden',
          pt: 3
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
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, minmax(0, 1fr))'
              },
              gap: 2.5,
              alignItems: 'start'
            }}
          >
            <QuotaSection type="workspace" items={workspaceQuotas} />
            <RuleSection items={rules} />
            <BoardUsageSection items={boardUsageItems} />
          </Box>
        )}
      </Box>
    </>
  )
}
