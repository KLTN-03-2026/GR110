import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import authorizeAxiosInstance from '~/utils/authorizeAxios'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

export const fetchCardDetailAPI = createAsyncThunk(
  'notifications/fetchCardDetailAPI',
  async ({ _id }) => {
    const response = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/cards/${_id}`
    )
    return response.data.metadata
  }
)

export const updateCardBasicAPI = createAsyncThunk(
  'notifications/updateCardBasicAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

export const archiveCardAPI = createAsyncThunk(
  'notifications/archiveCardAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/archive/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

export const restoreCardAPI = createAsyncThunk(
  'notifications/restoreCardAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/restore/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

export const deleteCardAPI = createAsyncThunk(
  'notifications/deleteCardAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/cards/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

// ========================== COMMENT ==========================
export const addCardCommentAPI = createAsyncThunk(
  'notifications/addCardCommentAPI',
  async ({ boardId, payload }) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/comments/${boardId}`,
      payload
    )
    return response.data.metadata
  }
)

export const deleteCardCommentAPI = createAsyncThunk(
  'notifications/deleteCardCommentAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/comments/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

// ========================== CHECKLIST ==========================
export const createCheckListAPI = createAsyncThunk(
  'notifications/createCheckListAPI',
  async ({ boardId, payload }) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/tasks/${boardId}`,
      payload
    )
    return response.data.metadata
  }
)

export const updateCheckListAPI = createAsyncThunk(
  'notifications/updateCheckListAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/tasks/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

export const deleteCheckListAPI = createAsyncThunk(
  'notifications/deleteCheckListAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/tasks/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

// ========================== MEMBER ==========================
export const joinCardAPI = createAsyncThunk(
  'notifications/joinCardAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/join/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

export const leaveCardAPI = createAsyncThunk(
  'notifications/leaveCardAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/leave/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

export const assignMemberToCardAPI = createAsyncThunk(
  'notifications/assignMemberToCardAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/assign-member/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

export const removeMemberFromCardAPI = createAsyncThunk(
  'notifications/removeMemberFromCardAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/remove-member/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

// ========================== ATTACHMENT ==========================

export const uploadAttachmentAPI = createAsyncThunk(
  'notifications/uploadAttachmentAPI',
  async ({ payload }) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/attachments`,
      payload
    )
    return response.data.metadata
  }
)

export const updateAttachmentAPI = createAsyncThunk(
  'notifications/updateAttachmentAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/attachments/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

export const deleteAttachmentAPI = createAsyncThunk(
  'notifications/deleteAttachmentAPI',
  async ({ _id, boardId }) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/attachments/${boardId}/${_id}`
    )
    return response.data.metadata
  }
)

// ========================== LABEL ==========================
export const updateCardLabelAPI = createAsyncThunk(
  'notifications/updateCardLabelAPI',
  async ({ _id, boardId, payload }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/cards/labels/${boardId}/${_id}`,
      payload
    )
    return response.data.metadata
  }
)

