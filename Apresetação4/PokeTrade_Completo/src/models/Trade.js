export class Trade {
  constructor({ tradeId, tradeCardId, sender, senderId }) {
    this.tradeId = tradeId;
    this.tradeCardId = tradeCardId;
    this.sender = sender;
    this.senderId = senderId;
  }
}
