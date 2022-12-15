import { Card } from './Card';
import { CardType } from './CardType';
import { Game } from './Game';


export class DrawPile {
  cards: Card[];

  constructor() {
    this.cards = [];
  }

  fillCards(game: Game) {
    this.cards = allCards(game);
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

export function allCards(game: Game): Card[] {
  return [
    new Card(game, CardType.A),
    new Card(game, CardType.A),
    new Card(game, CardType.A),
    new Card(game, CardType.A),
    new Card(game, CardType.Two),
    new Card(game, CardType.Two),
    new Card(game, CardType.Two),
    new Card(game, CardType.Two),
    new Card(game, CardType.Three),
    new Card(game, CardType.Three),
    new Card(game, CardType.Three),
    new Card(game, CardType.Three),
    new Card(game, CardType.Four),
    new Card(game, CardType.Four),
    new Card(game, CardType.Four),
    new Card(game, CardType.Four),
    new Card(game, CardType.Five),
    new Card(game, CardType.Five),
    new Card(game, CardType.Five),
    new Card(game, CardType.Five),
    new Card(game, CardType.Six),
    new Card(game, CardType.Six),
    new Card(game, CardType.Six),
    new Card(game, CardType.Six),
    new Card(game, CardType.Seven),
    new Card(game, CardType.Seven),
    new Card(game, CardType.Seven),
    new Card(game, CardType.Seven),
    new Card(game, CardType.Eight),
    new Card(game, CardType.Eight),
    new Card(game, CardType.Eight),
    new Card(game, CardType.Eight),
    new Card(game, CardType.Nine),
    new Card(game, CardType.Nine),
    new Card(game, CardType.Nine),
    new Card(game, CardType.Nine),
    new Card(game, CardType.Ten),
    new Card(game, CardType.Ten),
    new Card(game, CardType.Ten),
    new Card(game, CardType.Ten),
    new Card(game, CardType.J),
    new Card(game, CardType.J),
    new Card(game, CardType.J),
    new Card(game, CardType.J),
    new Card(game, CardType.Q),
    new Card(game, CardType.Q),
    new Card(game, CardType.Q),
    new Card(game, CardType.Q),
    new Card(game, CardType.K),
    new Card(game, CardType.K),
    new Card(game, CardType.K),
    new Card(game, CardType.K),
  ];
}

