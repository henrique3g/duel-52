import { Card, CardJson } from './Card';
import { CardType } from './CardType';
import { DrawPile } from './DrawPile';
import { Player } from './Player';
import { PlayerBoard } from './PlayerBoard';
import { PlayerHand } from './PlayerHand';
import { Id } from './MainState';


type HiddenCard = {
  id: Id;
  damageReceived: number;
};

type MyLane = {
  baseCard: CardJson | HiddenCard;
  cards: CardJson[];
  isFreezed: boolean;
};

type OpponentLane = {
  baseCard: CardJson | HiddenCard,
  cards: Array<CardJson | HiddenCard>,
  isFreezed: boolean,
};

export type PlayerState = {
  I: {
    playerId: Id,
    hand: CardJson[],
    board: [MyLane, MyLane, MyLane],
  };
  opponent: {
    hand: number,
    board: [OpponentLane, OpponentLane, OpponentLane],
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
  WAITING_SECOND_CARD_TO_ATTACK
}

export class Game {
  public discardPile: Card[] = [];
  public currentPlayer = this.player1.id;
  public remainingActions = 3;
  public boards: Record<Id, PlayerBoard> = {};
  public hands: Record<Id, PlayerHand> = {};
  public currentStatus = TurnStatus.WAITING_NEXT_ACTION;
  public turnCounter = 1;

  private futureActions: Record<number, Array<() => void>> = {};

  constructor(
    public drawPile: DrawPile,
    public player1: Player,
    public player2: Player,
    public player1Hand: PlayerHand,
    public player2Hand: PlayerHand,
    public player1Board: PlayerBoard,
    public player2Board: PlayerBoard
  ) {
    this.boards[player1.id] = player1Board;
    this.boards[player2.id] = player2Board;
    this.hands[player1.id] = player1Hand;
    this.hands[player2.id] = player2Hand;
  }

  startGame() {
    this.drawPile.fillCards(this);
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
  }

  public validateRemainingActions() {
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

  public setCard(playerId: Id, cardId: Id, laneIndex: number) {
    this.validatePlayerTurn(playerId);
    this.validateRemainingActions();

    const board = this.boards[playerId];
    const hand = this.hands[playerId];
    const lane = board.lanes[laneIndex];
    if (lane.isWon) {
      return;
    }
    const possibleCard = hand.discardCard(cardId);
    if (!possibleCard) {
      throw new Error("Card not found");
    }
    this.remainingActions -= 1;
    lane.addCard(possibleCard);
  }

  public flipCard(playerId: Id, cardId: Id, laneIndex: number) {
    this.validatePlayerTurn(playerId);
    this.validateRemainingActions();

    const board = this.getPlayerBoard();
    const lane = board.lanes[laneIndex];
    const possibleCard = lane.getCardById(cardId);
    if (!possibleCard) {
      throw new Error();
    }
    const card = possibleCard;
    if (card.isFlipped) {
      return;
    }
    this.remainingActions -= 1;
    card.flip();
  }

  public getPlayerBoard(): PlayerBoard {
    return this.boards[this.currentPlayer];
  }

  public getPlayerHand(): PlayerHand {
    return this.hands[this.currentPlayer];
  }

  public getOpponentBoard() {
    const opponentId = Object.keys(this.boards).find(playerId => playerId !== this.currentPlayer);
    return this.boards[opponentId];
  }

  public attackCard(playerId: Id, laneIndex: number, attackerId: Id, attackedId: Id, secondAttackedId?: Id) {
    this.validatePlayerTurn(playerId);
    this.validateRemainingActions();

    const attackerBoard = this.getPlayerBoard();
    const attackerLane = attackerBoard.lanes[laneIndex];
    const attackerCard = attackerLane.getCardById(attackerId);

    if (!attackerCard) {
      throw new Error("Attacker card not found");
    }
    if (!attackerCard.canAttack()) {
      throw new Error("Card can't attack");
    }

    const attackedBoard = this.getOpponentBoard();
    const attackedLane = attackedBoard.lanes[laneIndex];
    const attackedCard = attackedLane.getCardById(attackedId);


    if (!attackedCard) {
      throw new Error("Attacked card not found");
    }

    const secondAttacked = attackedLane.getCardById(secondAttackedId);
    attackerCard.attack(attackedCard, secondAttacked);

    this.verifyIsDiedCard(attackerCard);
    this.verifyIsDiedCard(attackedCard);
    if (secondAttacked) {
      this.verifyIsDiedCard(secondAttacked);
    }
    this.remainingActions -= 1;
  }

  private verifyIsDiedCard(card: Card) {
    if (card.isDied()) {
      card.lane.removeCard(card.id);
      this.discardPile.push(card);
      if (this.drawPile.isEmpty() && card.lane.isEmpty()) {
        card.lane.isWon = true;
      }
    }
  }

  public drawCard() {
    const card = this.drawPile.draw();
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

    const hand = this.getPlayerHand();
    const discardedCard = hand.discardCard(cardId);
    this.discardPile.push(discardedCard);
  }

  public seeFaceDownCard(playerId: Id, cardId: Id) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_CARD_TO_SEE) {
      throw new Error("Can't see a card face down");
    }
    let card = this.player1Board.getCardById(cardId);
    if (!card) {
      card = this.player2Board.getCardById(cardId);
    }

    if (!card) {
      throw new Error("Card don't exist");
    }
    card.shouldBeLookedBy4Power = true;
    setTimeout(() => {
      card.shouldBeLookedBy4Power = false;
    }, 5000);
  }

  public flipCardAction(playerId: Id, cardId: Id, laneIndex: number) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_FLIP_ORDER) {
      throw new Error("Action not permited");
    }

    const board = this.boards[playerId];
    const lane = board.lanes[laneIndex];
    const cardToFlip = lane.getCardById(cardId);
    if (!cardToFlip) {
      throw new Error("Card not found");
    }
    cardToFlip.flip();
    const cards = lane.cards;
    const cardsNotFlipped = cards.filter(card => card.isFlipped);
    if (cardsNotFlipped.length === 0) {
      this.currentStatus = TurnStatus.WAITING_NEXT_ACTION;
    }
  }

  public reactivateCard(playerId: Id, cardId: Id, laneIndex: number) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER) {
      throw new Error("Action not permited");
    }

    const board = this.boards[playerId];
    const lane = board.lanes[laneIndex];
    const cardToEmpower = lane.getCardById(cardId);
    if (!cardToEmpower) {
      throw new Error("Card not found");
    }
    cardToEmpower.activateCardPower();
    cardToEmpower.wasRempowered = true;
    const cards = lane.cards;
    const cardsNotEmpowered = cards.filter(card => card.isFlipped && card.cardType !== CardType.K && !card.wasRempowered);
    if (cardsNotEmpowered.length === 0) {
      this.currentStatus = TurnStatus.WAITING_NEXT_ACTION;
      cards.forEach(card => card.wasRempowered = false);
    }
  }

  public moveCard(playerId: Id, fromLaneIndex: number, cardId: Id, toLaneIndex: number) {
    this.validatePlayerTurn(playerId);
    if (this.currentStatus !== TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE) {
      throw new Error("Can't do this action");
    }

    const board = this.boards[playerId];
    board.moveCard(cardId, fromLaneIndex, toLaneIndex);
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
        hand: this.getExportCards(playerHand.getCards()),
        board: playerBoard.lanes.map(lane => ({
          baseCard: this.getOpponentCard(lane.baseCard),
          cards: this.getExportCards(lane.cards),
          isFreezed: lane.isFreezed,
        })) as [MyLane, MyLane, MyLane],
      },
      opponent: {
        hand: opponentHand.handSize(),
        board: opponentBoard.lanes.map(lane => ({
          baseCard: this.getOpponentCard(lane.baseCard),
          cards: lane.cards.map(card => this.getOpponentCard(card)),
          isFreezed: lane.isFreezed,
        })) as [OpponentLane, OpponentLane, OpponentLane],
      },
      turnInfo: {
        isMyTurn: this.currentPlayer === playerId,
        remainingActions: this.remainingActions,
        currentState: this.currentStatus,
      },
      gameInfo: {
        discardPile: this.discardPile.length,
        drawPile: this.drawPile.cards.length,
      },
    };
  }

  private doNTimes(times: number, action: (time: number) => void) {
    for (let i = 0; i < times; i++) {
      action(i);
    }
  }

  public runFutureAction() {
    const actions = this.futureActions[this.turnCounter] || [];
    actions.forEach(action => action());
  }

  public freezeLane(laneIndex: number) {
    const lane = this.getOpponentBoard().lanes[laneIndex];
    lane.isFreezed = true;
    this.addFutureAction(this.turnCounter + 2, () => {
      const lane = this.getOpponentBoard().lanes[laneIndex];
      lane.isFreezed = false;
    });
  }

  private addFutureAction(turn: number, action: () => void) {
    const actions = this.futureActions[turn] || [];
    actions.push(action);
    this.futureActions[turn] = actions;
  }

  private getExportCards(cards: Card[]): CardJson[] {
    return cards.map(card => card.toJson());
  }

  private getOpponentCard(card: Card | null): CardJson | HiddenCard {
    if (card === null) {
      return card;
    }
    if (card.shouldBeLookedBy4Power) {
      return card.toJson();
    }
    if (card.isBaseCard) {
      return {
        id: card.id,
        damageReceived: card.damageReceived,
      };
    }
    if (card.isFlipped) {
      return card.toJson();
    }
    return {
      id: card.id,
      damageReceived: card.damageReceived,
    };
  }
}

