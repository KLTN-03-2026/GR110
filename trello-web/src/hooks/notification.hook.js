import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNotification,
  fetchInvitationsAPI,
  updateBoardInvitationAPI,
  updateWorkspaceInvitationAPI
} from '~/redux/notifications/notificationSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { fetchWorkspacesAPI } from '~/redux/workspace/workspacesSlice'
import { initSocket } from '~/socket/socket'

export const useNotification = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector((state) => state.notifications)

  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationCount, setNotificationCount] = useState(null)

  const open = useMemo(() => Boolean(anchorEl), [anchorEl])

  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (notifications) {
      const pendingCount = notifications.filter((n) => n.status === 'pending')
      setNotificationCount(pendingCount?.length)
    }
  }, [notifications])

  useEffect(() => {
    if (!currentUser?._id) return

    dispatch(fetchInvitationsAPI())

    const socket = initSocket()

    const join = () => socket.emit('user:join', { userId: currentUser._id })

    if (socket.connected) join()

    socket.on('connect', join)

    const handleReceiveInvitation = ({ userId, data }) => {
      console.log('data::::', data)
      if (userId !== currentUser._id) return
      dispatch(addNotification(data))
    }

    socket.on('invitation:created', handleReceiveInvitation)
  }, [dispatch, currentUser?._id])

  const handleUpdateNotification = async ({ notification, status }) => {
    const updatedNotification = await dispatch(
      notification.entity === 'workspace'
        ? updateWorkspaceInvitationAPI({
            _id: notification._id,
            payload: { status }
          })
        : updateBoardInvitationAPI({
            _id: notification._id,
            payload: { status }
          })
    ).unwrap()

    if (updatedNotification.status === 'accepted') {
      if (updatedNotification.entity === 'workspace') {
        dispatch(fetchWorkspacesAPI())
        navigate(`/h/workspaces/${updatedNotification.entityId}/boards`)
      }
      if (updatedNotification.entity === 'board') {
        navigate(`/boards/${updatedNotification.entityId}`)
      }
    }
  }

  return {
    anchorEl,
    open,
    notifications,
    notificationCount,
    handleClickNotificationIcon,
    handleUpdateNotification,
    handleClose
  }
}
