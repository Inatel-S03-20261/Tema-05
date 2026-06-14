import { useEffect, useState } from 'react';
import { BackgroundScene } from './components/BackgroundScene.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { RegisterForm } from './components/RegisterForm.jsx';
import { AppShell } from './components/AppShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TradePage } from './pages/TradePage.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { PokedexPage } from './pages/PokedexPage.jsx';
import { ServiceAuthenticator } from './services/ServiceAuthenticator.js';
import './styles/auth.css';
import './styles/app.css';

const initialLoginData = {
  email: '',
  password: '',
  remember: true,
};

const initialRegisterData = {
  name: '',
  email: '',
  favoritePokemon: '',
  password: '',
  confirmPassword: '',
};

function App() {
  const [mode, setMode] = useState('login');
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginData, setLoginData] = useState(initialLoginData);
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    async function restoreSession() {
      const loggedUser = await ServiceAuthenticator.getLoggedUser();
      if (loggedUser) setUser(loggedUser);
      setCheckingSession(false);
    }

    restoreSession();
  }, []);

  const handleLoginChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setLoginData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRegisterChange = ({ target }) => {
    const { name, value } = target;
    setRegisterData((current) => ({ ...current, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await ServiceAuthenticator.login(loginData.email, loginData.password);
      setUser(loggedUser);
      setPage('dashboard');
      setFeedback({ type: 'success', text: 'Login realizado com sucesso.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setFeedback({ type: 'error', text: 'As senhas não conferem. Ajuste os campos e tente novamente.' });
      return;
    }

    try {
      const registeredUser = await ServiceAuthenticator.registerUser(registerData);
      setUser(registeredUser);
      setRegisterData(initialRegisterData);
      setPage('dashboard');
      setFeedback({ type: 'success', text: 'Cadastro realizado com sucesso.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    }
  };

  const switchMode = () => {
    setFeedback({ type: '', text: '' });
    setMode((current) => (current === 'login' ? 'register' : 'login'));
  };

  const handleForgotPassword = () => {
    setFeedback({ type: 'success', text: 'Recurso demonstrativo: em uma API real, seria enviado um e-mail de recuperação.' });
  };

  const handleLogout = async () => {
    await ServiceAuthenticator.logout();
    setUser(null);
    setMode('login');
    setPage('dashboard');
    setLoginData(initialLoginData);
    setFeedback({ type: '', text: '' });
  };

  const renderPage = () => {
    if (page === 'trades') return <TradePage user={user} />;
    if (page === 'wishlist') return <WishlistPage user={user} />;
    if (page === 'pokedex') return <PokedexPage user={user} />;
    return <Dashboard user={user} onNavigate={setPage} />;
  };

  if (checkingSession) {
    return (
      <main className="auth-page">
        <BackgroundScene />
        <section className="auth-layout auth-layout-centered">
          <section className="auth-card auth-card-centered">
            <div className="brand-mark brand-mark-centered">
              <span className="brand-mark-dot" />
              PokeTrade
            </div>
            <p className="empty-text loading-session">Carregando sessão...</p>
          </section>
        </section>
      </main>
    );
  }

  if (user) {
    return (
      <AppShell currentPage={page} onNavigate={setPage} onLogout={handleLogout}>
        {renderPage()}
      </AppShell>
    );
  }

  return (
    <main className="auth-page">
      <BackgroundScene />

      <section className="auth-layout auth-layout-centered">
        <section className="auth-card auth-card-centered">
          <div className="auth-card-top auth-card-top-centered">
            <div className="brand-mark brand-mark-centered">
              <span className="brand-mark-dot" />
              PokeTrade
            </div>

            <div className="mode-selector" role="tablist" aria-label="Autenticação">
              <button
                className={`mode-option ${mode === 'login' ? 'mode-option-active' : ''}`}
                data-cy="mode-login"
                type="button"
                onClick={() => {
                  setFeedback({ type: '', text: '' });
                  setMode('login');
                }}
              >
                Entrar
              </button>
              <button
                className={`mode-option ${mode === 'register' ? 'mode-option-active' : ''}`}
                data-cy="mode-register"
                type="button"
                onClick={() => {
                  setFeedback({ type: '', text: '' });
                  setMode('register');
                }}
              >
                Cadastro
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <LoginForm
              formData={loginData}
              onChange={handleLoginChange}
              onSubmit={handleLoginSubmit}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <RegisterForm formData={registerData} onChange={handleRegisterChange} onSubmit={handleRegisterSubmit} />
          )}

          {feedback.text && (
            <p data-cy="feedback-message" className={`feedback-message feedback-${feedback.type}`}>
              {feedback.text}
            </p>
          )}

          <footer className="auth-card-footer auth-card-footer-centered">
            <button className="text-link" data-cy="footer-switch-mode" type="button" onClick={switchMode}>
              {mode === 'login' ? 'Criar cadastro' : 'Voltar para login'}
            </button>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default App;
