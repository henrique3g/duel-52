import axios from 'axios'
import { store } from '../store'

const api = axios.create({
  baseURL: 'http://localhost:4000',
});


export function endTurn() {
  return api.post('/game/end-turn', { playerId: store.getState().game.gameState.I.playerId });
}

export function newGame() {
  return api.post('/game');
}

export function setCard(cardId: string, laneIndex: number) {
  return api.post('/game/set-card', { playerId: store.getState().game.gameState.I.playerId, cardId, laneIndex });
}

export function flipCard(cardId: string | null) {
  return api.post('/game/flip-card', { playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function attack(attackerId: string | null, attackedId: string | null, secondAttackedId?: string) {
  return api.post('/game/attack', { playerId: store.getState().game.gameState.I.playerId, attackerId, attackedId, secondAttackedId });
}

export function discardCard(cardId: string | null) {
  return api.post('/game/choose-discard-card', { playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function seeCard(cardId: string | null) {
  return api.post('/game/choose-card-to-see', { playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function selectCardToFlip(cardId: string | null) {
  return api.post('/game/choose-card-to-flip', { playerId: store.getState().game.gameState.I.playerId, cardId });
}

export function selectCardToReactivate(cardId: string | null) {
  return api.post('/game/choose-card-to-reactivate', { playerId: store.getState().game.gameState.I.playerId, cardId });
}

