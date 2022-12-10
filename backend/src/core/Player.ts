import { Id, randomId } from './MainState';

export class Player {
  constructor(public id: Id = randomId()) { }
}

