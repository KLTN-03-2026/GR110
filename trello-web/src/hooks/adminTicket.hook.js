import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  fetchAdminTicketAPI,
  rejectTicketAPI,
  replyTicketAPI
} from '~/apis/adminTicket.api'

export const useAdminTicket = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || 'all'
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [viewReplyModalOpen, setViewReplyModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const [tickets, setTickets] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const updateQueryParams = useCallback(
    ({ nextSearch, nextType, nextPage, nextLimit }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalType = nextType ?? type
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
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
    [searchParams, setSearchParams, search, type, page, rowsPerPage]
  )

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)

      const data = await fetchAdminTicketAPI({
        search,
        type,
        page,
        limit: rowsPerPage
      })
      setTickets(data?.tickets || [])
      setTotalCount(data?.totalCount || 0)
    } finally {
      setLoading(false)
    }
  }, [search, type, page, rowsPerPage])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleSearchChange = useCallback(
    (event) => {
      updateQueryParams({
        nextSearch: event.target.value,
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

  const handleOpenReplyModal = useCallback((ticket) => {
    setSelectedTicket(ticket)
    setReplyModalOpen(true)
  }, [])

  const handleCloseReplyModal = useCallback(() => {
    setReplyModalOpen(false)
    setSelectedTicket(null)
  }, [])

  const handleOpenViewReplyModal = useCallback((ticket) => {
    setSelectedTicket(ticket)
    setViewReplyModalOpen(true)
  }, [])

  const handleCloseViewReplyModal = useCallback(() => {
    setViewReplyModalOpen(false)
    setSelectedTicket(null)
  }, [])

  const handleRejectTicket = useCallback(
    async (ticket) => {
      await rejectTicketAPI({ ticketId: ticket._id })
      await fetchTickets()
    },
    [fetchTickets]
  )

  const handleReplyTicket = useCallback(
    async ({ ticketId, replyContent }) => {
      await replyTicketAPI({
        ticketId,
        replyContent
      })

      handleCloseReplyModal()
      await fetchTickets()
    },
    [fetchTickets, handleCloseReplyModal]
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

  return {
    search,
    type,
    page: page - 1,
    rowsPerPage,

    replyModalOpen,
    viewReplyModalOpen,
    selectedTicket,

    tickets,
    totalCount,
    loading,

    handleSearchChange,
    handleChangeType,
    handleOpenReplyModal,
    handleCloseReplyModal,
    handleOpenViewReplyModal,
    handleCloseViewReplyModal,
    handleRejectTicket,
    handleReplyTicket,
    handleChangePage,
    handleChangeRowsPerPage,
    refetchTickets: fetchTickets
  }
}