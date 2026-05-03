import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  fetchAdminPaymentAPI,
  fetchAdminPaymentTransactionAPI
} from '~/apis/adminPayment.api'

export default function useAdminPayment() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const gateway = searchParams.get('gateway') || 'all'
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const updateQueryParams = useCallback(
    ({ nextSearch, nextGateway, nextPage, nextLimit }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalGateway = nextGateway ?? gateway
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      if (finalGateway && finalGateway !== 'all') {
        params.set('gateway', finalGateway)
      } else {
        params.delete('gateway')
      }

      params.set('page', String(finalPage))
      params.set('limit', String(finalLimit))

      setSearchParams(params)
    },
    [searchParams, setSearchParams, search, gateway, page, rowsPerPage]
  )

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)

        const data = await fetchAdminPaymentAPI({
          search,
          gateway,
          page,
          limit: rowsPerPage
        })

        setPayments(data.payments || [])
        setTotalCount(data.totalCount || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [search, gateway, page, rowsPerPage])

  const handleSearchChange = useCallback(
    (event) => {
      updateQueryParams({
        nextSearch: event.target.value,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleChangeGateway = useCallback(
    (nextGateway) => {
      updateQueryParams({
        nextGateway,
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

  const fetchPaymentTransactionDetail = useCallback(async (paymentId) => {
    if (!paymentId) return null

    return await fetchAdminPaymentTransactionAPI({ paymentId })
  }, [])

  return {
    payments,
    totalCount,
    loading,
    search,
    gateway,
    page: page - 1,
    rowsPerPage,
    fetchPaymentTransactionDetail,
    handleSearchChange,
    handleChangeGateway,
    handleChangePage,
    handleChangeRowsPerPage
  }
}
