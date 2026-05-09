import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { deleteAdminAccountAPI, fetchAdminUsersAPI, updateBlockUserAPI } from '~/apis/adminUser.api'

export const useAdminUser = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || 'all'
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const updateQueryParams = useCallback(
    ({ nextSearch, nextRole, nextPage, nextLimit }) => {
      const params = new URLSearchParams(searchParams)

      const finalSearch = nextSearch ?? search
      const finalRole = nextRole ?? role
      const finalPage = nextPage ?? page
      const finalLimit = nextLimit ?? rowsPerPage

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      if (finalRole && finalRole !== 'all') {
        params.set('role', finalRole)
      } else {
        params.delete('role')
      }

      params.set('page', String(finalPage))
      params.set('limit', String(finalLimit))

      setSearchParams(params)
    },
    [searchParams, setSearchParams, search, role, page, rowsPerPage]
  )

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const data = await fetchAdminUsersAPI({
          search,
          role,
          page,
          limit: rowsPerPage
        })

        setUsers(data.users || [])
        setTotalCount(data.totalCount || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [search, role, page, rowsPerPage])

  const handleUpdateBlockUsers = useCallback(
    async (user) => {
      await updateBlockUserAPI({ userId: user._id })

      const data = await fetchAdminUsersAPI({
        search,
        role,
        page,
        limit: rowsPerPage
      })

      setUsers(data.users || [])
      setTotalCount(data.totalCount || 0)
    },
    [search, role, page, rowsPerPage]
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

  const handleChangeRole = useCallback(
    (nextRole) => {
      updateQueryParams({
        nextRole,
        nextPage: 1
      })
    },
    [updateQueryParams]
  )

  const handleOpenDeleteModal = useCallback((user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return
    await deleteAdminAccountAPI({userId: selectedUser._id})
    setUsers((prev) => prev.filter((item) => item._id !== selectedUser._id))
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }, [selectedUser])

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

  const handleEditUser = useCallback(
    (user) => {
      navigate(`/admin/user/update/${user._id}`, {
        state: { userData: user }
      })
    },
    [navigate]
  )

  const handleCreateUser = useCallback(() => {
    navigate('/admin/user/create')
  }, [navigate])

  return {
    search,
    role,
    page: page - 1,
    rowsPerPage,
    deleteModalOpen,
    selectedUser,
    users,
    totalCount,
    loading,

    handleSearchChange,
    handleChangeRole,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditUser,
    handleCreateUser,
    handleUpdateBlockUsers
  }
}
