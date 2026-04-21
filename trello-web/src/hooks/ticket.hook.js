import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createTicketApi, fetchTicketsAPI } from '~/apis/ticket.api'

export const useTicket = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 3)
  const status = searchParams.get('status') || 'all'
  const type = searchParams.get('type') || 'all'

  const [tickets, setTickets] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const updateQueryParams = useCallback(
    ({ nextSearch, nextPage, nextLimit, nextStatus, nextType }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage
      const finalStatus = nextStatus ?? status
      const finalType = nextType ?? type

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      if (finalStatus && finalStatus !== 'all') {
        params.set('status', finalStatus)
      } else {
        params.delete('status')
      }

      if (finalType && finalType !== 'all') {
        params.set('type', finalType)
      } else {
        params.delete('type')
      }

      params.set('page', String(finalPage))
      params.set('limit', String(finalLimit))

      setSearchParams(params)
    },
    [searchParams, setSearchParams, search, page, rowsPerPage, status, type]
  )

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)

      const data = await fetchTicketsAPI({
        search,
        page,
        limit: rowsPerPage,
        status,
        type
      })

      setTickets(data?.tickets || [])
      setTotalCount(data?.totalCount || 0)
    } finally {
      setLoading(false)
    }
  }, [search, page, rowsPerPage, status, type])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleSearchChange = useCallback(
    (value) => {
      updateQueryParams({
        nextSearch: value,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleChangePage = useCallback(
    (_event, newPage) => {
      updateQueryParams({
        nextPage: newPage
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

  const handleChangeStatus = useCallback(
    (nextStatus) => {
      updateQueryParams({
        nextStatus,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleChangeType = useCallback(
    (nextType) => {
      updateQueryParams({
        nextType,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / rowsPerPage) || 1
  }, [totalCount, rowsPerPage])

  return {
    search,
    page,
    rowsPerPage,
    status,
    type,

    tickets,
    totalCount,
    totalPages,
    loading,
    creating,

    handleSearchChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeStatus,
    handleChangeType,
    refetchTickets: fetchTickets
  }
}