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

