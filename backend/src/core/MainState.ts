type Id = string;

function randomId(): Id {
  return `${Math.random() * 10}`;
}

enum CardType {
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
  K = 'k',
}


class Card {
  public isFlipped = false;
  public damageReceived = 0;
  public isBaseCard = false;
  public id = randomId();
  public shouldBeLookedBy4Power = false;
  public wasRempowered = false;
  public alreadyAttacked = false;

  constructor(public cardType: CardType) { }

  flip() {
    this.isFlipped = true;
  }

  attack(attackedCard: Card) {
    if (!this.isFlipped) {
      throw new Error("A card face down can't attack");
    }

    if (this.cardType === CardType.Nine && attackedCard.cardType === CardType.J) {
      attackedCard.doDamage(2);
      return;
    }
    if (attackedCard.cardType === CardType.Eight && this.cardType !== CardType.Nine) {
      this.doDamage(1);
      attackedCard.doDamage(1);
      return;
    }
    attackedCard.doDamage(1);
  }

  protected doDamage(damage: number) {
    this.damageReceived += damage;
  }

  isDied() {
    if (this.cardType === CardType.J && this.isFlipped && this.damageReceived >= 3) {
      return true;
    }

    if (this.damageReceived >= 2) {
      return true;
    }

    return false;
  }
}

class PlayerHand {
  private cards: Card[];

  constructor(public playerId: Id) {
    this.cards = [];
  }

  addCard(...cards: Card[]) {
    this.cards.push(...cards);
  }

  getCards() {
    return this.cards;
  }

  handSize() {
    return this.cards.length;
  }

  getCardById(cardId: Id) {
    return this.cards.find(card => card.id === cardId);
  }

  discardCard(cardId: Id) {
    const cardIndex = this.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error("Can't remove a card that don't exist");
    }
    const [ card ] = this.cards.splice(cardIndex, 1);
    return card!;
  }
}

class Lane {
  baseCard: Card | null = null;
  cards: Card[] = [];
  id = randomId();
  isWon = false;
  isFreezed = false;
  
  addCard(card: Card) {
    this.cards.push(card); 
  }

  setBaseCard(card: Card) {
    this.baseCard = card;
    card.isBaseCard = true;
  }

  getCardById(cardId: Id) {
    return this.cards.find(card => card.id === cardId);
  }

  removeCard(cardId: Id) {
    const cardIndex = this.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error("Card not exists");
    }
    const [ removedCard ] = this.cards.splice(cardIndex, 1); 
    return removedCard;
  }
}

class PlayerBoard {
  id = randomId();

  constructor(public playerId: Id, private lanes: [Lane, Lane, Lane]) {
  }

  addBaseCard(laneNumber: number, card: Card) {
    this.lanes[laneNumber].setBaseCard(card);
  }

  firstLane() {
    return this.lanes[0];
  }

  secondLane() {
    return this.lanes[1];
  }

  thirdLane() {
    return this.lanes[2];
  }

  getLane(laneId: Id) {
    const possibleLane = this.lanes.find(lane => lane.id === laneId);
    if (!possibleLane) {
      throw new Error();
    }
    return possibleLane;
  }

  moveCard(cardId: string, fromLaneId: string, toLaneId: string) {
    const fromLane = this.getLane(fromLaneId);
    const toLane = this.getLane(toLaneId);
    const card = fromLane.removeCard(cardId);
    toLane.addCard(card);
  }

  resetAttackFlag() {
    this.lanes.forEach(
      lane => lane.cards.forEach(
        card => card.alreadyAttacked = false,
      ),
    );
  }
  transformBaseCardIntoNormalCard() {
    this.lanes.forEach(lane => {
      if (lane.baseCard) {
        lane.baseCard.isBaseCard = false;
        lane.cards.unshift(lane.baseCard);
      }
      lane.baseCard = null;
    });
  }
}


class DrawPile {
  cards: Card[];

  constructor() {
    this.cards = allCards();
  }

  shuffle(): void {
    const cards = this.cards;
    let currentIndex = cards.length;
    let randomIndex: number;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
    }

  }

  draw() {
    if (this.isEmpty()) {
      return;
    } 

    const lastCard = this.cards.pop();
    return lastCard;
  }

  isEmpty(): boolean {
    return this.cards.length === 0; 
  }
}

