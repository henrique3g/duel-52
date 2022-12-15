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
};

export class Card {
  public isFlipped = false;
  public damageReceived = 0;
  public isBaseCard = false;
  public id = randomId();
  public shouldBeLookedBy4Power = false;
  public wasRempowered = false;
  public alreadyAttacked = false;
  public isFreezed = false;

  public lane?: Lane;

  constructor(private game: Game, public cardType: CardType) { }

  flip() {
    this.isFlipped = true;
    this.activateCardPower();
  }

  attack(attackedCard: Card, secondAttacked?: Card) {
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
    if (this.cardType === CardType.Ten && secondAttacked?.cardType !== CardType.Nine) {
      secondAttacked.doDamage(1);
      if (secondAttacked.cardType === CardType.Eight) {
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
    if (this.cardType = CardType.Nine) {
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
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_FLIP_ORDER;
      return;
    }

    if (this.cardType === CardType.Six) {
      this.lane.isFreezed = true;
      this.game.freezeLane(this.lane.index);
      return;
    }

    if (this.cardType === CardType.Seven) {
      this.lane.cards.forEach(card => card.damageReceived = 0);
      return;
    }

    if (this.cardType === CardType.Q) {
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_CARD_TO_MOVE;
      return;
    }

    if (this.cardType === CardType.K) {
      this.game.currentStatus = TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER;
      return;
    }
  }

  isDied() {
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

  toJson(): CardJson {
    return {
      isFlipped: this.isFlipped,
      cardType: this.cardType,
      id: this.id,
      damageReceived: this.damageReceived,
      alreadyAttacked: this.alreadyAttacked,
      isBaseCard: this.isBaseCard,
      shouldBeLookedBy4Power: this.shouldBeLookedBy4Power,
      wasRempowered: this.wasRempowered,
    };
  }
}

