import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { aiGenerateBoardAPI, createNewBoardsAPI } from '~/apis'
import { fetchBoardByWorkspaceIdAPI } from '~/apis/board.api'
import { fetchWorkspaceQuota } from '~/apis/workspace.api'

const BOARD_ITEMS_PER_PAGE = 10

export const useWorkspaceBoards = () => {
  const [boards, setBoards] = useState([])
  const [count, setCount] = useState(0)
  const [isOpenCreateBoard, setIsOpenCreateBoard] = useState(false)
  const [isOpenAIGenerateBoard, setIsOpenAIGenerateBoard] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { workspaceId } = useParams()
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    if (!workspaceId) return

    const fetchWorkspaceBoards = async () => {
      const data = await fetchBoardByWorkspaceIdAPI({
        workspaceId,
        page,
        itemsPerPage: BOARD_ITEMS_PER_PAGE
      })

      setBoards(data.boards)
      setCount(data.count)
    }

    fetchWorkspaceBoards()
  }, [workspaceId, page])

  const handleOpenCreateBoard = () => setIsOpenCreateBoard(true)
  const handleCloseCreateBoard = () => setIsOpenCreateBoard(false)
  const handleOpenAIGenerateBoard = () => setIsOpenAIGenerateBoard(true)
  const handleCloseAIGenerateBoard = () => setIsOpenAIGenerateBoard(false)

  const handleCreateBoard = async (data) => {
    try {
      setIsSubmitting(true)

      const payload = {
        ...data,
        workspaceId
      }

      const board = await createNewBoardsAPI(payload)

      setBoards((prev) => {
        const nextBoards = [board, ...prev]
        return nextBoards.slice(0, BOARD_ITEMS_PER_PAGE)
      })

      setCount((prev) => prev + 1)
      handleCloseCreateBoard()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIGenerateBoard = async (prompt) => {
    try {
      setIsSubmitting(true)

      const board = await aiGenerateBoardAPI({ prompt, workspaceId })

      setBoards((prev) => {
        const nextBoards = [board, ...prev]
        return nextBoards.slice(0, BOARD_ITEMS_PER_PAGE)
      })

      setCount((prev) => prev + 1)

      return board
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    ui: {
      boardList: {
        page,
        itemsPerPage: BOARD_ITEMS_PER_PAGE,
        createModal: {
          isOpen: isOpenCreateBoard,
          ai: {
            isOpen: isOpenAIGenerateBoard
          }
        }
      }
    },
    data: {
      boardList: {
        boards,
        count
      }
    },
    handler: {
      boardList: {
        handleOpenCreateBoard,
        handleOpenAIGenerateBoard,
        createModal: {
          isSubmitting,
          handleCreateBoard,
          handleClose: handleCloseCreateBoard,
          handleAIGenerateBoard,
          ai: {
            isSubmitting,
            handleOpen: handleOpenAIGenerateBoard,
            handleClose: handleCloseAIGenerateBoard,
            handleGenerate: handleAIGenerateBoard
          }
        }
      }
    }
  }
}
