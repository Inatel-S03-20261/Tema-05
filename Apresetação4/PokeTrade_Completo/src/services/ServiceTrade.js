import { Gateway } from '../gateway/Gateway.js';

export const ServiceTrade = {
  listActiveTrades() {
    return Gateway.getTrade();
  },
  sendTrade(idCarta) {
    return Gateway.postTrade(idCarta);
  },
  cancelTrade(idTroca) {
    return Gateway.deleteTrade(idTroca);
  },
  sendOffer(idTroca, idCartaOfertada) {
    return Gateway.postOffer(idTroca, idCartaOfertada);
  },
  finishOffer(idOferta, status) {
    return Gateway.putOffer(idOferta, status);
  },
  listOffers() {
    return Gateway.getOffers();
  },
};
