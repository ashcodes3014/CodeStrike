import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [
      {
        role: "model",
        parts: [{ text: "Hi! I'm your AI assistant. How can I help you with this DSA problem?" }],
      },
    ],
    isTyping: false,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        role: "user",
        parts: [{ text: action.payload }],
      });
    },
    addModelMessage: (state, action) => {
      state.messages.push({
        role: "model",
        parts: [{ text: action.payload }],
      });
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearChat: (state) => {
      state.messages = [
        {
          role: "model",
          parts: [{ text: "Hi! I'm your AI assistant. How can I help you with this DSA problem?" }],
        },
      ];
    },
  },
});

export const { addUserMessage, addModelMessage, setTyping, clearChat } = chatSlice.actions;

export default chatSlice.reducer;