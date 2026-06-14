import { cards, offers as initialOffers, trades as initialTrades, wishlistIds as initialWishlistIds } from '../data/mockData.js';

const STORAGE_KEYS = {
  trades: 'poketrade_trades',
  offers: 'poketrade_offers',
  wishlist: 'poketrade_wishlist',
  user: 'poketrade_user',
};

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 120));

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let trades = readStorage(STORAGE_KEYS.trades, initialTrades);
let offers = readStorage(STORAGE_KEYS.offers, initialOffers);
let wishlistIds = readStorage(STORAGE_KEYS.wishlist, initialWishlistIds);
let currentUser = readStorage(STORAGE_KEYS.user, null);

function persistTrades() {
  writeStorage(STORAGE_KEYS.trades, trades);
}

function persistOffers() {
  writeStorage(STORAGE_KEYS.offers, offers);
}

function persistWishlist() {
  writeStorage(STORAGE_KEYS.wishlist, wishlistIds);
}

function persistUser() {
  writeStorage(STORAGE_KEYS.user, currentUser);
}

function generateId() {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
}

export const Gateway = {
  async authenticateUser({ email, password }) {
    if (!email || !password) throw new Error('Informe e-mail e senha.');
    currentUser = { id: 10, username: email.split('@')[0] || 'ppa', email, favoritePokemon: 'Pikachu' };
    persistUser();
    return delay({ token: 'token-poketrade-demo', user: currentUser });
  },

  async registerUser({ name, email, favoritePokemon, password }) {
    if (!name || !email || !favoritePokemon || !password) throw new Error('Preencha todos os campos.');
    currentUser = { id: 10, username: name, email, favoritePokemon };
    persistUser();
    return delay({ token: 'token-poketrade-demo', user: currentUser });
  },

  async logoutUser() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.user);
    return delay(true);
  },

  async getLoggedUser() {
    return delay(currentUser);
  },

  async getTrade() {
    return delay([...trades]);
  },

  async postTrade(idCarta) {
    const cardId = Number(idCarta);
    if (!cardId) throw new Error('Selecione uma carta válida para criar a troca.');

    const newTrade = {
      tradeId: generateId(),
      tradeCardId: cardId,
      sender: currentUser?.username || 'ppa',
      senderId: currentUser?.id || 10,
    };

    trades = [newTrade, ...trades];
    persistTrades();
    return delay(newTrade);
  },

  async putTrade(idTroca, updates = {}) {
    trades = trades.map((trade) => (
      trade.tradeId === Number(idTroca) ? { ...trade, ...updates } : trade
    ));
    persistTrades();
    return delay(true);
  },

  async deleteTrade(idTroca) {
    const tradeId = Number(idTroca);
    const exists = trades.some((trade) => trade.tradeId === tradeId);
    if (!exists) throw new Error('Troca não encontrada.');

    trades = trades.filter((trade) => trade.tradeId !== tradeId);
    offers = offers.filter((offer) => offer.tradeId !== tradeId);
    persistTrades();
    persistOffers();
    return delay(true);
  },

  async postOffer(idTroca, idCartaOfertada) {
    const tradeId = Number(idTroca);
    const offerCardId = Number(idCartaOfertada);
    const trade = trades.find((item) => item.tradeId === tradeId);

    if (!trade) throw new Error('Troca não encontrada.');
    if (!offerCardId) throw new Error('Selecione uma carta para ofertar.');
    if (trade.senderId === currentUser?.id) throw new Error('Você não pode fazer oferta na sua própria troca.');

    const repeatedOffer = offers.some((offer) => (
      offer.tradeId === tradeId
      && offer.offerCardId === offerCardId
      && offer.receiverId === trade.senderId
      && offer.status === 'Pendente'
    ));

    if (repeatedOffer) throw new Error('Essa carta já foi ofertada para esta troca.');

    const newOffer = {
      offerId: generateId(),
      offerCardId,
      receiver: trade.sender,
      receiverId: trade.senderId,
      tradeId,
      status: 'Pendente',
    };

    offers = [newOffer, ...offers];
    persistOffers();
    this.notifyReceiver();
    return delay(newOffer);
  },

  async putOffer(idOferta, accepted = true) {
    const offerId = Number(idOferta);
    const exists = offers.some((offer) => offer.offerId === offerId);
    if (!exists) throw new Error('Oferta não encontrada.');

    offers = offers.map((offer) => (
      offer.offerId === offerId ? { ...offer, status: accepted ? 'Aceita' : 'Recusada' } : offer
    ));
    persistOffers();
    this.notifySender();
    return delay(true);
  },

  async getOffers() {
    return delay([...offers]);
  },

  async getWishlist() {
    return delay([...wishlistIds]);
  },

  async postWishlist(idCarta) {
    const id = Number(idCarta);
    if (!id) throw new Error('Carta inválida.');
    if (!wishlistIds.includes(id)) wishlistIds = [id, ...wishlistIds];
    persistWishlist();
    return delay([...wishlistIds]);
  },

  async removeWishlist(idCarta) {
    wishlistIds = wishlistIds.filter((id) => id !== Number(idCarta));
    persistWishlist();
    return delay([...wishlistIds]);
  },

  async getCards() {
    return delay([...cards]);
  },

  notifyReceiver() {
    return 1;
  },

  notifySender() {
    return 1;
  },

  resetMockData() {
    trades = [...initialTrades];
    offers = [...initialOffers];
    wishlistIds = [...initialWishlistIds];
    persistTrades();
    persistOffers();
    persistWishlist();
  },
};
