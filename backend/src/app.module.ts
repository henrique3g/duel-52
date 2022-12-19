import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';

@Module({
  imports: [],
  controllers: [AppController, GameController, RoomController],
  providers: [AppService, GameGateway, RoomService],
})
export class AppModule { }

