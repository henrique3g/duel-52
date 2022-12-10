import { randomId } from './MainState';
import { CardType } from "./CardType";

export class Card {
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