class Player {
  constructor(public id: Id = randomId()) { }
}

type PlayerState = {

  I: {
    hand: Card[],
    board: [
      {
        baseCard: Card | Id | null,
        cards: Card[],
      },
      {
        baseCard: Card | Id | null,
        cards: Card[],
      },
      {
        baseCard: Card | Id | null,
        cards: Card[],
      },
    ],
  };
  opponent: {
    hand: number,
    board: [
      {
        baseCard: Card | Id | null,
        cards: Array<Card | Id | null>,
      },
      {
        baseCard: Card | Id | null,
        cards: Array<Card | Id | null>,
      },
      {
        baseCard: Card | Id | null,
        cards: Array<Card | Id | null>,
      },
    ],
  },
  turnInfo: {
    isMyTurn: boolean,
    remainingActions: number,
    currentState: TurnStatus,
  },
};

class Game {
  private discardPile: Card[] = [];
  private currentPlayer = this.player1.id;
  private remainingActions = 3;
  public boards: Record<Id, PlayerBoard> = {};
  public hands: Record<Id, PlayerHand> = {};
  public currentStatus = TurnStatus.WAITING_NEXT_ACTION;
  public turnCounter = 1;

  private futureActions: Record<number, Array<() => void>> = {};
  private cardToSecondAttack: null | Id = null;

  constructor(
    private drawPile: DrawPile,
    private player1: Player,
    private player2: Player,
    private player1Hand: PlayerHand,
    private player2Hand: PlayerHand,
    private player1Board: PlayerBoard,
    private player2Board: PlayerBoard,
  ) { 
    this.boards[player1.id] = player1Board;
    this.boards[player2.id] = player2Board;
    this.hands[player1.id] = player1Hand;
    this.hands[player2.id] = player2Hand;
  }

  public startGame() {
    this.drawPile.shuffle();
    const draw = this.drawPile.draw as () => Card;

    this.doNTimes(3, (i) => this.player1Board.addBaseCard(i, draw()));
    this.doNTimes(3, (i) => this.player2Board.addBaseCard(i, draw()));

    this.doNTimes(5, () => this.player1Hand.addCard(draw()));
    this.doNTimes(5, () => this.player2Hand.addCard(draw()));
   

    this.doNTimes(16, () => this.discardPile.push(draw()));
  }
  
  private validatePlayerTurn(playerId: Id) {
    if (playerId !== this.currentPlayer) {
      throw new Error("Player can't play at opponent turn");
    }
    if (this.remainingActions === 0) {
      throw new Error("Player can't play");
    }
  }

  public endTurn(playerId: Id) {
    this.validatePlayerTurn(playerId);

    if (this.currentPlayer === this.player1.id) {
      this.currentPlayer = this.player2.id;
    } else {
      this.currentPlayer = this.player1.id;
    }

    const board = this.boards[playerId];
    board.resetAttackFlag();
    this.remainingActions = 3;
    this.turnCounter += 1;
    this.runFutureAction();
    this.drawCard();
  }

  public setCard(playerId: Id, cardId: Id, laneId: Id) {
    this.validatePlayerTurn(playerId);

    const board = this.boards[playerId];
    const hand = this.hands[playerId];
    const lane = board.getLane(laneId);
    if (lane.isWon) {
      return;
    }
    const possibleCard = hand.getCardById(cardId);
    if (!possibleCard) {
      throw new Error("Card not found");
    }
    lane.addCard(possibleCard);
  }

  public flipCard(playerId: Id, cardId: Id, laneId: Id) {
    this.validatePlayerTurn(playerId);

    const board = this.boards[playerId];
    const lane = board.getLane(laneId);
    if (lane.isWon) {
      return;
    }
    const possibleCard = lane.getCardById(cardId);
    if (!possibleCard) {
      throw new Error();
    }
    const card = possibleCard;
    if (lane.isFreezed && card.cardType !== CardType.Nine) {
      return;
    }
    card.flip();
    this.remainingActions -= 1;
    this.activateCardPower(card, lane);
  }

