import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  deleteAdminPlanAPI,
  fetchAdminPlanAPI,
  updateBlockPlanAPI
} from '~/apis/adminPlan.api'

export const useAdminPlan = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [plans, setPlans] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

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
    const fetchPlans = async () => {
      try {
        setLoading(true)

        const data = await fetchAdminPlanAPI({
          search,
          page,
          limit: rowsPerPage
        })

        setPlans(data.plans || [])
        setTotalCount(data.totalCount || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [search, page, rowsPerPage])

  const handleUpdateBlockPlan = useCallback(
    async (plan) => {
      await updateBlockPlanAPI({ planId: plan._id })
      const data = await fetchAdminPlanAPI({
        search,
        page,
        limit: rowsPerPage
      })
      setPlans(data.plans || [])
      setTotalCount(data.totalCount || 0)
    },
    [search, page, rowsPerPage]
  )

  const handleSearchChange = useCallback(
    (event) => {
      updateQueryParams({
        nextSearch: event.target.value,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleOpenDeleteModal = useCallback((plan) => {
    setSelectedPlan(plan)
    setDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setSelectedPlan(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedPlan?._id) return

    await deleteAdminPlanAPI({ planId: selectedPlan._id })

    const data = await fetchAdminPlanAPI({
      search,
      page,
      limit: rowsPerPage
    })

    setPlans(data.plans || [])
    setTotalCount(data.totalCount || 0)
    handleCloseDeleteModal()
  }, [selectedPlan, search, page, rowsPerPage, handleCloseDeleteModal])

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

  const handleEditPlan = useCallback(
    (plan) => {
      navigate(`/admin/plan/update/${plan._id}`, {
        state: { planData: plan }
      })
    },
    [navigate]
  )

  const handleCreatePlan = useCallback(() => {
    navigate('/admin/plan/create')
  }, [navigate])

  return {
    search,
    page: page - 1,
    rowsPerPage,
    deleteModalOpen,
    selectedPlan,
    plans,
    totalCount,
    loading,

    handleSearchChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditPlan,
    handleCreatePlan,
    handleUpdateBlockPlan
  }
}
