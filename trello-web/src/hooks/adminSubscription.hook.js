import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  cancelAdminSubscriptionApi,
  fetchAdminSubscriptionAPI
} from '~/apis/adminSubscription.api'

export const useAdminSubscription = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const [selectedSubscription, setSelectedSubscription] = useState();
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const [subscriptions, setSubscriptions] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleOpenCancelModal = (subscription) => {
    setSelectedSubscription(subscription)
    setCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false)
    setSelectedSubscription(null)
  }

  const updateQueryParams = useCallback(
    ({ nextSearch, nextPage, nextLimit }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      params.set('page', String(finalPage))
      params.set('limit', String(finalLimit))

      setSearchParams(params)
    },
    [searchParams, setSearchParams, search, page, rowsPerPage]
  )

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)

        const data = await fetchAdminSubscriptionAPI({
          search,
          page,
          limit: rowsPerPage
        })

        setSubscriptions(data.subscriptions || [])
        setTotalCount(data.totalCount || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [search, page, rowsPerPage])

  const handleSearchChange = useCallback(
    (event) => {
      updateQueryParams({
        nextSearch: event.target.value,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleChangePage = useCallback(
    (_, newPage) => {
      updateQueryParams({
        nextPage: newPage + 1
      })
    },
    [updateQueryParams]
  )

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      updateQueryParams({
        nextLimit: parseInt(event.target.value, 10),
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleEditSubscription = useCallback(
    (subscription) => {
      navigate(`/admin/subscription/update/${subscription._id}`, {
        state: { subscriptionData: subscription }
      })
    },
    [navigate]
  )

  const handleCancelSubscription = async ({
    subscriptionId,
    subscriptionData
  }) => {
    try {
      await cancelAdminSubscriptionApi({ subscriptionId, subscriptionData })

      const response = await fetchAdminSubscriptionAPI({
        search,
        page,
        limit: rowsPerPage
      })
      
      setSubscriptions(response.subscriptions || [])
      setTotalCount(response.totalCount || 0)
    } catch (error) {
      console.log(error)
    }
  }
  const formatDateTime = (dateString) => {
    if (!dateString) return '--'

    const date = new Date(dateString)

    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return {
    search,
    page: page - 1,
    rowsPerPage,
    subscriptions,
    totalCount,
    loading,
    cancelModalOpen,
    selectedSubscription,
    setSelectedSubscription,
    handleCloseCancelModal,
    handleOpenCancelModal,

    handleSearchChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditSubscription,
    formatDateTime,
    handleCancelSubscription
  }
}
