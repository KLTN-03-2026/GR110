import { useDispatch, useSelector } from 'react-redux'
import {
  addCardCommentAPI,
  archiveCardAPI,
  assignMemberToCardAPI,
  clearAndHideCurrentActiveCard,
  createCheckListAPI,
  deleteAttachmentAPI,
  deleteCardAPI,
  deleteCardCommentAPI,
  deleteCheckListAPI,
  joinCardAPI,
  leaveCardAPI,
  removeMemberFromCardAPI,
  restoreCardAPI,
  selectIsShowModalActiveCard,
  updateAttachmentAPI,
  updateCardBasicAPI,
  updateCardLabelAPI,
  updateCheckListAPI,
  uploadAttachmentAPI
} from '~/redux/activeCard/activeCardSlice'
import {
  removeCardInBoard,
  updateCardInBoard,
  restoreCardInBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { pick } from 'lodash'
import { CARD_FIELDS } from '~/constant/cardFields'
import { getAttachmentDownloadUrl } from '~/apis/attachment.api'

const useCardDetail = () => {
  const dispatch = useDispatch()
  const activeCard = useSelector(
    (state) => state.activeCard?.currentActiveCard?.cardDetail
  )
  const comments = useSelector(
    (state) => state.activeCard?.currentActiveCard?.comments
  )

  const logs = useSelector((state) => state.activeCard?.currentActiveCard?.logs)

  const checklists = useSelector(
    (state) => state.activeCard?.currentActiveCard?.checklists
  )

  const attachments = useSelector(
    (state) => state.activeCard?.currentActiveCard?.attachments
  )

  const board = useSelector((state) => state.activeBoard?.board)

  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const handleUpdateCardTitle = async (newTitle) => {
    const updatedCard = await dispatch(
      updateCardBasicAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload: { title: newTitle.trim() }
      })
    )
    dispatch(updateCardInBoard(pick(updatedCard.payload.card, CARD_FIELDS)))
  }

  const handleUpdateCardDescription = async (newDescription) => {
    const updatedCard = await dispatch(
      updateCardBasicAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload: { description: newDescription.trim() }
      })
    )
    dispatch(updateCardInBoard(pick(updatedCard.payload.card, CARD_FIELDS)))
  }

  const handleUpdateCardDates = async (data) => {
    const updatedCard = await dispatch(
      updateCardBasicAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload: { startedAt: data.startedAt, dueAt: data.dueAt }
      })
    )
    dispatch(updateCardInBoard(updatedCard.payload.card))
  }

  const handleUpdateIsCompleted = async () => {
    const updatedCard = await dispatch(
      updateCardBasicAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload: { isCompleted: !activeCard.isCompleted }
      })
    )
    dispatch(updateCardInBoard(updatedCard.payload.card))
  }

  const handleUpdateCover = async (data) => {
    const payload = !data
      ? { cover: null }
      : { cover: { type: data.type, value: data.value } }
    const updatedCard = await dispatch(
      updateCardBasicAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload
      })
    )
    dispatch(updateCardInBoard(updatedCard.payload.card))
  }

  const handleArchiveCard = async () => {
    try {
      const updatedCard = await dispatch(
        archiveCardAPI({ _id: activeCard._id, boardId: board._id })
      )
      dispatch(removeCardInBoard(updatedCard.payload.card))
    } catch (error) {
      throw new Error()
    }
  }

  const handleRestoreCard = async () => {
    try {
      const updatedCard = await dispatch(
        restoreCardAPI({ _id: activeCard._id, boardId: board._id })
      )
      dispatch(restoreCardInBoard(updatedCard.payload.card))
    } catch (error) {
      throw new Error()
    }
  }

  const handleDeleteCard = async () => {
    await dispatch(deleteCardAPI({ _id: activeCard._id, boardId: board._id }))
  }

  // const onUploadCardCover = (event) => {
  //   const error = singleFileValidator(event.target?.files[0])
  //   if (error) {
  //     toast.error(error)
  //     return
  //   }
  //   let reqData = new FormData()
  //   reqData.append('cardCover', event.target?.files[0])

  //   toast.promise(
  //     callApiUpdateCard(reqData).finally(() => {
  //       event.target.value = ''
  //     }),
  //     { pending: 'Updating...' }
  //   )
  // }

  // ============================= Comment =============================
  const handleAddComment = async (data) => {
    const payload = {
      cardId: activeCard._id,
      boardId: activeCard.boardId,
      content: data
    }
    const createdComment = await dispatch(
      addCardCommentAPI({ boardId: activeCard.boardId, payload })
    )
    const card = createdComment.payload.card
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleDeleteComment = async (data) => {
    const deletedComment = await dispatch(
      deleteCardCommentAPI({ _id: data._id, boardId: activeCard.boardId })
    )
    const card = deletedComment.payload.card
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  // ============================= Task =============================
  const handleCreateChecklist = async (data) => {
    const payload = { cardId: activeCard._id, content: data }
    await dispatch(createCheckListAPI({ payload, boardId: activeCard.boardId }))
  }

  const handleCreateTask = async (data) => {
    const payload = { cardId: activeCard._id, ...data }
    const createdTask = await dispatch(
      createCheckListAPI({ payload, boardId: activeCard.boardId })
    )
    const card = createdTask.payload.card
    if (!card) return
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleUpdateTaskContent = async ({ _id, content }) => {
    await dispatch(
      updateCheckListAPI({
        _id,
        boardId: activeCard.boardId,
        payload: { content: content.trim() }
      })
    )
  }

  const handleUpdateTaskIsCompleted = async ({ _id, isCompleted }) => {
    const updatedTask = await dispatch(
      updateCheckListAPI({
        _id,
        boardId: activeCard.boardId,
        payload: { isCompleted }
      })
    )
    const card = updatedTask.payload.card
    if (!card) return
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleUpdateTaskDueAt = async ({ _id, dueAt }) => {
    await dispatch(
      updateCheckListAPI({
        _id,
        boardId: activeCard.boardId,
        payload: { dueAt }
      })
    )
  }

  const handleUpdateTaskMember = async ({ _id, memberId }) => {
    await dispatch(
      updateCheckListAPI({
        _id,
        boardId: activeCard.boardId,
        payload: { memberId }
      })
    )
  }

  const handleDeleteTask = async (data) => {
    const deletedTask = await dispatch(
      deleteCheckListAPI({ _id: data._id, boardId: activeCard.boardId })
    )
    const card = deletedTask.payload.card
    if (!card) return
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  // ============================= Member =============================
  const handleJoinCard = async () => {
    const updatedCard = await dispatch(
      joinCardAPI({ _id: activeCard._id, boardId: activeCard.boardId })
    )
    const { card } = updatedCard.payload
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleLeaveCard = async () => {
    const updatedCard = await dispatch(
      leaveCardAPI({ _id: activeCard._id, boardId: activeCard.boardId })
    )
    const { card } = updatedCard.payload
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleAssignMemberToCard = async (data) => {
    const payload = { memberId: data._id }
    const updatedCard = await dispatch(
      assignMemberToCardAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload
      })
    )
    const card = updatedCard.payload.card
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleRemoveMemberFromCard = async (data) => {
    const payload = { memberId: data._id }
    const updatedCard = await dispatch(
      removeMemberFromCardAPI({
        _id: activeCard._id,
        boardId: activeCard.boardId,
        payload
      })
    )
    const card = updatedCard.payload.card
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  // ============================= Attachment =============================
  const handleUploadFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    formData.append('cardId', activeCard._id)
    formData.append('boardId', activeCard.boardId)

    const uploaded = await dispatch(uploadAttachmentAPI({ payload: formData }))
    const card = uploaded.payload?.cardDetail
    dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
  }

  const handleDownloadAttachment = async ({ _id }) => {
    const data = await getAttachmentDownloadUrl({
      _id,
      boardId: activeCard.boardId
    })
    if (!data) return
    window.open(data, '_blank')
  }

  const handleUpdateAttachment = async (data) => {
    await dispatch(
      updateAttachmentAPI({
        _id: data.attachmentId,
        boardId: activeCard.boardId,
        payload: { fileName: data.fileName }
      })
    )
  }

  const handleDeleteAttachment = async (data) => {
    try {
      const deleted = await dispatch(
        deleteAttachmentAPI({ _id: data._id, boardId: activeCard.boardId })
      )
      const card = deleted.payload.cardDetail
      dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
    } catch {
      throw new Error()
    }
  }
  // ============================= Labels =============================
  const handleUpdateCardLabel = async (data) => {
    try {
      const payload = { labelId: data._id }
      const updated = await dispatch(
        updateCardLabelAPI({
          _id: activeCard._id,
          boardId: activeCard.boardId,
          payload
        })
      )
      const card = updated.payload
      dispatch(updateCardInBoard(pick(card, CARD_FIELDS)))
    } catch {
      throw new Error()
    }
  }

  return {
    activeCard,
    columnName:
      board.columns.find((c) => c._id === activeCard?.columnId)?.title ||
      'Untitled',
    isShowModalActiveCard,
    handleCloseModal,
    handleUpdateCardTitle,
    handleUpdateCardDescription,
    data: {
      cardHeader: {
        columnName:
          board.columns.find((c) => c._id === activeCard?.columnId)?.title ||
          'Untitled',
        cover: activeCard?.cover,
        status: activeCard?.status,
        archivedAt: activeCard?.archivedAt,
        memberIds: activeCard?.memberIds
      },
      cardButton: {
        dates: { startedAt: activeCard?.startedAt, dueAt: activeCard?.dueAt },
        memberIds: activeCard?.memberIds,
        labelIds: activeCard?.labelIds
      },
      attachments: { attachments },
      checklists: { checklists },
      cardActivity: { comments, logs, boardMembers: board.members || [] }
    },
    handler: {
      cardHeader: {
        handleCloseModal,
        handleUpdateCover,
        handleArchiveCard,
        handleRestoreCard,
        handleDeleteCard,
        handleJoinCard,
        handleLeaveCard
      },
      cardButton: {
        handleUpdateCardDates,
        handleCreateChecklist,
        handleAssignMemberToCard,
        handleRemoveMemberFromCard,
        handleUploadFiles,
        handleUpdateCardLabel
      },
      checklists: {
        handleCreateTask,
        handleDeleteTask,
        handleUpdateTaskContent,
        handleUpdateTaskIsCompleted,
        handleUpdateTaskDueAt,
        handleUpdateTaskMember
      },
      attachments: {
        handleUploadFiles,
        handleDeleteAttachment,
        handleUpdateAttachment,
        handleDownloadAttachment
      },
      cardActivity: {
        handleAddComment,
        handleDeleteComment
      },
      handleUpdateIsCompleted
    }
  }
}
export default useCardDetail
