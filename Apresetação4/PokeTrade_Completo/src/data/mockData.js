export const cards = [
  { pokeId: 25, pokename: 'Pikachu', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', pokeType: ['Elétrico'] },
  { pokeId: 1, pokename: 'Bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', pokeType: ['Grama', 'Veneno'] },
  { pokeId: 4, pokename: 'Charmander', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', pokeType: ['Fogo'] },
  { pokeId: 7, pokename: 'Squirtle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', pokeType: ['Água'] },
  { pokeId: 39, pokename: 'Jigglypuff', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png', pokeType: ['Normal', 'Fada'] },
  { pokeId: 133, pokename: 'Eevee', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', pokeType: ['Normal'] },
  { pokeId: 54, pokename: 'Psyduck', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png', pokeType: ['Água'] },
  { pokeId: 94, pokename: 'Gengar', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', pokeType: ['Fantasma', 'Veneno'] },
];

export const ownedCardIds = [25, 1, 4, 7, 133];
export const seenCardIds = [25, 1, 4, 7, 39, 133, 54, 94];
export const wishlistIds = [39, 94];

export const trades = [
  { tradeId: 101, tradeCardId: 25, sender: 'Ash', senderId: 1 },
  { tradeId: 102, tradeCardId: 39, sender: 'Misty', senderId: 2 },
  { tradeId: 103, tradeCardId: 94, sender: 'Brock', senderId: 3 },
];

export const offers = [
  { offerId: 501, offerCardId: 133, receiver: 'Ash', receiverId: 1, tradeId: 101, status: 'Pendente' },
];
