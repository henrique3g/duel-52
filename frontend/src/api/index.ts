import axios from 'axios'
import { store } from '../store'

const api = axios.create({
  baseURL: 'http://localhost:4000',
});


export function endTurn(roomId: string | undefined) {
  return api.post('/game/end-turn', { roomId, playerId: store.getState().game.gameState.I.playerId });
}

export function newGame() {
  return api.post('/game');
}
export function setCard(roomId: string | undefined, cardId: string, laneIndex: number) {
  return api.post('/game/set-card', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId, laneIndex });
}

export function flipCard(roomId: string | undefined, cardId: string | null) {
  return api.post('/game/flip-card', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function attack(roomId: string | undefined, attackerId: string | null, attackedId: string | null, secondAttackedId?: string) {
  return api.post('/game/attack', { roomId, playerId: store.getState().game.gameState.I.playerId, attackerId, attackedId, secondAttackedId });
}

export function discardCard(roomId: string | undefined, cardId: string | null) {
  return api.post('/game/choose-discard-card', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function seeCard(roomId: string | undefined, cardId: string | null) {
  return api.post('/game/choose-card-to-see', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function selectCardToFlip(roomId: string | undefined, cardId: string | null) {
  return api.post('/game/choose-card-to-flip', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function selectCardToReactivate(roomId: string | undefined, cardId: string | null) {
  return api.post('/game/choose-card-to-reactivate', { roomId, playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function newRoom(): Promise<string> {
  return api.post('/room').then(response => response.data);
}

export function setReady(roomId: string | undefined, nickname: string) {
  return api.post('/room/player', { roomId, nickname }).then(response => response.data);
}

export function getGameState(roomId: string | undefined, playerId: string) {
  return api.post('/game/get-game-state', { roomId, playerId }).then(response => response.data);
}

