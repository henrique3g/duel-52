import { Id, randomId } from './MainState';

export class Player {
  constructor(public nickname: string, public id: Id = randomId()) { }
}

