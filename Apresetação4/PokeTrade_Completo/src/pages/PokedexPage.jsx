import { useEffect, useState } from 'react';
import { ServicePokedex } from '../services/ServicePokedex.js';
import { ServiceCard } from '../services/ServiceCard.js';
import { CardGrid } from '../components/CardGrid.jsx';

export function PokedexPage({ user }) {
  const [seenCards, setSeenCards] = useState([]);
  const [ownedCards, setOwnedCards] = useState([]);

  useEffect(() => {
    Promise.all([
      ServicePokedex.searchSeenCards(user?.id),
      ServiceCard.searchOwnedCards(user?.id),
    ]).then(([seen, owned]) => {
      setSeenCards(seen);
      setOwnedCards(owned);
    });
  }, [user]);

  const ownedIds = ownedCards.map((card) => card.pokeId);

  return (
    <div className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pokédex</p>
          <h1>Cartas visualizadas</h1>
          <p>Acompanhe as cartas vistas e identifique quais já pertencem à sua coleção.</p>
        </div>
      </header>

      <section className="section-card">
        <h2>Minha coleção</h2>
        <CardGrid cards={ownedCards} />
      </section>

      <section className="section-card">
        <h2>Cartas vistas</h2>
        <div className="card-grid">
          {seenCards.map((card) => (
            <article className={`pokemon-card ${ownedIds.includes(card.pokeId) ? 'owned-card' : ''}`} key={card.pokeId}>
              <img src={card.image} alt={card.pokename} />
              <div>
                <span className="pokemon-number">#{card.pokeId}</span>
                <h3>{card.pokename}</h3>
                <p>{card.pokeType.join(' / ')}</p>
                <span className="status-pill">{ownedIds.includes(card.pokeId) ? 'Obtida' : 'Vista'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
