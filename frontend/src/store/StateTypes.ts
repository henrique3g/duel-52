
export type HiddenCard = {
  id: string;
  damageReceived: number;
};

export type Card = {
  id: string;
  cardType: CardType;
  damageReceived: number;
  isFlipped: boolean;
  isBaseCard: boolean;
  shouldBeLookedBy4Power: boolean;
  wasRempowered: boolean;
  alreadyAttacked: boolean;
};

export type GameState = {
  I: {
    playerId: string,
    hand: Card[],
    board: [
      {
        baseCard: Card | HiddenCard | null,
        cards: Card[],
      },
      {
        baseCard: Card | HiddenCard | null,
        cards: Card[],
      },
      {
        baseCard: Card | HiddenCard | null,
        cards: Card[],
      },
    ],
  };
  opponent: {
    hand: number,
    board: [
      {
        baseCard: Card | HiddenCard | null,
        cards: Array<Card | HiddenCard>,
      },
      {
        baseCard: Card | HiddenCard | null,
        cards: Array<Card | HiddenCard>,
      },
      {
        baseCard: Card | HiddenCard | null,
        cards: Array<Card | HiddenCard>,
      },
    ],
  },
  turnInfo: {
    isMyTurn: boolean,
    remainingActions: number,
    currentState: TurnStatus,
  },
  gameInfo: {
    discardPile: number,
    drawPile: number,
  },
};

export enum TurnStatus {
  WAITING_CHOOSE_DISCAR_CARD,
  WAITING_NEXT_ACTION,
  WAITING_CHOOSE_CARD_TO_SEE,
  WAITING_CHOOSE_FLIP_ORDER,
  WAITING_CHOOSE_CARD_TO_MOVE,
  WAITING_CHOOSE_REACTIVATION_ORDER,
}

export enum CardType {
  A = 'a',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  J = 'j',
  Q = 'q',
  K = 'k'
}


export enum Actions {
  SET_CARD,
  FLIP_CARD,
  NONE,
  ATTACK
}

