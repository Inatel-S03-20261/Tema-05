import { useEffect, useState } from 'react';
import { Gateway } from '../gateway/Gateway.js';
import { ServiceWishlist } from '../services/ServiceWishlist.js';
import { CardGrid } from '../components/CardGrid.jsx';

export function WishlistPage() {
  const [cards, setCards] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    const [allCards, wishlistIds] = await Promise.all([
      Gateway.getCards(),
      ServiceWishlist.getWishlist(),
    ]);
    setCards(allCards);
    setWishlist(wishlistIds);
  };

  useEffect(() => {
    loadData();
  }, []);

  const runWishlistAction = async (successText, action) => {
    try {
      await action();
      await loadData();
      setMessage({ type: 'success', text: successText });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível atualizar a wishlist.' });
    }
  };

  const addWishlist = (idCarta) => {
    runWishlistAction('Carta adicionada à wishlist.', () => ServiceWishlist.addToWishlist(idCarta));
  };

  const removeWishlist = (idCarta) => {
    runWishlistAction('Carta removida da wishlist.', () => ServiceWishlist.removeFromWishlist(idCarta));
  };

  const wishlistCards = cards.filter((card) => wishlist.includes(card.pokeId));
  const availableCards = cards.filter((card) => !wishlist.includes(card.pokeId));

  return (
    <div className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h1>Lista de desejos</h1>
          <p>Adicione ou remova cartas desejadas para facilitar futuras trocas.</p>
        </div>
      </header>

      {message.text && (
        <div className={`app-feedback app-feedback-${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <section className="section-card">
        <h2>Cartas na wishlist</h2>
        {wishlistCards.length ? (
          <CardGrid cards={wishlistCards} actionLabel="Remover" onAction={removeWishlist} />
        ) : (
          <p className="empty-text">Sua wishlist ainda está vazia.</p>
        )}
      </section>

      <section className="section-card">
        <h2>Adicionar novas cartas</h2>
        {availableCards.length ? (
          <CardGrid cards={availableCards} actionLabel="Adicionar" onAction={addWishlist} />
        ) : (
          <p className="empty-text">Todas as cartas disponíveis já estão na wishlist.</p>
        )}
      </section>
    </div>
  );
}
