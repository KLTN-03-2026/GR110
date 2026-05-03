import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAdminDashboardOverviewAPI } from '~/apis/adminDashboard.api'

const toInputDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDefaultFromDate = () => {
  const now = new Date()
  return toInputDate(new Date(now.getFullYear(), now.getMonth(), 1))
}

const getDefaultToDate = () => toInputDate(new Date())

const sumSeries = (series = []) =>
  series.reduce((acc, item) => acc + Number(item?.count || 0), 0)

const averageSeries = (series = []) => {
  if (!series.length) return 0
  return Number((sumSeries(series) / series.length).toFixed(2))
}

const getPeakAndLow = (series = []) => {
  if (!series.length) {
    return {
      peak: { date: '-', count: 0 },
      low: { date: '-', count: 0 }
    }
  }

  let peak = { ...series[0], count: Number(series[0]?.count || 0) }
  let low = { ...series[0], count: Number(series[0]?.count || 0) }

  for (const item of series) {
    const value = Number(item?.count || 0)
    if (value > peak.count) peak = { ...item, count: value }
    if (value < low.count) low = { ...item, count: value }
  }

  return { peak, low }
}

const toTrend = (value) => (Number(value || 0) >= 0 ? 'up' : 'down')

const formatGrowth = (value) => {
  const num = Number(value || 0)
  const absValue = Math.abs(num).toFixed(2)
  return `${num >= 0 ? '+' : '-'}${absValue}%`
}

export default function useAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  const queryFromDate = searchParams.get('fromDate') || getDefaultFromDate()
  const queryToDate = searchParams.get('toDate') || getDefaultToDate()

  const [selectedFromDate, setSelectedFromDate] = useState(queryFromDate)
  const [selectedToDate, setSelectedToDate] = useState(queryToDate)

  useEffect(() => {
    setSelectedFromDate(queryFromDate)
    setSelectedToDate(queryToDate)
  }, [queryFromDate, queryToDate])

  const applyDateRange = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set('fromDate', selectedFromDate)
    params.set('toDate', selectedToDate)
    setSearchParams(params)
  }, [searchParams, selectedFromDate, selectedToDate, setSearchParams])

  useEffect(() => {
    let ignore = false

    const fetchOverview = async () => {
      try {
        setLoading(true)
        const data = await fetchAdminDashboardOverviewAPI({
          fromDate: queryFromDate,
          toDate: queryToDate
        })
        if (!ignore) setDashboardData(data)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchOverview()
    return () => {
      ignore = true
    }
  }, [queryFromDate, queryToDate])

  const summary = dashboardData?.summary || {}
  const userSeries = dashboardData?.charts?.userRegistrationsByDay || []
  const upgradeSeries = dashboardData?.charts?.workspaceUpgradesByDay || []
  const period = dashboardData?.period || {
    fromDate: queryFromDate,
    toDate: queryToDate,
    rangeDays: 0
  }

  const derived = useMemo(() => {
    const currentPeriodUsers = Number(summary.currentPeriodUsers || 0)
    const currentPeriodUpgrades = Number(summary.currentPeriodWorkspaceUpgrades || 0)
    const conversion =
      currentPeriodUsers > 0
        ? Number(((currentPeriodUpgrades / currentPeriodUsers) * 100).toFixed(2))
        : 0

    const userPeakInfo = getPeakAndLow(userSeries)
    const upgradePeakInfo = getPeakAndLow(upgradeSeries)

    return {
      totalUsers: Number(summary.totalUsers || 0),
      totalWorkspaces: Number(summary.totalWorkspaces || 0),
      totalPaidUpgrades: Number(summary.totalPaidUpgrades || 0),
      currentPeriodUsers,
      previousPeriodUsers: Number(summary.previousPeriodUsers || 0),
      currentPeriodUpgrades,
      previousPeriodWorkspaceUpgrades: Number(
        summary.previousPeriodWorkspaceUpgrades || 0
      ),
      currentPeriodPaidPayments: Number(summary.currentPeriodPaidPayments || 0),
      previousPeriodPaidPayments: Number(summary.previousPeriodPaidPayments || 0),
      currentPeriodFailedPayments: Number(summary.currentPeriodFailedPayments || 0),
      previousPeriodFailedPayments: Number(summary.previousPeriodFailedPayments || 0),
      paymentSuccessRate: Number(summary.paymentSuccessRate || 0),
      userGrowthPercent: Number(summary.userGrowthPercent || 0),
      workspaceUpgradeGrowthPercent: Number(
        summary.workspaceUpgradeGrowthPercent || 0
      ),
      paidPaymentGrowthPercent: Number(summary.paidPaymentGrowthPercent || 0),
      failedPaymentGrowthPercent: Number(summary.failedPaymentGrowthPercent || 0),
      conversion,
      totalUserSeries: sumSeries(userSeries),
      totalUpgradeSeries: sumSeries(upgradeSeries),
      averageDailyUsers: averageSeries(userSeries),
      averageDailyUpgrades: averageSeries(upgradeSeries),
      userPeak: userPeakInfo.peak,
      userLow: userPeakInfo.low,
      upgradePeak: upgradePeakInfo.peak,
      upgradeLow: upgradePeakInfo.low
    }
  }, [summary, userSeries, upgradeSeries])

  const kpiCards = useMemo(
    () => [
      {
        key: 'users-period',
        iconKey: 'users',
        title: 'Users in Period',
        value: derived.currentPeriodUsers.toLocaleString('en-US'),
        growth: formatGrowth(derived.userGrowthPercent),
        trend: toTrend(derived.userGrowthPercent),
        color: '#2563eb'
      },
      {
        key: 'upgrades-period',
        iconKey: 'upgrades',
        title: 'Workspace Upgrades',
        value: derived.currentPeriodUpgrades.toLocaleString('en-US'),
        growth: formatGrowth(derived.workspaceUpgradeGrowthPercent),
        trend: toTrend(derived.workspaceUpgradeGrowthPercent),
        color: '#0ea5e9'
      },
      {
        key: 'paid-payments-period',
        iconKey: 'paidUpgrades',
        title: 'Paid Payments',
        value: derived.currentPeriodPaidPayments.toLocaleString('en-US'),
        growth: formatGrowth(derived.paidPaymentGrowthPercent),
        trend: toTrend(derived.paidPaymentGrowthPercent),
        color: '#14b8a6'
      },
      {
        key: 'failed-payments-period',
        iconKey: 'conversion',
        title: 'Failed Payments',
        value: derived.currentPeriodFailedPayments.toLocaleString('en-US'),
        growth: formatGrowth(derived.failedPaymentGrowthPercent),
        trend: toTrend(-derived.failedPaymentGrowthPercent),
        color: '#ef4444'
      },
      {
        key: 'payment-success-rate',
        iconKey: 'workspaces',
        title: 'Payment Success Rate',
        value: `${derived.paymentSuccessRate}%`,
        growth: '-',
        trend: 'up',
        color: '#22c55e'
      },
      {
        key: 'total-paid-upgrades',
        iconKey: 'totalUsers',
        title: 'Total Paid Upgrades',
        value: derived.totalPaidUpgrades.toLocaleString('en-US'),
        growth: '-',
        trend: 'up',
        color: '#f59e0b'
      }
    ],
    [derived]
  )

  return {
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
    summary: derived
  }
}
