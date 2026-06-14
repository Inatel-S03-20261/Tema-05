import { useEffect, useState } from 'react';
import { ServiceTrade } from '../services/ServiceTrade.js';
import { ServiceCard } from '../services/ServiceCard.js';
import { CardGrid } from '../components/CardGrid.jsx';

export function TradePage({ user }) {
  const [trades, setTrades] = useState([]);
  const [ownedCards, setOwnedCards] = useState([]);
  const [selectedOfferCard, setSelectedOfferCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    const [tradeList, cardList] = await Promise.all([
      ServiceTrade.listActiveTrades(),
      ServiceCard.searchOwnedCards(user?.id),
    ]);

    setTrades(tradeList);
    setOwnedCards(cardList);
    setSelectedOfferCard((current) => current || cardList[0]?.pokeId || '');
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const runAction = async (successText, action) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      await action();
      await loadData();
      setMessage({ type: 'success', text: successText });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível concluir a operação.' });
    } finally {
      setLoading(false);
    }
  };

  const createTrade = (idCarta) => {
    runAction('Troca criada com sucesso.', () => ServiceTrade.sendTrade(idCarta));
  };

  const removeTrade = (idTroca) => {
    runAction('Troca removida com sucesso.', () => ServiceTrade.cancelTrade(idTroca));
  };

  const sendOffer = (idTroca) => {
    runAction('Oferta enviada com sucesso. A notificação foi registrada no Dashboard.', () => (
      ServiceTrade.sendOffer(idTroca, selectedOfferCard)
    ));
  };

  return (
    <div className="page-panel">
      <header className="page-header">
        <div>
          <p className="eyebrow">Trocas</p>
          <h1>Exibir e criar trocas</h1>
          <p>Crie uma troca com uma carta sua ou faça oferta em uma troca ativa.</p>
        </div>
      </header>

      {message.text && (
        <div className={`app-feedback app-feedback-${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <section className="section-card">
        <h2>Minhas cartas disponíveis</h2>
        <CardGrid cards={ownedCards} actionLabel={loading ? 'Aguarde...' : 'Criar troca'} onAction={createTrade} />
      </section>

      <section className="section-card">
        <div className="section-title-row">
          <h2>Trocas ativas</h2>
          <label className="select-label">
            Carta para ofertar
            <select
              value={selectedOfferCard}
              onChange={(event) => setSelectedOfferCard(event.target.value)}
              disabled={loading || ownedCards.length === 0}
            >
              {ownedCards.map((card) => (
                <option key={card.pokeId} value={card.pokeId}>{card.pokename}</option>
              ))}
            </select>
          </label>
        </div>

        {trades.length === 0 ? (
          <p className="empty-text">Nenhuma troca ativa no momento.</p>
        ) : (
          <div className="list-stack">
            {trades.map((trade) => {
              const isOwnTrade = trade.senderId === user?.id;

              return (
                <article className="list-item" key={trade.tradeId}>
                  <div>
                    <strong>Troca #{trade.tradeId}</strong>
                    <p>Carta solicitada para troca: #{trade.tradeCardId} | Remetente: {trade.sender}</p>
                  </div>
                  <div className="item-actions">
                    {!isOwnTrade && (
                      <button
                        className="small-button"
                        type="button"
                        onClick={() => sendOffer(trade.tradeId)}
                        disabled={loading || !selectedOfferCard}
                      >
                        Fazer oferta
                      </button>
                    )}

                    {isOwnTrade && (
                      <>
                        <span className="status-pill">Sua troca</span>
                        <button
                          className="small-button small-button-light"
                          type="button"
                          onClick={() => removeTrade(trade.tradeId)}
                          disabled={loading}
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
