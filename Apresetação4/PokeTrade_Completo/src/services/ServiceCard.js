import { Gateway } from '../gateway/Gateway.js';
import { ownedCardIds } from '../data/mockData.js';

export const ServiceCard = {
  async searchOwnedCards(idUser) {
    const cards = await Gateway.getCards();
    return cards.filter((card) => ownedCardIds.includes(card.pokeId));
  },
};
