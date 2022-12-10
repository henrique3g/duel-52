import { createSlice } from "@reduxjs/toolkit";
import { GameState } from "./StateTypes";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameState: {
      
    } as GameState,
    playerBoard: [
      [],
      [],
      [],
    ],
    opponentHandSize: 3,
    round: {
      currentPlayer: 1,
      remainingActions: 3,
    },
  },
  reducers: {
    changePlayer(state) {
      if (state.round.currentPlayer === 1) {
        state.round.currentPlayer = 2;
        return;
      }
      state.round.currentPlayer = 1;
    },
    updateState(state, action) {
      state.gameState = action.payload; 
    },
  },
});

const { actions, reducer } = gameSlice;

export const GameActions = actions;
export default reducer;
