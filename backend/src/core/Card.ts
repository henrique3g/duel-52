import { randomId } from './MainState';
import { CardType } from "./CardType";
import { Lane } from './Lane';
import { Game, TurnStatus } from './Game';


export type CardJson = {
  id: string;
  cardType: CardType;
  damageReceived: number;
  isFlipped: boolean;
  isBaseCard: boolean;
  shouldBeLookedBy4Power: boolean;
  wasRempowered: boolean;
  alreadyAttacked: boolean;
  isFreezed: boolean;
};

export class Card {
  public id = randomId();
  public isFlipped = false;
  public damageReceived = 0;
  public isBaseCard = false;
  public shouldBeLookedBy4Power = false;
  public wasRempowered = false;
  public alreadyAttacked = false;
  public isFreezed = false;

  public lane?: Lane;

  private freezedTurn: number = 0;
  private flipTurn = 0;
  private usedFirstAttack = false;

  constructor(private game: Game, public cardType: CardType) { }

  flip() {
    this.isFlipped = true;
    this.activateCardPower();
    if (this.cardType === CardType.A) {
      this.flipTurn = this.game.turnCounter;
    }
  }

  attack(attackedCard: Card, secondAttacked?: Card) {
    if (!this.isFlipped) {
      throw new Error("A card face down can't attack");
    }

    if (this.alreadyAttacked) {
      throw new Error("This was attacked");
    }

    this.alreadyAttacked = true;

    if (this.cardType === CardType.A && !this.usedFirstAttack && this.flipTurn === this.game.turnCounter) {
      this.alreadyAttacked = false;
    }

    if (this.cardType === CardType.Nine && attackedCard.cardType === CardType.J && attackedCard.isFlipped) {
      attackedCard.doDamage(2);
      return;
    }
    if (attackedCard.cardType === CardType.Eight && this.cardType !== CardType.Nine && attackedCard.isFlipped) {
      this.doDamage(1);
      attackedCard.doDamage(1);
      return;
    }
    if (this.cardType === CardType.Ten && attackedCard.cardType !== CardType.Nine && secondAttacked?.cardType !== CardType.Nine) {
      secondAttacked.doDamage(1);
      if (secondAttacked.cardType === CardType.Eight && secondAttacked.isFlipped) {
        this.doDamage(1);
      }
    }
    attackedCard.doDamage(1);
  }

  protected doDamage(damage: number) {
    this.damageReceived += damage;
  }

  public setLane(lane: Lane) {
    this.lane = lane;
  }

  public canAttack(): boolean {
    if (this.cardType === CardType.Nine) {
      return this.isFlipped;
    }
    return this.isFlipped && !this.isFreezed;
  }

  public activateCardPower() {
    if (this.cardType === CardType.A) {
      this.game.remainingActions += 1;
      return;
    }
    if (this.cardType === CardType.Two && !this.game.drawPile.isEmpty()) {
      this.game.drawCard();
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_DISCAR_CARD;
      return;
    }

    if (this.cardType === CardType.Four) {
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_CARD_TO_SEE;
      return;
    }

    if (this.cardType === CardType.Five) {
      if (this.lane.cards.filter(card => !card.isFlipped).length <= 1) {
        return;
      }
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_FLIP_ORDER;
      return;
    }

    if (this.cardType === CardType.Six) {
      this.lane.isFreezed = true;
      const laneIndex = this.lane.index;
      const laneToFreeze = this.game.getOpponentBoard().lanes[laneIndex];
      laneToFreeze.cards.forEach(card => card.freeze());
      return;
    }

    if (this.cardType === CardType.Seven) {
      this.lane.cards.forEach(card => card.damageReceived = 0);
      return;
    }

    if (this.cardType === CardType.Q) {
      if (this.game.player1Board.lanes.filter(lane => lane.index !== this.lane.index && lane.cards.length >= 1).length <= 1) {
        return;
      }
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE;
      return;
    }

    if (this.cardType === CardType.K) {
      if (this.lane.cards.filter(card => card.isFlipped).length <= 1) {
        return;
      }
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER;
      return;
    }
  }

  private freeze(): void {
    if (this.cardType === CardType.Nine) {
      return;
    }
    this.isFreezed = true;
    const gameTurn = this.game.turnCounter;
    this.freezedTurn = gameTurn;
    this.game.addFutureAction(gameTurn + 2, () => {
      if (this.freezedTurn === gameTurn) {
        this.isFreezed = false;
      }
    });
  }

  public isDied() {
    if (this.cardType === CardType.J && this.isFlipped && this.damageReceived >= 3) {
      return true;
    }

    if (this.damageReceived >= 2 && this.cardType === CardType.Three) {
      this.damageReceived = 0;
      this.isFlipped = true;
      return false;
    }

    if (this.damageReceived >= 2) {
      return true;
    }

    return false;
  }

  public toJson(): CardJson {
    return {
      isFlipped: this.isFlipped,
      cardType: this.cardType,
      id: this.id,
      damageReceived: this.damageReceived,
      alreadyAttacked: this.alreadyAttacked,
      isBaseCard: this.isBaseCard,
      shouldBeLookedBy4Power: this.shouldBeLookedBy4Power,
      wasRempowered: this.wasRempowered,
      isFreezed: this.isFreezed,
    };
  }
}

