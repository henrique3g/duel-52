import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Actions, Card, CardType, GameState, HiddenCard, TurnStatus } from "./StateTypes";
import { RootState } from "./store";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameState: {

    } as GameState,
    selectedCard: null as Card | null,
    attackedCard: null as Card | HiddenCard | null,
    secondAttacked: undefined as Card | HiddenCard | undefined,
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
      state.attackedCard = null;
      delete state.secondAttacked;
    },
    selectHandCard(state, { payload }) {
      if (state.selectedCard === payload) {
        state.selectedCard = null;
        state.currentAction = Actions.NONE;
      } else {
        state.selectedCard = payload;
        state.currentAction = Actions.SET_CARD;
      }
    },
    selectBoardCard(state, { payload }) {
      if (state.selectedCard === payload) {
        state.selectedCard = null;
        state.currentAction = Actions.NONE;
      } else {
        state.selectedCard = payload;
        if (payload.isFlipped) {
          state.currentAction = Actions.ATTACK;
        } else {
          state.currentAction = Actions.FLIP_CARD;
        }
      }
    },
    addAttacked(state, { payload }: { payload: Card | HiddenCard }) {
      const isNine = (card: Card | HiddenCard | null) => card !== null && (card as Card).cardType === CardType.Nine;
      if (payload.id === state.attackedCard?.id) {
        state.attackedCard = null;
        return;
      }
      if (payload.id === state.secondAttacked?.id) {
        delete state.secondAttacked;
        return;
      }
      if (isNine(state.attackedCard)) {
        state.attackedCard = payload;
        delete state.secondAttacked;
        return;
      }
      if (!isNine(state.attackedCard) && isNine(payload)) {
        state.attackedCard = payload;
        return;
      }
      if (state.selectedCard?.cardType === CardType.Ten && !isNine(payload) && state.attackedCard !== null) {
        state.secondAttacked = payload;
        return;
      }
      state.attackedCard = payload;
    },
  },
});

const { actions, reducer } = gameSlice;

export const canClickHandCardSelector = createSelector(
  (state: RootState) => state.game,
  (game) => {
    if (!game.gameState.turnInfo.isMyTurn) return false;
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
    if (!game.gameState.turnInfo.isMyTurn) return false;
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

