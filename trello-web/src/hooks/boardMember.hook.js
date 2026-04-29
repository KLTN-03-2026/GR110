import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchBoardMemberPageAPI,
  fetchBoardRoleAPI,
  leaveBoardAPI,
  removeBoardMemberAPI,
  updateBoardMemberRoleAPI
} from '~/apis/board.api'
import { fetchWorkspaceMemberAPI } from '~/apis/workspace.api'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { inviteUserToBoardAPI } from '~/apis/invitation.api'
import { useSelector } from 'react-redux'

const FIXED_ROWS_PER_PAGE = 7

export const useBoardMember = () => {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteCandidates, setInviteCandidates] = useState([])
  const [inviteKeyword, setInviteKeyword] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [roles, setRoles] = useState([])

  const { boardId } = useParams()
  const board = useSelector((state) => state.activeBoard.board)
  const navigate = useNavigate()

  const fetchBoardMembers = useCallback(
    async ({ searchValue = '', pageValue = 0 } = {}) => {
      if (!boardId) return

      const data = await fetchBoardMemberPageAPI({
        _id: boardId,
        search: searchValue,
        page: pageValue + 1,
        limit: FIXED_ROWS_PER_PAGE
      })

      setMembers(data.boardMember || [])
      setTotalCount(data.totalCount || 0)
    },
    [boardId]
  )

  const fetchBoardRole = useCallback(async () => {
    if (!boardId) return
    const data = await fetchBoardRoleAPI({ _id: boardId })
    setRoles(data || [])
  }, [boardId])

  const debounceFetchBoardMembers = useDebounceFn(fetchBoardMembers, 500)

  useEffect(() => {
    fetchBoardMembers()
    fetchBoardRole()
  }, [fetchBoardMembers, fetchBoardRole])

  const handleInputSearchChange = useCallback(
    (event) => {
      const value = event.target.value || ''
      setSearch(value)
      setPage(0)
      debounceFetchBoardMembers({ searchValue: value, pageValue: 0 })
    },
    [debounceFetchBoardMembers]
  )

  const handleChangePage = useCallback(
    (_, newPage) => {
      setPage(newPage)
      fetchBoardMembers({ searchValue: search, pageValue: newPage })
    },
    [fetchBoardMembers, search]
  )

  const fetchInviteCandidates = useCallback(
    async (keyword = '') => {
      if (!board?.workspaceId) return

      const data = await fetchWorkspaceMemberAPI({
        _id: board.workspaceId,
        search: keyword,
        page: 1
      })

      setInviteCandidates(data?.workspaceMember || [])
    },
    [board?.workspaceId]
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

  const debounceFetchInviteCandidates = useDebounceFn(fetchInviteCandidates, 500)

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

  const handleInvite = useCallback(
    async (data) => {
      try {
        setIsInviting(true)
        await inviteUserToBoardAPI({ payload: { boardId, ...data } })
        handleCloseInviteModal()
        await fetchBoardMembers({ searchValue: search, pageValue: page })
      } finally {
        setIsInviting(false)
      }
    },
    [boardId, handleCloseInviteModal, fetchBoardMembers, search, page]
  )

  const handleChangeMemberRole = useCallback(
    async ({ _id, newRole }) => {
      const data = await updateBoardMemberRoleAPI({
        _id,
        boardId,
        payload: { roleId: newRole }
      })

      setMembers((prev) =>
        prev.map((m) => (m._id === data._id ? { ...m, ...data } : m))
      )
    },
    [boardId]
  )

  const handleRemoveMember = useCallback(
    async ({ memberId }) => {
      const data = await removeBoardMemberAPI({ _id: memberId, boardId })
      setMembers((prev) =>
        prev.map((m) => (m._id === data._id ? { ...m, ...data } : m))
      )
    },
    [boardId]
  )

  const handleLeaveBoard = useCallback(
    async ({ memberId }) => {
      await leaveBoardAPI({ memberId, boardId })
      navigate(`/h/workspaces/${board?.workspaceId}/boards`)
    },
    [boardId, board?.workspaceId, navigate]
  )

  return {
    members,
    search,
    page,
    rowsPerPage: FIXED_ROWS_PER_PAGE,
    totalCount,
    handleInputSearchChange,
    handleChangePage,
    handleOpenInviteModal,
    handleChangeMemberRole,
    handleRemoveMember,
    handleLeaveBoard,
    roles,
    inviteModal: {
      isOpen: isInviteModalOpen,
      users: inviteCandidates,
      searchKeyword: inviteKeyword,
      loading: isInviting,
      onClose: handleCloseInviteModal,
      onSubmit: handleInvite,
      onSearchChange: handleInviteSearchChange
    }
  }
}