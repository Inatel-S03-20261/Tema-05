export function CardGrid({ cards, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <article className="pokemon-card" key={card.pokeId}>
          <img src={card.image} alt={card.pokename} />
          <div>
            <span className="pokemon-number">#{card.pokeId}</span>
            <h3>{card.pokename}</h3>
            <p>{card.pokeType.join(' / ')}</p>
          </div>
          {actionLabel && (
            <button className="small-button" type="button" onClick={() => onAction(card.pokeId)}>
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button className="small-button small-button-light" type="button" onClick={() => onSecondaryAction(card.pokeId)}>
              {secondaryActionLabel}
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
