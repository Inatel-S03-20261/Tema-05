import { Gateway } from '../gateway/Gateway.js';
import { seenCardIds } from '../data/mockData.js';

export const ServicePokedex = {
  async searchSeenCards(idUser) {
    const cards = await Gateway.getCards();
    return cards.filter((card) => seenCardIds.includes(card.pokeId));
  },
};