  private activateCardPower(card: Card, lane: Lane) {
    if (card.cardType === CardType.A ) {
      this.remainingActions += 1;
      return;
    }
    if (card.cardType === CardType.Two && !this.drawPile.isEmpty()) {
      this.drawCard();
      this.currentStatus = TurnStatus.WAITING_CHOOSE_DISCAR_CARD;
      return;
    }

    if (card.cardType === CardType.Four) {
      this.currentStatus = TurnStatus.WAITING_CHOOSE_CARD_TO_SEE;
      return;
    }

    if (card.cardType === CardType.Five) {
      this.currentStatus = TurnStatus.WAITING_CHOOSE_FLIP_ORDER;
      return;
    }

    if (card.cardType === CardType.Six) {
      lane.isFreezed = true; 
      this.addFutureAction(this.turnCounter + 2, () => {
        lane.isFreezed = false;
      });
      return;
    }

    if (card.cardType === CardType.Seven) {
      lane.cards.forEach(card => card.damageReceived = 0);
      return;
    }

    if (card.cardType === CardType.Q) {
      this.currentStatus = TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE;
      return;
    }

    if (card.cardType === CardType.K) {
      this.currentStatus = TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER;
      return;
    }
  }

  public attackCard(playerId: Id, laneId: Id, attackerId: Id, attackedId: Id) {
    this.validatePlayerTurn(playerId);

    const opponentId = Object.keys(this.boards).find(id => playerId !== id)!;
    const attackerBoard = this.boards[playerId]; 
    const attackerLane = attackerBoard.getLane(laneId);
    const attackerCard = attackerLane.getCardById(attackerId);

    if (!attackerCard) {
      throw new Error("Attacker card not found");
    }
    if (attackerLane.isFreezed && attackerCard.cardType !== CardType.Nine) {
      return;
    }

    const attackedBoard = this.boards[opponentId];
    const attackedLane = attackedBoard.getLane(laneId);
    const attackedCard = attackedLane.getCardById(attackedId);

    if (!attackedCard) {
      throw new Error("Attacked card not found");
    }

    attackerCard.attack(attackedCard);
    if (attackerCard.cardType === CardType.Ten && attackedCard.cardType !== CardType.Nine) {
      this.currentStatus = TurnStatus.WAITING_SECOND_CARD_TO_ATTACK;
      this.cardToSecondAttack = attackerCard.id;
    }
    if (attackedCard.isDied()) {
      if (attackedCard.cardType === CardType.Three && !attackedCard.isFlipped) {
        attackedCard.damageReceived = 0;
        attackedCard.isFlipped = true;
      } else {
        const diedCard = attackedLane.removeCard(attackedId);
        this.discardPile.push(diedCard);
        if (this.drawPile.isEmpty() && attackedLane.cards.length === 0) {
          attackerLane.isWon = true;
        }
      }
    }
    if (attackerCard.isDied()) {
      const diedCard = attackerLane.removeCard(attackerId);
      this.discardPile.push(diedCard);
      if (this.drawPile.isEmpty() && attackerLane.cards.length === 0) {
        attackedLane.isWon = true;
      }
    }
    this.remainingActions -= 1;

  }

  public doSecondAttackOf10(playerId: Id, laneId: Id, attackerId: Id, attackedId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.cardToSecondAttack !== attackerId) {
      throw new Error("Some error occurred");
    }

    const opponentId = Object.keys(this.boards).find(id => playerId !== id)!;
    const attackerBoard = this.boards[playerId]; 
    const attackerLane = attackerBoard.getLane(laneId);
    const attackerCard = attackerLane.getCardById(attackerId);

    if (!attackerCard) {
      throw new Error("Attacker card not found");
    }

    const attackedBoard = this.boards[opponentId];
    const attackedLane = attackedBoard.getLane(laneId);
    const attackedCard = attackedLane.getCardById(attackedId);

    if (!attackedCard) {
      throw new Error("Attacked card not found");
    }
    if (attackedCard.cardType === CardType.Nine) {
      return;
    }

