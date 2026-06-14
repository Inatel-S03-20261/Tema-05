export class Card {
  constructor({ pokeId, pokename, image, pokeType = [] }) {
    this.pokeId = pokeId;
    this.pokename = pokename;
    this.image = image;
    this.pokeType = pokeType;
  }
}
