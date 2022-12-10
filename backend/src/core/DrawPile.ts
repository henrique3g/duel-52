import { Card } from './Card';
import { CardType } from './CardType';


export class DrawPile {
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

export function allCards() {
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

