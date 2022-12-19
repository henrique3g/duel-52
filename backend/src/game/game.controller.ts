import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {
  constructor(private gameGateway: GameGateway, private roomService: RoomService) { }

  private get games() {
    return this.roomService.games;
  }

  @Post('end-turn')
  public endTurn(@Body('roomId') roomId: string, @Body('playerId') playerId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.endTurn();
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('set-card')
  public setCard(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string, @Body('laneIndex') laneIndex: number) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.setCard(playerId, cardId, laneIndex);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('flip-card')
  public flipCard(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.flipCard(playerId, cardId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('attack')
  public attack(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('attackerId') attackerId: string, @Body('attackedId') attackedId: string, @Body('secondAttackedId') secondAttackedId?: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.attackCard(playerId, attackerId, attackedId, secondAttackedId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('choose-discard-card')
  public chooseDiscardCard(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.discardCard(playerId, cardId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('choose-card-to-see')
  public chooseCardToSee(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.seeFaceDownCard(playerId, cardId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('choose-card-to-move')
  public chooseCardToMove(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('fromLaneIndex') fromLaneIndex: number, @Body('toLaneIndex') toLaneIndex: number, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.moveCard(playerId, fromLaneIndex, cardId, toLaneIndex);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('choose-card-to-flip')
  public chooseCardToFlip(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.flipCardAction(playerId, cardId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('choose-card-to-reactivate')
  public chooseCardToReactivate(@Body('roomId') roomId: string, @Body('playerId') playerId: string, @Body('cardId') cardId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    game.validatePlayerTurn(playerId);
    game.reactivateCard(playerId, cardId);
    this.gameGateway.server.emit('state-updated');
    return game.getPlayerState(playerId);
  }

  @Post('get-game-state')
  public getGameState(@Body('roomId') roomId: string, @Body('playerId') playerId: string) {
    const game = this.games[roomId];
    if (!game) {
      throw new NotFoundException('Room not found');
    }
    return game.getPlayerState(playerId);
  }

}

