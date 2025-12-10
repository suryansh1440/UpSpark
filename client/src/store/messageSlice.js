import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  conversations: [
    { id: 'c1', name: 'Investor ABC', lastMessage: 'Can you share revenue numbers?', time: '2h' },
    { id: 'c2', name: 'Mentor Priya', lastMessage: 'Let us lock a slot.', time: '5h' },
    { id: 'c3', name: 'Dev Akash', lastMessage: 'Sent the PR for review.', time: '1d' },
  ],
  messages: {
    c1: [
      { id: 'm1', from: 'Investor ABC', text: 'Can you share revenue numbers?' },
      { id: 'm2', from: 'You', text: 'Yes, attaching the deck now.' },
      { id: 'm3', from: 'Investor ABC', text: 'Great, let us schedule Friday.' },
    ],
  },
  activeConversationId: 'c1',
}

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload
    },
    sendMessage(state, action) {
      const { conversationId, text } = action.payload
      const message = { id: nanoid(), from: 'You', text }
      if (!state.messages[conversationId]) state.messages[conversationId] = []
      state.messages[conversationId].push(message)
      const convo = state.conversations.find((c) => c.id === conversationId)
      if (convo) {
        convo.lastMessage = text
        convo.time = 'now'
      }
    },
  },
})

export const { setActiveConversation, sendMessage } = messageSlice.actions
export default messageSlice.reducer

