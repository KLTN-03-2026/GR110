import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { inviteUserToWorkspaceAPI } from '~/apis/invitation.api'
import { fetchUsersAPI } from '~/apis/user.api'
import {
  fetchWorkspaceMemberAPI,
  fetchWorkspaceRoleAPI,
  leaveWorkspaceAPI,
  removeWorkspaceMemberAPI,
  updateWorkspaceMemberRoleAPI
} from '~/apis/workspace.api'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { fetchWorkspacesAPI } from '~/redux/workspace/workspacesSlice'

const FIXED_ROWS_PER_PAGE = 7

export const useWorkspaceMember = () => {
  const { workspaceId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [members, setMembers] = useState([])
  const [roles, setRoles] = useState([])
  const [inviteCandidates, setInviteCandidates] = useState([])

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  const search = searchParams.get('search') || ''
  const [memberKeyword, setMemberKeyword] = useState(search)
  const [inviteKeyword, setInviteKeyword] = useState('')
  const [totalCount, setTotalCount] = useState(0)

  const updateQueryParams = useCallback(
    ({ nextPage, nextSearch }) => {
      const params = new URLSearchParams(searchParams)

      const finalPage = nextPage ?? page
      const finalSearch = nextSearch ?? search

      if (finalSearch) {
        params.set('search', finalSearch)
      } else {
        params.delete('search')
      }

      params.set('page', String(finalPage))
      setSearchParams(params)
    },
    [searchParams, setSearchParams, page, search]
  )

  const fetchWorkspaceMembers = useCallback(async () => {
    if (!workspaceId) return

    const data = await fetchWorkspaceMemberAPI({
      _id: workspaceId,
      search,
      page
    })

    setMembers(data.workspaceMember || [])
    setTotalCount(data.totalCount || 0)
  }, [workspaceId, search, page])

  const fetchInviteCandidates = useCallback(async (keyword = '') => {
    const data = await fetchUsersAPI({ search: keyword })
    setInviteCandidates(data || [])
  }, [])

  const handleDebouncedMemberSearch = useCallback((value) => {
    updateQueryParams({
      nextSearch: value,
      nextPage: 1
    })
  }, [updateQueryParams])

  const debounceUpdateMemberSearch = useDebounceFn(
    handleDebouncedMemberSearch,
    500
  )

  const debounceFetchInviteCandidates = useDebounceFn(fetchInviteCandidates, 500)

  const fetchWorkspaceRole = useCallback(async () => {
    if (!workspaceId) return
    const data = await fetchWorkspaceRoleAPI({ _id: workspaceId })
    setRoles(data || [])
  }, [workspaceId])

  useEffect(() => {
    fetchWorkspaceMembers()
  }, [fetchWorkspaceMembers])

  useEffect(() => {
    fetchWorkspaceRole()
  }, [fetchWorkspaceRole])

  useEffect(() => {
    setMemberKeyword(search)
  }, [search])

  const handleMemberSearchChange = useCallback(
    (event) => {
      const value = event.target.value || ''
      setMemberKeyword(value)
      debounceUpdateMemberSearch(value.trim())
    },
    [debounceUpdateMemberSearch]
  )

  const handleChangePage = useCallback(
    (_, newPage) => {
      updateQueryParams({
        nextPage: newPage + 1
      })
    },
    [updateQueryParams]
  )

  const handleInviteSearchChange = useCallback(
    (value = '') => {
      setInviteKeyword(value)
      if (value.trim().length < 3) {
        setInviteCandidates([])
        return
      }
      debounceFetchInviteCandidates(value.trim())
    },
    [debounceFetchInviteCandidates]
  )

  const handleOpenInviteModal = useCallback(() => {
    setIsInviteModalOpen(true)
  }, [])

  const handleCloseInviteModal = useCallback(() => {
    if (isInviting) return
    setIsInviteModalOpen(false)
    setInviteKeyword('')
    setInviteCandidates([])
  }, [isInviting])

  const handleInvite = useCallback(
    async (data) => {
      try {
        setIsInviting(true)
        await inviteUserToWorkspaceAPI({ payload: { workspaceId, ...data } })
        handleCloseInviteModal()
        await fetchWorkspaceMembers()
      } finally {
        setIsInviting(false)
      }
    },
    [workspaceId, handleCloseInviteModal, fetchWorkspaceMembers]
  )

  const handleChangeMemberRole = useCallback(
    async ({ _id, newRole }) => {
      const data = await updateWorkspaceMemberRoleAPI({
        workspaceId,
        memberId: _id,
        payload: { roleId: newRole }
      })

      setMembers((prev) =>
        prev.map((m) => (m._id === data._id ? { ...m, ...data } : m))
      )
    },
    [workspaceId]
  )

  const handleLeaveWorkspace = useCallback(
    async ({ memberId }) => {
      await leaveWorkspaceAPI({ memberId })
      dispatch(fetchWorkspacesAPI())
      navigate('/h')
    },
    [dispatch, navigate]
  )

  const handleRemoveMember = useCallback(
    async ({ memberId }) => {
      const data = await removeWorkspaceMemberAPI({ workspaceId, memberId })
      setMembers((prev) =>
        prev.map((m) => (m._id === data._id ? { ...m, ...data } : m))
      )
    },
    [workspaceId]
  )

  return {
    members,
    roles,
    page: page - 1,
    rowsPerPage: FIXED_ROWS_PER_PAGE,
    memberKeyword,
    totalCount,
    handleMemberSearchChange,
    handleOpenInviteModal,
    handleChangeMemberRole,
    handleLeaveWorkspace,
    handleRemoveMember,
    handleChangePage,
    inviteModal: {
      users: inviteCandidates,
      searchKeyword: inviteKeyword,
      isOpen: isInviteModalOpen,
      loading: isInviting,
      onClose: handleCloseInviteModal,
      onSubmit: handleInvite,
      onSearchChange: handleInviteSearchChange
    }
  }
}
