import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, IMessagesResponse } from '../../models/chat/chat.model';

interface IinitialState {
  value: IMessagesResponse;
}

const initialState: IinitialState = {
  value: {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      totalItems: 0,
    },
  },
};

export const singleChatsSlice = createSlice({
  name: 'singleChats',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessagesResponse>) => {
      state.value.pageable = action.payload.pageable;
      // const setContent = [...action.payload.content, ...state.value.content];
      const setContent = state.value.content.concat(action.payload.content);
      state.value.content = [...new Set(setContent)];
    },
    getMessages: (state, action) => {},
    sendMessage: (state, action: PayloadAction<IMessage>) => {
      state.value.content.unshift(action.payload);
    },
    resetMessage: (state) => {
      state.value.content = [];
      state.value.pageable = {
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        totalItems: 0,
      };
    },
  },
});

export const { setMessages, sendMessage, resetMessage } = singleChatsSlice.actions;
export default singleChatsSlice.reducer;
