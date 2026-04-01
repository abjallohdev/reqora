import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ServiceRequest } from '@/lib/types'
interface RequestsState {
  items: ServiceRequest[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: RequestsState = {
  items: [],
  status: 'idle',
  error: null,
}

// Thunks
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async () => {
    const response = await fetch('/api/requests')
    if (!response.ok) {
      throw new Error('Failed to fetch requests')
    }
    return (await response.json()) as ServiceRequest[]
  },
)

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (newRequest: Partial<ServiceRequest>) => {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRequest),
    })
    if (!response.ok) {
      throw new Error('Failed to create request')
    }
    return (await response.json()) as ServiceRequest
  },
)

export const updateRequest = createAsyncThunk(
  'requests/updateRequest',
  async ({ id, ...updates }: Partial<ServiceRequest> & { id: string }) => {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      throw new Error('Failed to update request')
    }
    return (await response.json()) as ServiceRequest
  },
)

export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (id: string) => {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete request')
    }
    return id
  },
)

export const addCommentRequest = createAsyncThunk(
  'requests/addComment',
  async ({
    id,
    body,
    isInternal,
  }: {
    id: string
    body: string
    isInternal: boolean
  }) => {
    const response = await fetch(`/api/requests/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, isInternal }),
    })
    if (!response.ok) throw new Error('Failed to add comment')
    return { requestId: id, comment: await response.json() }
  },
)

export const deleteCommentRequest = createAsyncThunk(
  'requests/deleteComment',
  async ({
    requestId,
    commentId,
  }: {
    requestId: string
    commentId: string
  }) => {
    const response = await fetch(
      `/api/requests/${requestId}/comments/${commentId}`,
      {
        method: 'DELETE',
      },
    )
    if (!response.ok) throw new Error('Failed to delete comment')
    return { requestId, commentId }
  },
)

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(
        fetchRequests.fulfilled,
        (state, action: PayloadAction<ServiceRequest[]>) => {
          state.status = 'succeeded'
          state.items = action.payload
        },
      )
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch'
      })
      // Create
      .addCase(
        createRequest.fulfilled,
        (state, action: PayloadAction<ServiceRequest>) => {
          state.items.push(action.payload)
        },
      )
      // Update
      .addCase(
        updateRequest.fulfilled,
        (state, action: PayloadAction<ServiceRequest>) => {
          const index = state.items.findIndex(
            (req) => req.id === action.payload.id,
          )
          if (index !== -1) {
            state.items[index] = action.payload
          }
        },
      )
      // Delete
      .addCase(
        deleteRequest.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((req) => req.id !== action.payload)
        },
      )
      // Add Comment
      .addCase(addCommentRequest.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (req) => req.id === action.payload.requestId,
        )
        if (index !== -1) {
          if (!state.items[index].comments) state.items[index].comments = []
          state.items[index].comments!.push(action.payload.comment)
        }
      })
      // Delete Comment
      .addCase(deleteCommentRequest.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (req) => req.id === action.payload.requestId,
        )
        if (index !== -1 && state.items[index].comments) {
          state.items[index].comments = state.items[index].comments!.filter(
            (c) => c.id !== action.payload.commentId,
          )
        }
      })
  },
})

export default requestsSlice.reducer
