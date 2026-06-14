export function LoginForm({ formData, onChange, onSubmit, onForgotPassword }) {
  return (
    <form className="auth-form" data-cy="login-form" onSubmit={onSubmit}>
      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        data-cy="login-email"
        name="email"
        type="email"
        placeholder="treinador@poketrade.com"
        value={formData.email}
        onChange={onChange}
        required
      />

      <label htmlFor="password">Senha</label>
      <input
        id="password"
        data-cy="login-password"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        value={formData.password}
        onChange={onChange}
        required
      />

      <div className="form-row">
        <label className="checkbox-row" htmlFor="remember">
          <input
            id="remember"
            data-cy="login-remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={onChange}
          />
          Manter conectado
        </label>

        <button className="text-link" data-cy="login-forgot-password" type="button" onClick={onForgotPassword}>
          Esqueci a senha
        </button>
      </div>

      <button className="primary-button" data-cy="login-submit" type="submit">
        Entrar
      </button>
    </form>
  );
}
