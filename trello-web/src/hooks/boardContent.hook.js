import {
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const useBoardContent = ({
  board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm, video 37)
  const lastOverId = useRef(null)
  const lastCrossColumnMoveRef = useRef(null)
  const lastSameColumnMoveRef = useRef(null)
  const didDragOverReorderInSameColumnRef = useRef(false)
  const latestSameColumnOrderRef = useRef(null)

  useEffect(() => {
    // Columns đã được sắp xếp ở component cha cao nhất (boards/_id.jsx) (Video 71 đã giải thích lý do)
    setOrderedColumns(board.columns)
  }, [board])

  const columnsById = useMemo(() => {
    const map = new Map()
    orderedColumns.forEach((column) => map.set(column._id, column))
    return map
  }, [orderedColumns])

  const cardIdToColumnIdMap = useMemo(() => {
    const map = new Map()
    orderedColumns.forEach((column) => {
      column?.cards?.forEach((card) => map.set(card._id, column._id))
    })
    return map
  }, [orderedColumns])

  // Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    const columnId = cardIdToColumnIdMap.get(cardId)
    return columnId ? columnsById.get(columnId) : null
  }

  // Hỗ trợ tìm Column theo cả cardId và columnId.
  // Quan trọng khi thả vào column rỗng: over.id lúc này sẽ là columnId.
  const findColumnByCardIdOrColumnId = (id) => {
    if (!id) return null
    return findColumnByCardId(id) || columnsById.get(id) || null
  }

  const findCardById = (cardId) => {
    const column = findColumnByCardId(cardId)
    return column?.cards?.find((card) => card._id === cardId) || null
  }

  const resetDragState = () => {
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
    lastOverId.current = null
    lastCrossColumnMoveRef.current = null
    lastSameColumnMoveRef.current = null
    didDragOverReorderInSameColumnRef.current = false
    latestSameColumnOrderRef.current = null
  }

  const getOverCardIndex = (over, overCards, overCardId) => {
    const sortableIndex = over?.data?.current?.sortable?.index
    if (typeof sortableIndex === 'number') return sortableIndex
    return overCards.findIndex((card) => card._id === overCardId)
  }

  const getInsertIndex = (active, over, overCards, overCardId) => {
    const overCardIndex = getOverCardIndex(over, overCards, overCardId)
    if (overCardIndex < 0) return overCards.length

    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height
    const modifier = isBelowOverItem ? 1 : 0
    const nextIndex = overCardIndex + modifier

    return Math.max(0, Math.min(nextIndex, overCards.length))
  }

  const reorderCardInTheSameColumn = ({
    activeColumn,
    oldCardIndex,
    newCardIndex,
    triggerFrom
  }) => {
    const cardsInCurrentColumn = activeColumn.cards.filter(
      (card) => !card.FE_PlaceholderCard
    )
    if (oldCardIndex < 0 || newCardIndex < 0) return false

    const boundedNewCardIndex = Math.max(
      0,
      Math.min(newCardIndex, cardsInCurrentColumn.length - 1)
    )

    if (oldCardIndex === boundedNewCardIndex) return false

    const dndOrderedCards = arrayMove(
      cardsInCurrentColumn,
      oldCardIndex,
      boundedNewCardIndex
    )
    const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)

    latestSameColumnOrderRef.current = {
      columnId: activeColumn._id,
      cards: dndOrderedCards,
      cardOrderIds: dndOrderedCardIds
    }

    setOrderedColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column._id !== activeColumn._id) return column
        return {
          ...column,
          cards: dndOrderedCards,
          cardOrderIds: dndOrderedCardIds
        }
      })
    )

    if (triggerFrom === 'handleDragEnd') {
      moveCardInTheSameColumn(
        dndOrderedCards,
        dndOrderedCardIds,
        oldColumnWhenDraggingCard._id
      )
    }

    return true
  }

  // Khởi tạo Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau.
  const moveCardBetweenDifferentColumns = ({
    active,
    over,
    activeColumnId,
    overColumnId,
    activeDraggingCardId,
    activeDraggingCardData,
    overCardId,
    triggerFrom
  }) => {
    setOrderedColumns((prevColumns) => {
      // Chỉ clone 2 columns liên quan thay vì cloneDeep toàn bộ board để giảm lag
      const nextColumns = prevColumns.map((column) => {
        if (column._id === activeColumnId || column._id === overColumnId) {
          return { ...column }
        }
        return column
      })

      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumnId
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumnId
      )

      if (!nextActiveColumn || !nextOverColumn) return prevColumns

      // nextActiveColumn: Column cũ
      const nextActiveCards = nextActiveColumn.cards.filter(
        (card) => card._id !== activeDraggingCardId
      )

      // Thêm Placeholder Card nếu Column rỗng: Bị kéo hết Card đi, không còn cái nào nữa. (Video 37.2)
      nextActiveColumn.cards = isEmpty(nextActiveCards)
        ? [generatePlaceholderCard(nextActiveColumn)]
        : nextActiveCards

      // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
      nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
        (card) => card._id
      )

      // nextOverColumn: Column mới
      // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
      const overCardsWithoutActiveCard = nextOverColumn.cards
        .filter((card) => !card.FE_PlaceholderCard)
        .filter((card) => card._id !== activeDraggingCardId)

      const newCardIndex = getInsertIndex(
        active,
        over,
        overCardsWithoutActiveCard,
        overCardId
      )

      // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau.
      const rebuildActiveDraggingCardData = {
        ...activeDraggingCardData,
        columnId: nextOverColumn._id
      }

      // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
      nextOverColumn.cards = overCardsWithoutActiveCard.toSpliced(
        newCardIndex,
        0,
        rebuildActiveDraggingCardData
      )

      // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)

      // Nếu function này được gọi từ handleDragEnd nghĩa là đã kéo thả xong, lúc này mới xử lý gọi API 1 lần ở đây
      if (triggerFrom === 'handleDragEnd') {
        // Phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver và tới đây là state của card đã bị cập nhật một lần rồi.
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          overColumnId,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    const activeItemType = event?.active?.data?.current?.columnId
      ? ACTIVE_DRAG_ITEM_TYPE.CARD
      : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    setActiveDragItemType(activeItemType)

    if (activeItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const activeCard = findCardById(event?.active?.id)
      setActiveDragItemData(activeCard || event?.active?.data?.current)
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
      return
    }

    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    // over có thể tạm thời null khi con trỏ đi qua vùng trống, không được reset state ở đây
    if (!active || !over) return

    // activeDraggingCard: Là cái card đang được kéo
    const { id: activeDraggingCardId } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardIdOrColumnId(activeDraggingCardId)
    const overColumn = findColumnByCardIdOrColumnId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      const overCardsWithoutActiveCard = overColumn.cards
        .filter((card) => !card.FE_PlaceholderCard)
        .filter((card) => card._id !== activeDraggingCardId)
      const insertIndex = getInsertIndex(
        active,
        over,
        overCardsWithoutActiveCard,
        overCardId
      )
      const nextMoveKey = `${activeDraggingCardId}:${activeColumn._id}->${overColumn._id}@${insertIndex}`
      if (lastCrossColumnMoveRef.current === nextMoveKey) return
      lastCrossColumnMoveRef.current = nextMoveKey

      const activeDraggingCardData =
        activeColumn.cards.find((card) => card._id === activeDraggingCardId) ||
        activeDragItemData

      moveCardBetweenDifferentColumns({
        active,
        over,
        activeColumnId: activeColumn._id,
        overColumnId: overColumn._id,
        activeDraggingCardId,
        activeDraggingCardData,
        overCardId,
        triggerFrom: 'handleDragOver'
      })
    } else {
      lastCrossColumnMoveRef.current = null
      const cardsInCurrentColumn = activeColumn.cards.filter(
        (card) => !card.FE_PlaceholderCard
      )
      const oldCardIndex = cardsInCurrentColumn.findIndex(
        (card) => card._id === activeDraggingCardId
      )
      const newCardIndex = getOverCardIndex(
        over,
        cardsInCurrentColumn,
        overCardId
      )
      const nextMoveKey = `${activeDraggingCardId}:${activeColumn._id}@${oldCardIndex}->${newCardIndex}`
      if (lastSameColumnMoveRef.current === nextMoveKey) return
      lastSameColumnMoveRef.current = nextMoveKey

      const reordered = reorderCardInTheSameColumn({
        activeColumn,
        oldCardIndex,
        newCardIndex,
        triggerFrom: 'handleDragOver'
      })

      if (reordered) {
        didDragOverReorderInSameColumnRef.current = true
      }
    }
  }

  // Trigger khi kết thúc hành động kéo (drag) một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Nếu thả ra ngoài vùng droppable thì kết thúc drag state
    if (!active || !over) {
      resetDragState()
      return
    }

    // Xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      if (!oldColumnWhenDraggingCard?._id) {
        resetDragState()
        return
      }
      // activeDraggingCard: Là cái card đang được kéo
      const { id: activeDraggingCardId } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardIdOrColumnId(activeDraggingCardId)
      const overColumn = findColumnByCardIdOrColumnId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) {
        resetDragState()
        return
      }

      const activeDraggingCardData =
        activeColumn.cards.find((card) => card._id === activeDraggingCardId) ||
        activeDragItemData

      // Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns({
          active,
          over,
          activeColumnId: activeColumn._id,
          overColumnId: overColumn._id,
          activeDraggingCardId,
          activeDraggingCardData,
          overCardId,
          triggerFrom: 'handleDragEnd'
        })
      } else if (didDragOverReorderInSameColumnRef.current) {
        // Nếu đã reorder khi dragOver thì chỉ cần persist thứ tự hiện tại, tránh re-calc lần nữa gây nhảy.
        const latestSameColumnOrder = latestSameColumnOrderRef.current
        if (
          latestSameColumnOrder &&
          latestSameColumnOrder.columnId === activeColumn._id
        ) {
          moveCardInTheSameColumn(
            latestSameColumnOrder.cards,
            latestSameColumnOrder.cardOrderIds,
            oldColumnWhenDraggingCard._id
          )
        } else {
          const fallbackCards = activeColumn.cards.filter(
            (card) => !card.FE_PlaceholderCard
          )
          const fallbackCardIds = fallbackCards.map((card) => card._id)

          moveCardInTheSameColumn(
            fallbackCards,
            fallbackCardIds,
            oldColumnWhenDraggingCard._id
          )
        }
      } else {
        const cardsInCurrentColumn = activeColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )
        const oldCardIndex = cardsInCurrentColumn.findIndex(
          (card) => card._id === activeDraggingCardId
        )
        const newCardIndex = getOverCardIndex(
          over,
          cardsInCurrentColumn,
          overCardId
        )

        reorderCardInTheSameColumn({
          activeColumn,
          oldCardIndex,
          newCardIndex,
          triggerFrom: 'handleDragEnd'
        })
      }
    }

    // Xử lý kéo thả Columns trong một cái boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        // Lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )

        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )

        // Vẫn gọi update State ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API (small trick)
        setOrderedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    resetDragState()
  }

  /**
   * Animation khi thả (Drop) phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay (video 32)
   */
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }

  // Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns (video 37 fix bug quan trọng)
  // args = arguments = Các Đối số, tham số
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args)

      // Video 37.1: Nếu pointerIntersections là mảng rỗng, return luôn không làm gì hết.
      // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
      //  - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
      if (!pointerIntersections?.length) return

      // // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (không cần bước này nữa - video 37.1)
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args)

      // Tìm overId đầu tiên trong đám pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        // Video 37: Đoạn này để fix cái vụ flickering nhé.
        // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng closestCorners mình thấy mượt mà hơn.
        // Nếu không có đoạn checkColumn này thì bug flickering vẫn fix đc rồi nhưng mà kéo thả sẽ rất giật giật lag.
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          const cardCollision = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return (
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
              )
            })
          })[0]?.id

          // console.log('overId before: ', overId)
          // Nếu column không có card (hoặc không tìm được card va chạm),
          // giữ nguyên overId là columnId để vẫn drop được vào column rỗng.
          overId = cardCollision || overId
          // console.log('overId after: ', overId)
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return {
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
  }
}

export default useBoardContent
