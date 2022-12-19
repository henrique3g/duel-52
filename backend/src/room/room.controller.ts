import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UnprocessableEntityException } from '@nestjs/common';
import { DrawPile } from 'src/core/DrawPile';
import { Game } from 'src/core/Game';
import { Lane } from 'src/core/Lane';
import { Player } from 'src/core/Player';
import { PlayerBoard } from 'src/core/PlayerBoard';
import { PlayerHand } from 'src/core/PlayerHand';
import { GameGateway } from 'src/game/game.gateway';
import { v4 } from 'uuid';
import { RoomService } from './room.service';

type Room = {
  players: Player[],
};

@Controller('room')
export class RoomController {
  rooms: Record<string, Room> = {};

  constructor(
    private roomService: RoomService,
    private gameGateway: GameGateway
  ) { }

  @Post()
  public newRoom() {
    const roomId = v4();
    this.rooms[roomId] = {
      players: [],
    };
    return roomId;
  }

  @Get(':roomId')
  public getRoom(@Param('roomId') roomId: string) {
    // return this.rooms[roomId];
  }

  @Post('player')
  public setPlayerReady(@Body('roomId') roomId: string, @Body('nickname') playerNick: string) {
    const room = this.rooms[roomId];
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const { players } = room;
    if (players.length >= 2) {
      throw new UnprocessableEntityException('Players already setted');
    }
    const playerWithSameNick = players.find(player => player.nickname === playerNick);
    if (playerWithSameNick) {
      throw new BadRequestException("Cann't use the same nicke that the opponent");
    }
    const player = new Player(playerNick);
    players.push(player);
    if (players.length === 2) {
      this.createAndStartGame(players, roomId);
    }
    return player.id;
  }

  private createAndStartGame(players: Player[], roomId: string) {
    const drawPile = new DrawPile();

    const player1 = players[0];
    const player2 = players[1];
    const player1Board = new PlayerBoard(player1.id, [new Lane(0), new Lane(1), new Lane(2)]);
    const player2Board = new PlayerBoard(player2.id, [new Lane(0), new Lane(1), new Lane(2)]);
    const player1Hand = new PlayerHand(player1.id);
    const player2Hand = new PlayerHand(player2.id);

    this.roomService.games[roomId] = new Game(drawPile, player1, player2, player1Hand, player2Hand, player1Board, player2Board);
    this.roomService.games[roomId].startGame();
    this.gameGateway.server.emit('game-start');
  }
}

