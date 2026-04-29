import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchWorkspacePlan } from '~/apis/workspace.api'

const mapPlanFromDbToUi = (plan) => {
  const features = []

  if (plan.feature?.capabilities?.workspace?.customRole) {
    features.push({ iconKey: 'security', text: 'Custom workspace roles' })
  }

  if (plan.feature?.capabilities?.board?.customRole) {
    features.push({ iconKey: 'board', text: 'Custom board roles' })
  }

  if (plan.feature?.capabilities?.column?.customColor) {
    features.push({ iconKey: 'layout', text: 'Custom column colors' })
  }

  if (plan.feature?.capabilities?.task?.setDue) {
    features.push({ iconKey: 'calendar', text: 'Set due dates' })
  }

  if (plan.feature?.capabilities?.task?.assignMembers) {
    features.push({ iconKey: 'observer', text: 'Assign members to tasks' })
  }

  features.push(
    { iconKey: 'member', text: `Up to ${plan.feature?.limits?.maxMembers ?? 0} members` },
    { iconKey: 'table', text: `Up to ${plan.feature?.limits?.maxBoards ?? 0} boards` },
    { iconKey: 'list', text: `Up to ${plan.feature?.limits?.maxColumnsPerBoard ?? 0} columns per board` },
    { iconKey: 'copy', text: `Up to ${plan.feature?.limits?.maxCardsPerBoard ?? 0} cards per board` },
    { iconKey: 'checklist', text: `Up to ${plan.feature?.limits?.maxChecklistItemsPerCard ?? 0} checklist items per card` },
    { iconKey: 'inbox', text: `Up to ${plan.feature?.limits?.maxCommentsPerCard ?? 0} comments per card` },
    { iconKey: 'file', text: `Storage ${plan.feature?.limits?.maxStorageMb ?? 0}MB` },
    { iconKey: 'download', text: `Max file size ${plan.feature?.limits?.maxFileSizeMb ?? 0}MB` }
  )

  return {
    id: plan._id,
    title: plan.title,
    price: plan.currentPrice,
    currency: 'VND',
    interval: plan.billingCycle === 'monthly' ? 'month' : plan.billingCycle,
    features,
    description: plan.description,
    originPrice: plan.originPrice,
    status: plan.status,
    isCurrentPlan: plan.isCurrentPlan
  }
}

export default function useBillingPage() {
  const [plans, setPlans] = useState([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)

  const { workspaceId } = useParams()

  useEffect(() => {
    let isMounted = true

    const fetchPlans = async () => {
      setIsLoadingPlans(true)
      try {
        const data = await fetchWorkspacePlan(workspaceId)
        if (!isMounted) return
        setPlans(data.map(mapPlanFromDbToUi))
      } finally {
        if (!isMounted) return
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()
    return () => {
      isMounted = false
    }
  }, [workspaceId])

  return { plans, isLoadingPlans }
}
