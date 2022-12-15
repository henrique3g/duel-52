import { v4 } from 'uuid';

export type Id = string;

export function randomId(): Id {
  return v4();
}

