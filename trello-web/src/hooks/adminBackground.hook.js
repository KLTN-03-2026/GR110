import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  deleteAdminBackgroundAPI,
  fetchAdminBackgroundAPI,
  updateBlockBackgroundAPI
} from '~/apis/adminBackground.api'

export const useAdminBackground = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const entity = searchParams.get('entity') || 'all'
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const [backgrounds, setBackgrounds] = useState([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const updateQueryParams = useCallback(
    ({ nextSearch, nextEntity, nextPage, nextLimit }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalEntity = nextEntity ?? entity
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      if (finalEntity && finalEntity !== 'all') {
        params.set('entity', finalEntity)
      } else {
        params.delete('entity')
      }

      params.set('page', String(finalPage))
      params.set('limit', String(finalLimit))

      setSearchParams(params)
    },
    [searchParams, setSearchParams, search, entity, page, rowsPerPage]
  )

  const fetchBackgrounds = useCallback(async () => {
    try {
      setLoading(true)

      const data = await fetchAdminBackgroundAPI({
        search,
        entity,
        page,
        limit: rowsPerPage
      })

      setBackgrounds(data.backgrounds || [])
      setTotalCount(data.totalCount || 0)
    } finally {
      setLoading(false)
    }
  }, [search, entity, page, rowsPerPage])

  useEffect(() => {
    fetchBackgrounds()
  }, [fetchBackgrounds])

  const handleUpdateBlockBackground = useCallback(
    async (background) => {
      await updateBlockBackgroundAPI({ backgroundId: background._id })
      await fetchBackgrounds()
    },
    [fetchBackgrounds]
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

  const handleChangeEntity = useCallback(
    (nextEntity) => {
      updateQueryParams({
        nextEntity,
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

  const handleOpenDeleteModal = useCallback((background) => {
    setSelectedBackground(background)
    setDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setSelectedBackground(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!selectedBackground) return

      await deleteAdminBackgroundAPI({ _id: selectedBackground._id })

      setBackgrounds((prev) =>
        prev.filter((item) => item._id !== selectedBackground._id)
      )
      setTotalCount((prev) => Math.max(prev - 1, 0))

      setDeleteModalOpen(false)
      setSelectedBackground(null)
    } catch (error) {
      setDeleteModalOpen(false)
      setSelectedBackground(null)
      console.log(error)
    }
  }, [selectedBackground])

  const handleEditBackground = useCallback(
    (background) => {
      navigate(`/admin/background/update/${background._id}`, {
        state: { backgroundData: background }
      })
    },
    [navigate]
  )

  const handleCreateBackground = useCallback(() => {
    navigate('/admin/background/create')
  }, [navigate])

  return {
    search,
    entity,
    page: page - 1,
    rowsPerPage,
    backgrounds,
    totalCount,
    loading,
    deleteModalOpen,
    selectedBackground,

    handleSearchChange,
    handleChangeEntity,
    handleChangePage,
    handleChangeRowsPerPage,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleEditBackground,
    handleCreateBackground,
    handleUpdateBlockBackground,
    refetchBackgrounds: fetchBackgrounds
  }
}