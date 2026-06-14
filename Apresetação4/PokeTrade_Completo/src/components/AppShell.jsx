export function AppShell({ currentPage, onNavigate, onLogout, children }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'trades', label: 'Trocas' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'pokedex', label: 'Pokédex' },
  ];

  return (
    <main className="app-page">
      <aside className="sidebar">
        <div className="brand-mark sidebar-brand">
          <span className="brand-mark-dot" />
          PokeTrade
        </div>

        <nav className="app-nav" aria-label="Menu principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${currentPage === item.id ? 'nav-button-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-button" type="button" onClick={onLogout}>
          Sair
        </button>
      </aside>

      <section className="content-area">{children}</section>
    </main>
  );
}
