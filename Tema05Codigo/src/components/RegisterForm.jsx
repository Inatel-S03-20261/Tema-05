export function RegisterForm({ formData, onChange, onSubmit }) {
  return (
    <form className="auth-form" data-cy="register-form" onSubmit={onSubmit}>
      <div className="field-group">
        <div>
          <label htmlFor="name">Nome de treinador</label>
          <input
            id="name"
            data-cy="register-name"
            name="name"
            type="text"
            placeholder="Seu nome"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="favoritePokemon">Pokemon favorito</label>
          <input
            id="favoritePokemon"
            data-cy="register-favorite-pokemon"
            name="favoritePokemon"
            type="text"
            placeholder="Ex: Pikachu"
            value={formData.favoritePokemon}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <label htmlFor="register-email">E-mail</label>
      <input
        id="register-email"
        data-cy="register-email"
        name="email"
        type="email"
        placeholder="treinador@poketrade.com"
        value={formData.email}
        onChange={onChange}
        required
      />

      <div className="field-group">
        <div>
          <label htmlFor="register-password">Senha</label>
          <input
            id="register-password"
            data-cy="register-password"
            name="password"
            type="password"
            placeholder="Crie uma senha"
            value={formData.password}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            data-cy="register-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            value={formData.confirmPassword}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <button className="primary-button" data-cy="register-submit" type="submit">
        Criar cadastro
      </button>
    </form>
  );
}
