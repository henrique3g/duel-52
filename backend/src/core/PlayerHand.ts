import { Card } from './Card';
import { Id } from './MainState';

export class PlayerHand {
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
    const [card] = this.cards.splice(cardIndex, 1);
    return card!;
  }
}

