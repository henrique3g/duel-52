import { Controller, Post } from '@nestjs/common';
import { DrawPile } from 'src/core/DrawPile';
import { Game } from 'src/core/Game';
import { Lane } from 'src/core/Lane';
import { Player } from 'src/core/Player';
import { PlayerBoard } from 'src/core/PlayerBoard';
import { PlayerHand } from 'src/core/PlayerHand';

@Controller('game')
export class GameController {
  private game: Game;

  @Post()
  public newGame() {
    const drawPile = new DrawPile();
    const player1 = new Player();
    const player2 = new Player();

    const player1Board = new PlayerBoard(player1.id, [new Lane(), new Lane(), new Lane()]);
    const player2Board = new PlayerBoard(player2.id, [new Lane(), new Lane(), new Lane()]);
    const player1Hand = new PlayerHand(player1.id);
    const player2Hand = new PlayerHand(player2.id);

    this.game = new Game(drawPile, player1, player2, player1Hand, player2Hand, player1Board, player2Board);
    this.game.startGame();

    return this.game.getPlayerState(player1.id);
  }
}

