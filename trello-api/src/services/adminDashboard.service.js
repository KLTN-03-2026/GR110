import { BadRequestErrorResponse } from '~/core/error.response'
import AdminDashboardRepo from '~/repo/adminDashboard.repo'

const MAX_RANGE_DAYS = 366
const MS_PER_DAY = 24 * 60 * 60 * 1000

const addDays = (date, days) => {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

const toDateKey = (date) => date.toISOString().slice(0, 10)

const toUtcDateOnly = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

const parseDateInput = (value, label) => {
  if (!value || typeof value !== 'string') {
    throw new BadRequestErrorResponse(`${label} is required (YYYY-MM-DD)`)
  }

  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!matched) {
    throw new BadRequestErrorResponse(`${label} must be YYYY-MM-DD`)
  }

  const year = Number(matched[1])
  const month = Number(matched[2]) - 1
  const day = Number(matched[3])
  const date = new Date(Date.UTC(year, month, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    throw new BadRequestErrorResponse(`${label} is invalid`)
  }

  return date
}

const calcGrowthPercent = ({ current, previous }) => {
  if (!previous) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(2))
}

const buildDailySeries = ({ rawData, startDate, endDate }) => {
  const countMap = new Map(rawData.map((item) => [item.date, item.count]))
  const series = []

  for (let cursor = new Date(startDate); cursor < endDate; cursor = addDays(cursor, 1)) {
    const date = toDateKey(cursor)
    series.push({
      date,
      count: countMap.get(date) || 0
    })
  }

  return series
}

const buildDailyRevenueSeries = ({ rawData, startDate, endDate }) => {
  const amountMap = new Map(rawData.map((item) => [item.date, Number(item.amount || 0)]))
  const series = []

  for (let cursor = new Date(startDate); cursor < endDate; cursor = addDays(cursor, 1)) {
    const date = toDateKey(cursor)
    series.push({
      date,
      amount: Number((amountMap.get(date) || 0).toFixed(2))
    })
  }

  return series
}

class AdminDashboardService {
  static fetchOverview = async ({ data }) => {
    const now = new Date()
    const todayUtc = toUtcDateOnly(now)
    const defaultFromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const defaultToDate = todayUtc

    const startDate = data?.fromDate
      ? parseDateInput(data.fromDate, 'fromDate')
      : defaultFromDate
    const endDateInclusive = data?.toDate
      ? parseDateInput(data.toDate, 'toDate')
      : defaultToDate

    if (endDateInclusive < startDate) {
      throw new BadRequestErrorResponse('toDate must be greater than or equal to fromDate')
    }

    const rangeDays =
      Math.floor((endDateInclusive.getTime() - startDate.getTime()) / MS_PER_DAY) + 1

    if (rangeDays > MAX_RANGE_DAYS) {
      throw new BadRequestErrorResponse(
        `Date range must be less than or equal to ${MAX_RANGE_DAYS} days`
      )
    }

    const endDateExclusive = addDays(endDateInclusive, 1)
    const previousStartDate = addDays(startDate, -rangeDays)
    const previousEndDateExclusive = startDate

    const [
      rawUserDaily,
      rawUpgradeDaily,
      rawRevenueDaily,
      totalUsers,
      totalWorkspaces,
      totalPaidUpgrades,
      currentPeriodUsers,
      previousPeriodUsers,
      currentPeriodUpgrades,
      previousPeriodUpgrades,
      currentPeriodPaidPayments,
      previousPeriodPaidPayments,
      currentPeriodFailedPayments,
      previousPeriodFailedPayments,
      currentPeriodRevenue,
      previousPeriodRevenue,
      successfulUpgradeByPlan
    ] = await Promise.all([
      AdminDashboardRepo.getUserRegistrationsByDay({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getWorkspaceUpgradesByDay({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getRevenueByDay({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getTotalUsers(),
      AdminDashboardRepo.getTotalWorkspaces(),
      AdminDashboardRepo.getTotalPaidUpgrades(),
      AdminDashboardRepo.getUserCountByDateRange({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getUserCountByDateRange({
        startDate: previousStartDate,
        endDate: previousEndDateExclusive
      }),
      AdminDashboardRepo.getWorkspaceUpgradeCountByDateRange({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getWorkspaceUpgradeCountByDateRange({
        startDate: previousStartDate,
        endDate: previousEndDateExclusive
      }),
      AdminDashboardRepo.getPaidPaymentCountByDateRange({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getPaidPaymentCountByDateRange({
        startDate: previousStartDate,
        endDate: previousEndDateExclusive
      }),
      AdminDashboardRepo.getFailedPaymentCountByDateRange({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getFailedPaymentCountByDateRange({
        startDate: previousStartDate,
        endDate: previousEndDateExclusive
      }),
      AdminDashboardRepo.getRevenueAmountByDateRange({
        startDate,
        endDate: endDateExclusive
      }),
      AdminDashboardRepo.getRevenueAmountByDateRange({
        startDate: previousStartDate,
        endDate: previousEndDateExclusive
      }),
      AdminDashboardRepo.getSuccessfulUpgradeByPlan({
        startDate,
        endDate: endDateExclusive
      })
    ])

    const userRegistrationsByDay = buildDailySeries({
      rawData: rawUserDaily,
      startDate,
      endDate: endDateExclusive
    })

    const workspaceUpgradesByDay = buildDailySeries({
      rawData: rawUpgradeDaily,
      startDate,
      endDate: endDateExclusive
    })

    const revenueByDay = buildDailyRevenueSeries({
      rawData: rawRevenueDaily,
      startDate,
      endDate: endDateExclusive
    })

    const currentPeriodTotalPayments =
      Number(currentPeriodPaidPayments || 0) + Number(currentPeriodFailedPayments || 0)
    const paymentSuccessRate = currentPeriodTotalPayments
      ? Number(
        ((Number(currentPeriodPaidPayments || 0) / currentPeriodTotalPayments) * 100).toFixed(2)
      )
      : 0

    return {
      period: {
        fromDate: toDateKey(startDate),
        toDate: toDateKey(endDateInclusive),
        rangeDays
      },
      summary: {
        totalUsers,
        totalWorkspaces,
        totalPaidUpgrades,
        currentPeriodUsers,
        previousPeriodUsers,
        userGrowthPercent: calcGrowthPercent({
          current: currentPeriodUsers,
          previous: previousPeriodUsers
        }),
        currentPeriodWorkspaceUpgrades: currentPeriodUpgrades,
        previousPeriodWorkspaceUpgrades: previousPeriodUpgrades,
        workspaceUpgradeGrowthPercent: calcGrowthPercent({
          current: currentPeriodUpgrades,
          previous: previousPeriodUpgrades
        }),
        currentPeriodPaidPayments,
        previousPeriodPaidPayments,
        paidPaymentGrowthPercent: calcGrowthPercent({
          current: currentPeriodPaidPayments,
          previous: previousPeriodPaidPayments
        }),
        currentPeriodFailedPayments,
        previousPeriodFailedPayments,
        failedPaymentGrowthPercent: calcGrowthPercent({
          current: currentPeriodFailedPayments,
          previous: previousPeriodFailedPayments
        }),
        currentPeriodRevenue,
        previousPeriodRevenue,
        revenueGrowthPercent: calcGrowthPercent({
          current: currentPeriodRevenue,
          previous: previousPeriodRevenue
        }),
        paymentSuccessRate
      },
      charts: {
        userRegistrationsByDay,
        workspaceUpgradesByDay,
        revenueByDay
      },
      breakdowns: {
        successfulUpgradeByPlan
      }
    }
  }
}

export default AdminDashboardService