    attackerCard.attack(attackedCard);
    this.cardToSecondAttack = null;
  }

  private drawCard() {
    const card = this.drawPile.draw()!;  
    if (card) {
      const hand = this.hands[this.currentPlayer];
      hand.addCard(card);
    } else {
      const board = this.boards[this.currentPlayer];
      board.transformBaseCardIntoNormalCard();
    }
  }

  public discardCard(playerId: Id, cardId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_DISCAR_CARD) {
      throw new Error("Only can discard a card when flip a 2 card");
    }

    const hand = this.hands[playerId];
    const discardedCard = hand.discardCard(cardId);
    this.discardPile.push(discardedCard);
  }

  public seeFaceDownCard(playerId: Id, cardId: Id, laneId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_CARD_TO_SEE) {
      throw new Error("Can't see a card face down");
    }

    const board = Object.values(this.boards).find(board => board.getLane(laneId));
    const lane = board?.getLane(laneId);
    if (!lane) {
      throw new Error("Lane not exist");
    }
    const card = lane.getCardById(cardId);
    if (!card) {
      throw new Error("Card don't exist");
    }
    card.shouldBeLookedBy4Power = true;
    setTimeout(() => {
      card.shouldBeLookedBy4Power = false;
    }, 5000);
  }

  public flipCardAction(playerId: Id, cardId: Id, laneId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_FLIP_ORDER) {
      throw new Error("Action not permited");
    }

    const board = this.boards[playerId];
    const lane = board.getLane(laneId);
    const cardToFlip = lane.getCardById(cardId);
    if (!cardToFlip) {
      throw new Error("Card not found");
    }
    cardToFlip.flip();
    this.activateCardPower(cardToFlip, lane);
    const cards = lane.cards;
    const cardsNotFlipped = cards.filter(card => card.isFlipped);
    if (cardsNotFlipped.length === 0) {
      this.currentStatus = TurnStatus.WAITING_NEXT_ACTION;
    }
  }

  public reactivateCard(playerId: Id, cardId: Id, laneId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER) {
      throw new Error("Action not permited");
    }

    const board = this.boards[playerId];
    const lane = board.getLane(laneId);
    const cardToEmpower = lane.getCardById(cardId);
    if (!cardToEmpower) {
      throw new Error("Card not found");
    }
    this.activateCardPower(cardToEmpower, lane);
    cardToEmpower.wasRempowered = true;
    const cards = lane.cards;
    const cardsNotEmpowered = cards.filter(card => card.isFlipped && card.cardType !== CardType.K && !card.wasRempowered);
    if (cardsNotEmpowered.length === 0) {
      this.currentStatus = TurnStatus.WAITING_NEXT_ACTION;
      cards.forEach(card => card.wasRempowered = false);
    }
  }

  public moveCard(playerId: Id, fromLaneId: Id, cardId: Id, toLaneId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE) {
      throw new Error("Can't do this action");
    } 

    const board = this.boards[playerId];
    board.moveCard(cardId, fromLaneId, toLaneId);
  } 

  public getPlayerState(playerId: Id): PlayerState {
    const playerHand = this.hands[playerId];
    const playerBoard = this.boards[playerId];
    const opponentId = playerId === this.player1.id ? this.player2.id : this.player1.id;
    const opponentHand = this.hands[opponentId];
    const opponentBoard = this.boards[opponentId];

    return {
      I: {
        hand: playerHand.getCards(),
        board: [
          {
            baseCard: this.getOpponentCard(playerBoard.firstLane().baseCard),
            cards: playerBoard.firstLane().cards,
          },
          {
            baseCard: this.getOpponentCard(playerBoard.secondLane().baseCard),
            cards: playerBoard.secondLane().cards,
          },
          {
            baseCard: this.getOpponentCard(playerBoard.thirdLane().baseCard),
            cards: playerBoard.thirdLane().cards,
          },
        ],
      },
      opponent: {
        hand: opponentHand.handSize(),
        board: [
          {
            baseCard: this.getOpponentCard(opponentBoard.firstLane().baseCard),
            cards: opponentBoard.firstLane().cards.map((card) => this.getOpponentCard(card)),
          },
          {
            baseCard: this.getOpponentCard(opponentBoard.secondLane().baseCard),
            cards: opponentBoard.secondLane().cards.map((card) => this.getOpponentCard(card)),
          },
          {
            baseCard: this.getOpponentCard(opponentBoard.thirdLane().baseCard),
            cards: opponentBoard.thirdLane().cards.map((card) => this.getOpponentCard(card)),
          },
        ],
      },
      turnInfo: {
        isMyTurn: this.currentPlayer === playerId,
        remainingActions: this.remainingActions,
        currentState: this.currentStatus,
      },
    };
  }

  private doNTimes(times: number, action: (time: number) => void) {
    for (let i = 0; i < times; i++) {
      action(i);
    }
  }

  private runFutureAction() {
    const actions = this.futureActions[this.turnCounter] || [];
    actions.forEach(action => action());
  }

  private addFutureAction(turn: number, action: () => void) {
    const actions = this.futureActions[turn] || [];
    actions.push(action);
    this.futureActions[turn] = actions;
  }

  private getOpponentCard(card: Card | null) {
    if (card === null) {
      return null;
    }
    if (card.shouldBeLookedBy4Power) {
      return card;
    }
    if (card.isBaseCard) {
      return card.id;
    }
    if (card.isFlipped) {
      return card;
    }
    return card.id;
  }
}

