
import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    opponentNick: null as null | string,
  },
  reducers: {
    setOpponentReady(state, { payload }) {
      state.opponentNick = payload;
    },
  },
});

const { actions, reducer } = roomSlice;

export const roomActions = actions;
export const roomReducer = reducer;

