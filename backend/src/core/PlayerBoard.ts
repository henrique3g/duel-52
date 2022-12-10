import { Card } from './Card';
import { Lane } from './Lane';
import { randomId, Id } from './MainState';

export class PlayerBoard {
    id = randomId();

    constructor(public playerId: Id, private lanes: [Lane, Lane, Lane]) {
    }

    addBaseCard(laneNumber: number, card: Card) {
        this.lanes[laneNumber].setBaseCard(card);
    }

    firstLane() {
        return this.lanes[0];
    }

    secondLane() {
        return this.lanes[1];
    }

    thirdLane() {
        return this.lanes[2];
    }

    getLane(laneId: Id) {
        const possibleLane = this.lanes.find(lane => lane.id === laneId);
        if (!possibleLane) {
            throw new Error();
        }
        return possibleLane;
    }

    moveCard(cardId: string, fromLaneId: string, toLaneId: string) {
        const fromLane = this.getLane(fromLaneId);
        const toLane = this.getLane(toLaneId);
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