enum TurnStatus {
    WAITING_CHOOSE_DISCAR_CARD,
    WAITING_NEXT_ACTION,
    WAITING_CHOOSE_CARD_TO_SEE,
    WAITING_CHOOSE_FLIP_ORDER,
    WAITING_CHOOSE_CARD_TO_MOVE,
    WAITING_CHOOSE_REACTIVATION_ORDER,
    WAITING_SECOND_CARD_TO_ATTACK
}

function allCards() {
  return [
    new Card(CardType.A),
    new Card(CardType.A),
    new Card(CardType.A),
    new Card(CardType.A),
    new Card(CardType.Two),
    new Card(CardType.Two),
    new Card(CardType.Two),
    new Card(CardType.Two),
    new Card(CardType.Three),
    new Card(CardType.Three),
    new Card(CardType.Three),
    new Card(CardType.Three),
    new Card(CardType.Four),
    new Card(CardType.Four),
    new Card(CardType.Four),
    new Card(CardType.Four),
    new Card(CardType.Five),
    new Card(CardType.Five),
    new Card(CardType.Five),
    new Card(CardType.Five),
    new Card(CardType.Six),
    new Card(CardType.Six),
    new Card(CardType.Six),
    new Card(CardType.Six),
    new Card(CardType.Seven),
    new Card(CardType.Seven),
    new Card(CardType.Seven),
    new Card(CardType.Seven),
    new Card(CardType.Eight),
    new Card(CardType.Eight),
    new Card(CardType.Eight),
    new Card(CardType.Eight),
    new Card(CardType.Nine),
    new Card(CardType.Nine),
    new Card(CardType.Nine),
    new Card(CardType.Nine),
    new Card(CardType.Ten),
    new Card(CardType.Ten),
    new Card(CardType.Ten),
    new Card(CardType.Ten),
    new Card(CardType.J),
    new Card(CardType.J),
    new Card(CardType.J),
    new Card(CardType.J),
    new Card(CardType.Q),
    new Card(CardType.Q),
    new Card(CardType.Q),
    new Card(CardType.Q),
    new Card(CardType.K),
    new Card(CardType.K),
    new Card(CardType.K),
    new Card(CardType.K),
  ];
}
let game!: Game;

function main() {

  const drawPile = new DrawPile();
  const player1 = new Player();
  const player2 = new Player();

  const player1Board = new PlayerBoard(player1.id, [new Lane(), new Lane(), new Lane()]);
  const player2Board = new PlayerBoard(player2.id, [new Lane(), new Lane(), new Lane()]);
  const player1Hand = new PlayerHand(player1.id);
  const player2Hand = new PlayerHand(player2.id);

  game = new Game(drawPile, player1, player2, player1Hand, player2Hand, player1Board, player2Board);
  game.startGame();
}


function getPlayerState(playerId: Id) {
  return game.getPlayerState(playerId);
}
