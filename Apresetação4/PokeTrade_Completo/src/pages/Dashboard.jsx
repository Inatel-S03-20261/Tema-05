import { useEffect, useState } from 'react';
import { ServiceTrade } from '../services/ServiceTrade.js';
import { ServiceCard } from '../services/ServiceCard.js';
import { Gateway } from '../gateway/Gateway.js';

export function Dashboard({ user, onNavigate }) {
  const [trades, setTrades] = useState([]);
  const [offers, setOffers] = useState([]);
  const [ownedCards, setOwnedCards] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    const [tradeList, offerList, cardList] = await Promise.all([
      ServiceTrade.listActiveTrades(),
      ServiceTrade.listOffers(),
      ServiceCard.searchOwnedCards(user?.id),
    ]);

    setTrades(tradeList);
    setOffers(offerList);
    setOwnedCards(cardList);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const finishOffer = async (offerId, status) => {
    try {
      await ServiceTrade.finishOffer(offerId, status);
      await loadData();
      setMessage({ type: 'success', text: status ? 'Oferta aceita com sucesso.' : 'Oferta recusada com sucesso.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível concluir a oferta.' });
    }
  };

  const resetDemo = async () => {
    Gateway.resetMockData();
    await loadData();
    setMessage({ type: 'success', text: 'Dados demonstrativos restaurados.' });
  };

  const pendingOffers = offers.filter((offer) => offer.status === 'Pendente');

  return (
    <div className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Bem-vindo</p>
          <h1>Olá, {user?.username || 'Treinador'}!</h1>
          <p>Gerencie suas trocas, ofertas, wishlist e cartas vistas na Pokédex.</p>
        </div>
      </header>

      {message.text && (
        <div className={`app-feedback app-feedback-${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <section className="stats-grid">
        <button className="stat-card" type="button" onClick={() => onNavigate('trades')}>
          <span>{trades.length}</span>
          Trocas ativas
        </button>
        <button className="stat-card" type="button" onClick={() => onNavigate('pokedex')}>
          <span>{ownedCards.length}</span>
          Cartas suas
        </button>
        <button className="stat-card" type="button" onClick={() => onNavigate('dashboard')}>
          <span>{pendingOffers.length}</span>
          Ofertas pendentes
        </button>
      </section>

      <section className="section-card">
        <div className="section-title-row">
          <h2>Notificações de ofertas</h2>
          <div className="item-actions">
            <button className="small-button" type="button" onClick={() => onNavigate('trades')}>Ir para trocas</button>
            <button className="small-button small-button-light" type="button" onClick={resetDemo}>Restaurar demo</button>
          </div>
        </div>
        {offers.length === 0 ? (
          <p className="empty-text">Nenhuma oferta recebida até o momento.</p>
        ) : (
          <div className="list-stack">
            {offers.map((offer) => (
              <article className="list-item" key={offer.offerId}>
                <div>
                  <strong>Oferta #{offer.offerId}</strong>
                  <p>Carta ofertada: #{offer.offerCardId} | Destinatário: {offer.receiver} | Status: {offer.status}</p>
                </div>
                <div className="item-actions">
                  {offer.status === 'Pendente' ? (
                    <>
                      <button className="small-button" type="button" onClick={() => finishOffer(offer.offerId, true)}>Aceitar</button>
                      <button className="small-button small-button-light" type="button" onClick={() => finishOffer(offer.offerId, false)}>Recusar</button>
                    </>
                  ) : (
                    <span className="status-pill">{offer.status}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
