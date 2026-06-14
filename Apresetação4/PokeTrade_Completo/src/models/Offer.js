export class Offer {
  constructor({ offerId, offerCardId, receiver, receiverId, tradeId, status = 'Pendente' }) {
    this.offerId = offerId;
    this.offerCardId = offerCardId;
    this.receiver = receiver;
    this.receiverId = receiverId;
    this.tradeId = tradeId;
    this.status = status;
  }
}
