import { Card } from './Card';
import { Id } from './MainState';

export class Lane {
  baseCard: Card | null = null;
  cards: Card[] = [];
  isWon = false;
  isFreezed = false;

  constructor(public index: number) { }

  addCard(card: Card) {
    this.cards.push(card);
    card.setLane(this);
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
    removedCard.lane = null;
    return removedCard;
  }

  isEmpty() {
    return this.cards.length === 0 && this.baseCard === null;
  }
}

