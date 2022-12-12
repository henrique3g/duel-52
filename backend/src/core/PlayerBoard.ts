import { Card } from './Card';
import { Lane } from './Lane';
import { randomId, Id } from './MainState';

export class PlayerBoard {
  id = randomId();

  constructor(public playerId: Id, public lanes: [Lane, Lane, Lane]) {
  }

  addBaseCard(laneNumber: number, card: Card) {
    this.lanes[laneNumber].setBaseCard(card);
  }

  getCardById(cardId: Id): Card | undefined {
    for (const lane of this.lanes) {
      const possibleCard = lane.getCardById(cardId);
      if (possibleCard) {
        return possibleCard;
      }
    }
  }

  moveCard(cardId: string, fromLaneIndex: number, toLaneIndex: number) {
    const fromLane = this.lanes[fromLaneIndex];
    const toLane = this.lanes[toLaneIndex];
    const card = fromLane.removeCard(cardId);
    toLane.addCard(card);
  }

  resetAttackFlag() {
    this.lanes.forEach(
      lane => lane.cards.forEach(
        card => card.alreadyAttacked = false
      )
    );
  }

  transformBaseCardIntoNormalCard() {
    this.lanes.forEach(lane => {
      if (lane.baseCard) {
        lane.baseCard.isBaseCard = false;
        lane.cards.unshift(lane.baseCard);
      }
      lane.baseCard = null;
    });
  }
}

