import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'

const iconMap = {
  security: ShieldOutlinedIcon,
  board: DashboardCustomizeOutlinedIcon,
  layout: ViewAgendaOutlinedIcon,
  calendar: CalendarMonthOutlinedIcon,
  observer: VisibilityOutlinedIcon,
  member: GroupOutlinedIcon,
  table: TableChartOutlinedIcon,
  list: FormatListBulletedOutlinedIcon,
  copy: ContentCopyOutlinedIcon,
  checklist: ChecklistOutlinedIcon,
  inbox: InboxOutlinedIcon,
  file: AttachFileOutlinedIcon,
  download: DownloadOutlinedIcon
}

function PaymentFeatureItem({ feature }) {
  const Icon = iconMap[feature.iconKey] || CheckCircleRoundedIcon

  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box
        sx={(theme) => ({
          mt: '2px',
          width: 28,
          height: 28,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(15,23,42,0.04)',
          flexShrink: 0
        })}
      >
        <Icon
          sx={(theme) => ({
            fontSize: 17,
            color: theme.palette.text.secondary
          })}
        />
      </Box>

      <Typography
        sx={(theme) => ({
          fontSize: 14,
          lineHeight: 1.5,
          color: theme.palette.text.primary
        })}
      >
        {feature.text}
      </Typography>
    </Stack>
  )
}

export default function PaymentPlanSummary({
  workspaceTitle,
  planTitle,
  planFeatures
}) {
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
        <Stack spacing={1.25}>
          <Chip
            icon={<WorkspacePremiumRoundedIcon />}
            label="Selected plan"
            sx={(theme) => ({
              alignSelf: 'flex-start',
              color: theme.palette.primary.main,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(152, 92, 255, 0.16)'
                  : 'rgba(99, 102, 241, 0.10)',
              border:
                theme.palette.mode === 'dark'
                  ? '1px solid rgba(180, 120, 255, 0.24)'
                  : '1px solid rgba(99, 102, 241, 0.18)'
            })}
          />

          <Typography
            sx={(theme) => ({
              fontSize: { xs: 22, md: 26 },
              fontWeight: 800,
              color: theme.palette.text.primary,
              lineHeight: 1.2
            })}
          >
            {workspaceTitle || '--'}
          </Typography>

          <Typography
            sx={(theme) => ({
              fontSize: 15,
              color: theme.palette.text.secondary
            })}
          >
            Plan:{' '}
            <Box
              component="span"
              sx={(theme) => ({
                color: theme.palette.text.primary,
                fontWeight: 700
              })}
            >
              {planTitle || '--'}
            </Box>
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <Typography
            sx={(theme) => ({
              fontSize: 17,
              fontWeight: 700,
              color: theme.palette.text.primary
            })}
          >
            Included in this plan
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 1.25
            }}
          >
            {planFeatures.map((feature, index) => (
              <PaymentFeatureItem
                key={`${feature.text}-${index}`}
                feature={feature}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
}