import { Body, Controller, Post } from '@nestjs/common';
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

  @Post('end-turn')
  public endTurn(@Body('playerId') playerId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.endTurn();
    return this.game.getPlayerState(playerId);
  }

  @Post('set-card')
  public setCard(@Body('playerId') playerId: string, @Body('cardId') cardId: string, @Body('laneIndex') laneIndex: number) {
    this.game.validatePlayerTurn(playerId);
    this.game.setCard(playerId, cardId, laneIndex);
    return this.game.getPlayerState(playerId);
  }

  @Post('flip-card')
  public flipCard(@Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.flipCard(playerId, cardId);
    return this.game.getPlayerState(playerId);
  }

  @Post('attack')
  public attack(@Body('playerId') playerId: string, @Body('attackerId') attackerId: string, @Body('attackedId') attackedId: string, @Body('secondAttackedId') secondAttackedId?: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.attackCard(playerId, attackerId, attackedId, secondAttackedId);
    return this.game.getPlayerState(playerId);
  }

  @Post('choose-discard-card')
  public chooseDiscardCard(@Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.discardCard(playerId, cardId);
    return this.game.getPlayerState(playerId);
  }

  @Post('choose-card-to-see')
  public chooseCardToSee(@Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.seeFaceDownCard(playerId, cardId);
    return this.game.getPlayerState(playerId);
  }

  @Post('choose-card-to-move')
  public chooseCardToMove(@Body('playerId') playerId: string, @Body('fromLaneIndex') fromLaneIndex: number, @Body('toLaneIndex') toLaneIndex: number, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.moveCard(playerId, fromLaneIndex, cardId, toLaneIndex);
    return this.game.getPlayerState(playerId);
  }

  @Post('choose-card-to-flip')
  public chooseCardToFlip(@Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.flipCardAction(playerId, cardId);
    return this.game.getPlayerState(playerId);
  }

  @Post('choose-card-to-reactivate')
  public chooseCardToReactivate(@Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    this.game.validatePlayerTurn(playerId);
    this.game.reactivateCard(playerId, cardId);
    return this.game.getPlayerState(playerId);
  }

}

