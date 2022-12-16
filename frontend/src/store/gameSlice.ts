import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Actions, GameState, TurnStatus } from "./StateTypes";
import { RootState } from "./store";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameState: {

    } as GameState,
    selectedCard: null as string | null,
    currentAction: Actions.NONE,
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
    clearSelected(state) {
      state.selectedCard = null;
      state.currentAction = Actions.NONE;
    },
    selectHandCard(state, { payload }) {
      if (state.selectedCard === payload.id) {
        state.selectedCard = null;
        state.currentAction = Actions.NONE;
      } else {
        state.selectedCard = payload.id;
        state.currentAction = Actions.SET_CARD;
      }
    },
    selectBoardCard(state, { payload }) {
      if (state.selectedCard === payload.id) {
        state.selectedCard = null;
        state.currentAction = Actions.NONE;
      } else {
        state.selectedCard = payload.id;
        if (payload.isFlipped) {
          state.currentAction = Actions.ATTACK;
        } else {
          state.currentAction = Actions.FLIP_CARD;
        }
      }
    },
  },
});

const { actions, reducer } = gameSlice;

export const canClickHandCardSelector = createSelector(
  (state: RootState) => state.game,
  (game) => {
    const { currentState, remainingActions } = game.gameState.turnInfo;
    if (currentState === TurnStatus.WAITING_CHOOSE_DISCAR_CARD) {
      return true;
    }
    
    return currentState === TurnStatus.WAITING_NEXT_ACTION && remainingActions > 0;
  },
);

export const canClickBoardCardSelector = createSelector(
  (state: RootState) => state.game,
  (game) => {
    const currentState = game.gameState.turnInfo.currentState;
    if (currentState === TurnStatus.WAITING_NEXT_ACTION) {
      return game.gameState.turnInfo.remainingActions > 0;
    }
    const isPermitedState = [
      TurnStatus.WAITING_CHOOSE_FLIP_ORDER,
      TurnStatus.WAITING_CHOOSE_CARD_TO_SEE,
      TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE,
      TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER,
    ].includes(currentState);
    return isPermitedState;
  },
);

export const GameActions = actions;
export default reducer;

