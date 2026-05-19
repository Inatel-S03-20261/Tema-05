import { useState } from 'react';
import { BackgroundScene } from './components/BackgroundScene.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { RegisterForm } from './components/RegisterForm.jsx';
import './styles/auth.css';

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
  const [loginData, setLoginData] = useState(initialLoginData);
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleLoginChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setLoginData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegisterChange = ({ target }) => {
    const { name, value } = target;

    setRegisterData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setFeedback({
      type: 'success',
      text: `Login preparado para ${loginData.email || 'treinador@poketrade.com'}.`,
    });
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setFeedback({
        type: 'error',
        text: 'As senhas nao conferem. Ajuste os campos e tente novamente.',
      });
      return;
    }

    setFeedback({
      type: 'success',
      text: `Cadastro criado para ${registerData.name || 'novo treinador'}. Agora voce ja pode entrar.`,
    });
    setLoginData((current) => ({
      ...current,
      email: registerData.email,
    }));
    setRegisterData(initialRegisterData);
    setMode('login');
  };

  const switchMode = () => {
    setFeedback({ type: '', text: '' });
    setMode((current) => (current === 'login' ? 'register' : 'login'));
  };

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

            <div className="mode-selector" role="tablist" aria-label="Autenticacao">
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
            />
          ) : (
            <RegisterForm
              formData={registerData}
              onChange={handleRegisterChange}
              onSubmit={handleRegisterSubmit}
            />
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