// ========================== SLICE ==========================

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    }

    // updateCurrentActiveCard: (state, action) => {
    //   const fullCard = action.payload
    //   state.currentActiveCard = fullCard
    // }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCardDetailAPI.fulfilled, (state, action) => {
      state.currentActiveCard = action.payload
    })

    builder.addCase(deleteCardAPI.fulfilled, (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    })

    builder.addCase(updateCardBasicAPI.fulfilled, (state, action) => {
      if (state?.currentActiveCard?.cardDetail) {
        const { card, log } = action.payload
        state.currentActiveCard.cardDetail = card
        if (log)
          state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
      }
    })

    builder.addCase(archiveCardAPI.fulfilled, (state, action) => {
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    builder.addCase(restoreCardAPI.fulfilled, (state, action) => {
      if (!state.currentActiveCard?.cardDetail) return
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })
    // ========================== COMMENT ==========================
    builder.addCase(addCardCommentAPI.fulfilled, (state, action) => {
      const { comment, log } = action.payload
      const currentList = state.currentActiveCard.comments
      state.currentActiveCard.comments = [comment, ...currentList]
      if (log)
        state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    builder.addCase(deleteCardCommentAPI.fulfilled, (state, action) => {
      const { comment, log } = action.payload
      const currentList = state.currentActiveCard.comments
      state.currentActiveCard.comments = currentList.filter(
        (c) => c._id !== comment._id
      )
      if (log)
        state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    // ========================== CHECKLIST ==========================
    builder.addCase(createCheckListAPI.fulfilled, (state, action) => {
      const { task: incoming, log } = action.payload

      if (!incoming) return

      if (incoming.parentTaskId) {
        const parentTask = state.currentActiveCard.checklists.find(
          (t) => t._id.toString() === incoming.parentTaskId.toString()
        )

        if (parentTask) {
          if (!parentTask.childTasks) parentTask.childTasks = []
          parentTask.childTasks.push(incoming)
        }
      } else {
        state.currentActiveCard.checklists.push(incoming)
      }

      if (log) {
        state.currentActiveCard.logs = [
          log,
          ...(state.currentActiveCard.logs || [])
        ]
      }
    })

    builder.addCase(updateCheckListAPI.fulfilled, (state, action) => {
      const updatedTask = action.payload.task

      if (!updatedTask.parentTaskId) {
        const checklist = state.currentActiveCard.checklists.find(
          (c) => c._id.toString() === updatedTask._id.toString()
        )

        if (checklist) {
          Object.assign(checklist, updatedTask)
        }
      } else {
        const parent = state.currentActiveCard.checklists.find(
          (c) => c._id.toString() === updatedTask.parentTaskId.toString()
        )

        if (parent) {
          const childTask = (parent.childTasks || []).find(
            (t) => t._id.toString() === updatedTask._id.toString()
          )

          if (childTask) {
            Object.assign(childTask, updatedTask)
          }
        }
      }
    })

    builder.addCase(deleteCheckListAPI.fulfilled, (state, action) => {
      if (!state.currentActiveCard) return

      const { task: deletingTask, log } = action.payload
      if (!deletingTask) return

      if (!deletingTask.parentTaskId) {
        state.currentActiveCard.checklists =
          state.currentActiveCard.checklists.filter(
            (c) => c._id.toString() !== deletingTask._id.toString()
          )
      } else {
        const parent = state.currentActiveCard.checklists.find(
          (c) => c._id.toString() === deletingTask.parentTaskId.toString()
        )

        if (parent) {
          parent.childTasks = (parent.childTasks || []).filter(
            (t) => t._id.toString() !== deletingTask._id.toString()
          )
        }
      }

      if (log) {
        state.currentActiveCard.logs = [
          log,
          ...(state.currentActiveCard.logs || [])
        ]
      }
    })

    // ========================== MEMBER ==========================
    builder.addCase(joinCardAPI.fulfilled, (state, action) => {
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    builder.addCase(leaveCardAPI.fulfilled, (state, action) => {
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    builder.addCase(assignMemberToCardAPI.fulfilled, (state, action) => {
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    builder.addCase(removeMemberFromCardAPI.fulfilled, (state, action) => {
      const { card, log } = action.payload
      state.currentActiveCard.cardDetail = card
      state.currentActiveCard.logs = [log, ...state.currentActiveCard.logs]
    })

    // ========================== ATTACHMENT ==========================
    builder.addCase(uploadAttachmentAPI.fulfilled, (state, action) => {
      if (!state.currentActiveCard) return

      const { attachments: incomingAttachments, log } = action.payload
      const currentAttachments = state.currentActiveCard.attachments || []

      state.currentActiveCard.attachments = [
        ...(incomingAttachments || []),
        ...currentAttachments
      ]

      if (log) {
        state.currentActiveCard.logs = [
          log,
          ...(state.currentActiveCard.logs || [])
        ]
      }
    })

    builder.addCase(updateAttachmentAPI.fulfilled, (state, action) => {
      const updatedAttachment = action.payload
      const currentAttachments = state.currentActiveCard.attachments
      state.currentActiveCard.attachments = currentAttachments.map((a) =>
        a._id === updatedAttachment._id ? updatedAttachment : a
      )
    })

    builder.addCase(deleteAttachmentAPI.fulfilled, (state, action) => {
      if (!state.currentActiveCard) return

      const { _id: idDeletedAttachment, log } = action.payload
      const currentAttachments = state.currentActiveCard.attachments || []

      state.currentActiveCard.attachments = currentAttachments.filter(
        (a) => a._id !== idDeletedAttachment
      )

      if (log) {
        state.currentActiveCard.logs = [
          log,
          ...(state.currentActiveCard.logs || [])
        ]
      }
    })

    // ========================== LABELS ==========================
    builder.addCase(updateCardLabelAPI.fulfilled, (state, action) => {
      state.currentActiveCard.cardDetail = action.payload
    })
  }
})

export const { clearAndHideCurrentActiveCard, showModalActiveCard } =
  activeCardSlice.actions

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
