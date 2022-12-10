import { Card } from './Card';
import { randomId, Id } from './MainState';

export class Lane {
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
        const [removedCard] = this.cards.splice(cardIndex, 1);
        return removedCard;
    }
}

