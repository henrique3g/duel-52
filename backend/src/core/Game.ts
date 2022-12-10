import { Card } from './Card';
import { CardType } from './CardType';
import { DrawPile } from './DrawPile';
import { Lane } from './Lane';
import { Player } from './Player';
import { PlayerBoard } from './PlayerBoard';
import { PlayerHand } from './PlayerHand';
import { Id } from './MainState';

export type PlayerState = {

  I: {
    playerId: Id,
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

export enum TurnStatus {
  WAITING_CHOOSE_DISCAR_CARD,
  WAITING_NEXT_ACTION,
  WAITING_CHOOSE_CARD_TO_SEE,
  WAITING_CHOOSE_FLIP_ORDER,
  WAITING_CHOOSE_CARD_TO_MOVE,
  WAITING_CHOOSE_REACTIVATION_ORDER,
  WAITING_SECOND_CARD_TO_ATTACK
}

export class Game {
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
    private player2Board: PlayerBoard
  ) {
    this.boards[player1.id] = player1Board;
    this.boards[player2.id] = player2Board;
    this.hands[player1.id] = player1Hand;
    this.hands[player2.id] = player2Hand;
  }

  public startGame() {
    this.drawPile.shuffle();
    const draw = () => this.drawPile.draw();

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
    if (card.cardType === CardType.A) {
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
        playerId: playerId,
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

