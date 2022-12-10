import { createSlice } from "@reduxjs/toolkit";
import { Card } from "../Hand";
import Two from '../svg/2.svg';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    playerBoard: [
      [],
      [],
      [],
    ],
    playerHand: [{ flipped: true, image: Two }, {flipped: false, image: Two }] as Card[],
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
  },
});

const { actions, reducer } = gameSlice;

export const { changePlayer } = actions;
export default reducer;
