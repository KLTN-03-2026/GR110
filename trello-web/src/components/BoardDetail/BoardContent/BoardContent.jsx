import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Box from '@mui/material/Box'
import { CardDragOverlay } from './ListColumns/Column/ListCards/Card/Card'
import useBoardContent from '~/hooks/boardContent.hook'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useEffect, useRef } from 'react'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  columnCollapseMode,
  clearColumnCollapseMode
}) {
  const scrollContainerRef = useRef(null)
  const isDndDraggingRef = useRef(false)
  const panStateRef = useRef({
    isPointerDown: false,
    isPanning: false,
    startX: 0,
    startScrollLeft: 0
  })

  const {
    sensors,
    orderedColumns,
    activeDragItemType,
    activeDragItemData,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetDragState,
    customDropAnimation,
    collisionDetectionStrategy
  } = useBoardContent({
    board,
    moveColumns,
    moveCardInTheSameColumn,
    moveCardToDifferentColumn
  })

  const stopPan = () => {
    const state = panStateRef.current
    if (!state.isPointerDown && !state.isPanning) return
    state.isPointerDown = false
    state.isPanning = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }

  useEffect(() => {
    const handleMouseMove = (event) => {
      const state = panStateRef.current
      if (isDndDraggingRef.current) return
      if (!state.isPointerDown) return

      const container = scrollContainerRef.current
      if (!container) return

      const deltaX = event.clientX - state.startX
      if (!state.isPanning && Math.abs(deltaX) < 6) return

      if (!state.isPanning) {
        state.isPanning = true
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'grabbing'
      }

      container.scrollLeft = state.startScrollLeft - deltaX
      event.preventDefault()
    }

    const handleMouseUp = () => stopPan()
    const handleWindowBlur = () => stopPan()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('blur', handleWindowBlur)
      stopPan()
    }
  }, [])

  const handleMouseDownOnBlank = (event) => {
    stopPan()
    if (isDndDraggingRef.current) return
    if (event.button !== 0) return

    const nativePath = event.nativeEvent?.composedPath?.() || []
    const pathElements = nativePath.filter((node) => node instanceof Element)
    const matchesInPath = (selector) =>
      pathElements.some((el) => el.matches?.(selector))

    const target =
      event.target instanceof Element ? event.target : event.target?.parentElement

    if (
      matchesInPath('[data-card-item="true"]') ||
      matchesInPath('[data-column-item="true"]') ||
      matchesInPath('[data-column-drag-handle="true"]') ||
      matchesInPath(
        'button, input, textarea, select, a, [contenteditable="true"], [data-no-dnd="true"], .MuiCard-root'
      ) ||
      target?.closest?.(
        '[data-column-item="true"], button, input, textarea, select, a, [contenteditable="true"], [data-no-dnd="true"], .MuiCard-root'
      )
    ) {
      return
    }

    const container = scrollContainerRef.current
    if (!container) return

    panStateRef.current.isPointerDown = true
    panStateRef.current.isPanning = false
    panStateRef.current.startX = event.clientX
    panStateRef.current.startScrollLeft = container.scrollLeft
  }

  const handleDndDragStart = (event) => {
    isDndDraggingRef.current = true
    stopPan()
    handleDragStart(event)
  }

  const handleDndDragEnd = (event) => {
    isDndDraggingRef.current = false
    handleDragEnd(event)
  }

  const handleDndDragCancel = () => {
    isDndDraggingRef.current = false
    resetDragState()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDndDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDndDragEnd}
      onDragCancel={handleDndDragCancel}
    >
      <Box
        onMouseDownCapture={handleMouseDownOnBlank}
        sx={{
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumns}
          columnCollapseMode={columnCollapseMode}
          clearColumnCollapseMode={clearColumnCollapseMode}
          scrollContainerRef={scrollContainerRef}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column
              column={activeDragItemData}
              columnCollapseMode={columnCollapseMode}
              clearColumnCollapseMode={clearColumnCollapseMode}
            />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <CardDragOverlay card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
