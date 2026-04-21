import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAdminPermissionAPI } from '~/apis/adminPermission.api'

export default function useAdminPermissionPage() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const rowsPerPage = Number(searchParams.get('limit') || 8)

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
    const fetchPermission = async () => {
      try {
        setLoading(true)

        const data = await fetchAdminPermissionAPI({
          search,
          page,
          limit: rowsPerPage
        })
        console.log(data);
        
        setPermissions(data.permissions || [])
        setTotalCount(data.totalCount || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchPermission()
  }, [search, page, rowsPerPage])

  const handleSearchChange = useCallback((event) => {
    updateQueryParams({
      nextSearch: event.target.value,
      nextPage: 1
    })
  }, [])

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
    permissions,
    totalCount,
    search,
    page: page - 1,
    rowsPerPage,
    handleSearchChange,
    handleChangePage,
    handleChangeRowsPerPage
  }
}
