import { v4 } from 'uuid';
import { DrawPile } from './DrawPile';
import { Game } from './Game';
import { Lane } from './Lane';
import { Player } from './Player';
import { PlayerBoard } from './PlayerBoard';
import { PlayerHand } from './PlayerHand';

export type Id = string;

export function randomId(): Id {
  return v4();
}

let game!: Game;

function main() {

}


function getPlayerState(playerId: Id) {
  return game.getPlayerState(playerId);
}
