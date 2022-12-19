import {Injectable} from '@nestjs/common';
import { Game } from 'src/core/Game';

@Injectable()
export class RoomService {
  public games: Record<string, Game> = {};
}
