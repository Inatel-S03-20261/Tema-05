import { Gateway } from '../gateway/Gateway.js';

export const ServiceWishlist = {
  getWishlist() {
    return Gateway.getWishlist();
  },
  addToWishlist(idCarta) {
    return Gateway.postWishlist(idCarta);
  },
  removeFromWishlist(idCarta) {
    return Gateway.removeWishlist(idCarta);
  },
};
