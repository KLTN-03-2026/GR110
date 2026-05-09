import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined'
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import useAdminDashboard from '~/hooks/adminDashboard.hook'

const iconByKey = {
  users: <GroupOutlinedIcon sx={{ fontSize: 18 }} />,
  upgrades: <RocketLaunchOutlinedIcon sx={{ fontSize: 18 }} />,
  paidUpgrades: <PaidOutlinedIcon sx={{ fontSize: 18 }} />,
  conversion: <ShowChartOutlinedIcon sx={{ fontSize: 18 }} />,
  workspaces: <WorkspacesOutlinedIcon sx={{ fontSize: 18 }} />,
  totalUsers: <ReportProblemOutlinedIcon sx={{ fontSize: 18 }} />
}

const formatDateKey = (value) => {
  if (!value || value === '-') return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function MiniBarChart({ points = [], barColor = '#0ea5e9', height = 130 }) {
  const maxValue = Math.max(...points, 1)

  return (
    <Stack direction='row' alignItems='end' spacing={0.7} sx={{ height, pt: 2 }}>
      {points.map((point, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            height: `${Math.max((point / maxValue) * 100, 8)}%`,
            borderRadius: '8px 8px 3px 3px',
            background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}CC 100%)`,
            opacity: 0.95
          }}
        />
      ))}
    </Stack>
  )
}

function StatCard({ card, loading }) {
  const growth = card.growth || '-'
  const showGrowth = growth !== '-'

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: '14px',
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        overflow: 'hidden'
      }}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
        <Stack spacing={0.8}>
          <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
            {card.title}
          </Typography>
          <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>
            {loading ? '--' : card.value}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            bgcolor: `${card.color}1A`,
            color: card.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {card.icon}
        </Box>
      </Stack>

      <Stack direction='row' spacing={0.6} alignItems='center' sx={{ mt: 1 }}>
        {showGrowth ? (
          <>
            {card.trend === 'up' ? (
              <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
            ) : (
              <TrendingDownOutlinedIcon sx={{ fontSize: 18, color: '#dc2626' }} />
            )}
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: card.trend === 'up' ? '#16a34a' : '#dc2626'
              }}
            >
              {loading ? '--' : growth} vs last month
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
            Lifetime metric
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}

export default function DashboardPage() {
  const {
    loading,
    selectedFromDate,
    selectedToDate,
    setSelectedFromDate,
    setSelectedToDate,
    applyDateRange,
    period,
    kpiCards,
    userSeries,
    upgradeSeries,
    revenueSeries,
    summary
  } = useAdminDashboard()

  const userDailySeries = userSeries.map((item) => Number(item?.count || 0))
  const upgradeDailySeries = upgradeSeries.map((item) => Number(item?.count || 0))
  const revenueDailySeries = revenueSeries.map((item) => Number(item?.amount || 0))
  const conversionSeries = userSeries.map((item, index) => {
    const users = Number(item?.count || 0)
    const upgrades = Number(upgradeSeries[index]?.count || 0)
    if (!users) return 0
    return Number(((upgrades / users) * 100).toFixed(2))
  })

  const cards = kpiCards.map((card) => ({
    ...card,
    icon: iconByKey[card.iconKey]
  }))

  const activeUserDays = userDailySeries.filter((value) => value > 0).length
  const activeUpgradeDays = upgradeDailySeries.filter((value) => value > 0).length
  const zeroUserDays = Math.max(period.rangeDays - activeUserDays, 0)
  const zeroUpgradeDays = Math.max(period.rangeDays - activeUpgradeDays, 0)
  const totalPaymentAttempts =
    Number(summary.currentPeriodPaidPayments || 0) +
    Number(summary.currentPeriodFailedPayments || 0)
  const failedPaymentRate = totalPaymentAttempts > 0
    ? Number(((summary.currentPeriodFailedPayments / totalPaymentAttempts) * 100).toFixed(2))
    : 0
  const avgPaidPaymentsPerDay =
    period.rangeDays > 0
      ? Number((summary.currentPeriodPaidPayments / period.rangeDays).toFixed(2))
      : 0
  const successfulUpgradeByPlan = summary.successfulUpgradeByPlan || []
  const totalPlanUpgradeSuccess = successfulUpgradeByPlan.reduce(
    (acc, item) => acc + Number(item?.count || 0),
    0
  )

  const formatUSD = (amount) =>
    Number(amount || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

  const quickStats = [
    { title: 'Total Users', value: summary.totalUsers.toLocaleString('en-US') },
    {
      title: 'Total Workspaces',
      value: summary.totalWorkspaces.toLocaleString('en-US')
    },
    {
      title: 'Total Paid Upgrades',
      value: summary.totalPaidUpgrades.toLocaleString('en-US')
    },
    {
      title: `Average Daily Signups (${period.rangeDays}d)`,
      value: summary.averageDailyUsers.toLocaleString('en-US')
    },
    {
      title: `Average Daily Upgrades (${period.rangeDays}d)`,
      value: summary.averageDailyUpgrades.toLocaleString('en-US')
    },
    {
      title: `Revenue in Period (${period.rangeDays}d)`,
      value: formatUSD(summary.currentPeriodRevenue)
    },
    {
      title: 'Successful Upgrades by Plan',
      value: totalPlanUpgradeSuccess.toLocaleString('en-US')
    }
  ]

  return (
    <Box
      sx={{
        colorScheme: 'light',
        bgcolor: '#f8fafc',
        color: '#0f172a',
        minHeight: 'calc(100vh - 64px)',
        p: { xs: 1.5, md: 2 },
        '--card-border': '#e5e7eb',
        '--text-main': '#0f172a',
        '--text-sub': '#64748b',
        '& .MuiPaper-root': { bgcolor: '#ffffff', color: '#0f172a' },
        '& .MuiTypography-root': { color: 'inherit' },
        '& .MuiButton-outlined': { bgcolor: '#ffffff' },
        '& .MuiChip-root': { bgcolor: '#f8fafc' }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.2, md: 3 },
          mb: 2.2,
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          background:
            'radial-gradient(circle at 5% 15%, #dbeafe 0%, #eef2ff 38%, #ffffff 78%)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '32px', md: '40px' },
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.1
              }}
            >
              Growth Dashboard
            </Typography>
            <Typography sx={{ mt: 0.8, fontSize: '16px', color: '#334155' }}>
              Daily registrations, workspace upgrades, and month-over-month trends
            </Typography>
            <Stack direction='row' spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label='Live Data'
                size='small'
                sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}
              />
              <Chip
                label={
                  loading
                    ? 'Loading...'
                    : `${period.fromDate} to ${period.toDate} (${period.rangeDays} days)`
                }
                size='small'
                sx={{ bgcolor: '#ecfeff', color: '#0f766e' }}
              />
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 1.2,
              borderRadius: '14px',
              border: '1px solid #dbe4f0',
              bgcolor: '#ffffff',
              minWidth: { xs: '100%', md: 530 }
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems='flex-end'>
              <Stack spacing={0.4} sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>
                  From Date
                </Typography>
                <TextField
                  type='date'
                  size='small'
                  value={selectedFromDate}
                  onChange={(event) => setSelectedFromDate(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#fff',
                      color: '#0f172a',
                      '& fieldset': { borderColor: '#cbd5e1' },
                      '&:hover fieldset': { borderColor: '#94a3b8' }
                    },
                    '& .MuiInputBase-input': {
                      color: '#0f172a',
                      WebkitTextFillColor: '#0f172a',
                      fontSize: '14px',
                      py: 1
                    },
                    '& input::-webkit-calendar-picker-indicator': {
                      opacity: 1,
                      cursor: 'pointer'
                    }
                  }}
                />
              </Stack>

              <Stack spacing={0.4} sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>
                  To Date
                </Typography>
                <TextField
                  type='date'
                  size='small'
                  value={selectedToDate}
                  onChange={(event) => setSelectedToDate(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: '#fff',
                      color: '#0f172a',
                      '& fieldset': { borderColor: '#cbd5e1' },
                      '&:hover fieldset': { borderColor: '#94a3b8' }
                    },
                    '& .MuiInputBase-input': {
                      color: '#0f172a',
                      WebkitTextFillColor: '#0f172a',
                      fontSize: '14px',
                      py: 1
                    },
                    '& input::-webkit-calendar-picker-indicator': {
                      opacity: 1,
                      cursor: 'pointer'
                    }
                  }}
                />
              </Stack>

              <Button
                variant='contained'
                disableElevation
                onClick={applyDateRange}
                sx={{
                  textTransform: 'none',
                  minHeight: 40,
                  px: 2.8,
                  borderRadius: '10px',
                  fontWeight: 700,
                  bgcolor: '#1d4ed8',
                  '&:hover': { bgcolor: '#1e40af' }
                }}
              >
                Apply
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Paper>

      <Stack direction='row' spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 0.5 }}>
        {quickStats.map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              minWidth: 220,
              p: 1.5,
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              bgcolor: '#fff'
            }}
          >
            <Typography sx={{ fontSize: '12px', color: 'var(--text-sub)' }}>
              {item.title}
            </Typography>
            <Typography
              sx={{ mt: 0.4, fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}
            >
              {loading ? '--' : item.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Grid container spacing={2.2}>
        {cards.map((card) => (
          <Grid key={card.key} item xs={12} sm={6} lg={4}>
            <StatCard card={card} loading={loading} />
          </Grid>
        ))}

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.4, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  Daily User Registrations
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Last {period.rangeDays} days trend
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#2563eb' }}>
                {loading ? '--' : `${summary.totalUserSeries.toLocaleString('en-US')} total`}
              </Typography>
            </Stack>
            <MiniBarChart points={userDailySeries} barColor='#2563eb' height={170} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.4, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  Daily Workspace Upgrades
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Last {period.rangeDays} days trend
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#f97316' }}>
                {loading ? '--' : `${summary.totalUpgradeSeries.toLocaleString('en-US')} total`}
              </Typography>
            </Stack>
            <MiniBarChart points={upgradeDailySeries} barColor='#f97316' height={170} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.4, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  Daily Revenue (USD)
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Last {period.rangeDays} days trend
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>
                {loading ? '--' : `${formatUSD(summary.totalRevenueSeries)} total`}
              </Typography>
            </Stack>
            <MiniBarChart points={revenueDailySeries} barColor='#16a34a' height={170} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.2, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Operational Summary
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 1.2 }}>
              Selected period vs previous period
            </Typography>
            <Stack spacing={1.2}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc'
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                  User Registrations
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading
                    ? '--'
                    : `${summary.currentPeriodUsers.toLocaleString('en-US')} / ${summary.previousPeriodUsers.toLocaleString('en-US')}`}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc'
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                  Workspace Upgrades
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading
                    ? '--'
                    : `${summary.currentPeriodUpgrades.toLocaleString('en-US')} / ${summary.previousPeriodWorkspaceUpgrades.toLocaleString('en-US')}`}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 1.2,
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc'
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                  Paid / Failed Payments
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading
                    ? '--'
                    : `${summary.currentPeriodPaidPayments.toLocaleString('en-US')} / ${summary.currentPeriodFailedPayments.toLocaleString('en-US')}`}
                </Typography>
              </Paper>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.2, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Payment Health Snapshot
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
              Conversion and payment reliability
            </Typography>
            <MiniBarChart points={conversionSeries} barColor='#22c55e' height={140} />
            <Stack spacing={0.7} sx={{ mt: 1.2 }}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Upgrade / User Conversion
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>
                  {loading ? '--' : `${summary.conversion}%`}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Payment Success Rate
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#15803d' }}>
                  {loading ? '--' : `${summary.paymentSuccessRate}%`}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Failed Payment Rate
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>
                  {loading ? '--' : `${failedPaymentRate}%`}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Revenue in Period
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading ? '--' : formatUSD(summary.currentPeriodRevenue)}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Revenue Growth
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: summary.revenueGrowthPercent >= 0 ? '#16a34a' : '#dc2626'
                  }}
                >
                  {loading
                    ? '--'
                    : `${summary.revenueGrowthPercent >= 0 ? '+' : ''}${summary.revenueGrowthPercent}%`}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Avg Paid Payments / Day
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading ? '--' : avgPaidPaymentsPerDay}
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                  Payment Attempts
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {loading ? '--' : totalPaymentAttempts.toLocaleString('en-US')}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{ p: 2.2, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Activity Health
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 1.2 }}>
              Quick operational checks
            </Typography>
            <Stack spacing={1}>
              {[
                {
                  title: 'Days with user registrations',
                  value: loading
                    ? '--'
                    : `${activeUserDays}/${period.rangeDays} days active (${zeroUserDays} no-activity days)`
                },
                {
                  title: 'Days with workspace upgrades',
                  value: loading
                    ? '--'
                    : `${activeUpgradeDays}/${period.rangeDays} days active (${zeroUpgradeDays} no-activity days)`
                },
                {
                  title: 'Highest registration day',
                  value: loading
                    ? '--'
                    : `${summary.userPeak?.count || 0} users on ${formatDateKey(summary.userPeak?.date)}`
                },
                {
                  title: 'Highest upgrade day',
                  value: loading
                    ? '--'
                    : `${summary.upgradePeak?.count || 0} upgrades on ${formatDateKey(summary.upgradePeak?.date)}`
                }
              ].map((item, index) => (
                <Stack
                  key={item.title}
                  sx={{
                    px: 1.1,
                    py: 1,
                    borderRadius: '10px',
                    bgcolor: index % 2 === 0 ? '#f8fafc' : '#ffffff'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#475569' }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 2.1, borderRadius: '14px', border: '1px solid var(--card-border)', mb: 2 }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Successful Upgrades by Plan
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 1.2 }}>
              Number of successful upgrades in selected period ({period.rangeDays} days)
            </Typography>
            {!loading && successfulUpgradeByPlan.length === 0 ? (
              <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                No successful upgrades in this period.
              </Typography>
            ) : (
              <TableContainer>
                <Table
                  size='small'
                  sx={{
                    '& .MuiTableCell-root': {
                      color: '#0f172a',
                      borderColor: '#e2e8f0'
                    },
                    '& .MuiTableHead-root .MuiTableCell-root': {
                      fontWeight: 700,
                      bgcolor: '#f8fafc'
                    },
                    '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root': {
                      bgcolor: '#f8fafc'
                    }
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell align='right'>Successful Upgrades</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(loading ? new Array(3).fill(null) : successfulUpgradeByPlan).map((item, index) => (
                      <TableRow key={loading ? `loading-${index}` : `${item.planId}-${index}`}>
                        <TableCell>{loading ? '--' : item.planTitle}</TableCell>
                        <TableCell align='right'>
                          {loading ? '--' : Number(item.count || 0).toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Total</TableCell>
                      <TableCell align='right' sx={{ fontWeight: 800 }}>
                        {loading ? '--' : totalPlanUpgradeSuccess.toLocaleString('en-US')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: 2.1, borderRadius: '14px', border: '1px solid var(--card-border)' }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Quick Insights
            </Typography>
            <Grid container spacing={1.2} sx={{ mt: 0.6 }}>
              {[
                `Users in selected period: ${summary.currentPeriodUsers.toLocaleString('en-US')}`,
                `Workspace upgrades in selected period: ${summary.currentPeriodUpgrades.toLocaleString('en-US')}`,
                `Paid payments: ${summary.currentPeriodPaidPayments.toLocaleString('en-US')} | Failed payments: ${summary.currentPeriodFailedPayments.toLocaleString('en-US')}`,
                `Revenue in selected period: ${formatUSD(summary.currentPeriodRevenue)}`,
                `Payment success rate: ${summary.paymentSuccessRate}%`
              ].map((text) => (
                <Grid key={text} item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.2,
                      borderRadius: '10px',
                      border: '1px solid #eef2f7',
                      bgcolor: '#f8fafc'
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', color: '#334155' }}>
                      {loading ? 'Loading insight...' : text}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {loading && (
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 2, color: '#475569' }}>
          <CircularProgress size={18} sx={{ color: '#1d4ed8' }} />
          <Typography sx={{ fontSize: '13px' }}>Updating dashboard data...</Typography>
        </Stack>
      )}
    </Box>
  )
}
