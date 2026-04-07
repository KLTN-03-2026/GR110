import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const useBoardDetail = () => {
  const dispatch = useDispatch()

  const { boardId } = useParams()
  const board = useSelector((state) => state.activeBoard?.board)
  const members = useSelector((state) => state.activeBoard?.members)

  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverView, setPopoverView] = useState(null)
  const [action, setAction] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)

  const handleOpenMoreOption = (event) => {
    setAnchorEl(event.currentTarget)
    setPopoverView('more')
  }

  const handleCloseMoreOption = () => {
    setPopoverView(null)
    setAnchorEl(null)
    setSelectedLabel(null)
    setAction(null)
  }

  const handleOpenLabelList = () => {
    setPopoverView('labels')
  }

  const handleCloseLabelList = () => {
    setPopoverView('more')
  }

  const handleOpenLabelForm = (label = null, nextAction = null) => {
    setSelectedLabel(label)
    setAction(nextAction)
    setPopoverView('labelForm')
  }

  const handleCloseLabelForm = () => {
    setPopoverView('more')
    setSelectedLabel(null)
    setAction(null)
  }

  const handleOpenActivityList = () => {
    setPopoverView('activity')
  }

  const handleCloseActivityList = () => {
    setPopoverView('more')
  }

  const handleOpenArchivedList = () => {
    setPopoverView('archived')
  }

  const handleCloseArchivedList = () => {
    setPopoverView('more')
  }

  const handleBack = () => {
    setPopoverView('labels')
    setSelectedLabel(null)
    setAction(null)
  }

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    updateColumnDetailsAPI({
      boardId,
      columnId,
      payload: { cardOrderIds: dndOrderedCardIds }
    })
  }

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    if (prevCardOrderIds?.[0]?.includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    moveCardToDifferentColumnAPI({
      boardId,
      updateData: {
        currentCardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
          ?.cardOrderIds
      }
    })
  }

  return {
    board,
    isDenied: useSelector((state) => state.activeBoard?.isDenied),
    members,
    moveColumns,
    moveCardInTheSameColumn,
    moveCardToDifferentColumn,
    boardModal: {
      open,
      handleClose,
      handleOpen
    },
    boardPopover: {
      anchorEl,
      action,
      selectedLabel,
      openMoreOption: Boolean(anchorEl) && popoverView === 'more',
      openLabelList: Boolean(anchorEl) && popoverView === 'labels',
      openLabelForm: Boolean(anchorEl) && popoverView === 'labelForm',
      openActivityList: Boolean(anchorEl) && popoverView === 'activity',
      openArchivedList: Boolean(anchorEl) && popoverView === 'archived',
      handleOpenActivityList,
      handleCloseActivityList,
      handleOpenArchivedList,
      handleCloseArchivedList,
      handleOpenMoreOption,
      handleCloseMoreOption,
      handleOpenLabelList,
      handleCloseLabelList,
      handleOpenLabelForm,
      handleCloseLabelForm,
      handleBack
    }
  }
}

export default useBoardDetail
