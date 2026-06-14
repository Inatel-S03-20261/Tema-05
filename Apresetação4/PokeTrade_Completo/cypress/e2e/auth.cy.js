describe('Tela de autenticacao', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('abre em login com os controles padrao da tela', () => {
    cy.get('[data-cy="mode-login"]').should('have.class', 'mode-option-active');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.get('[data-cy="register-form"]').should('not.exist');
    cy.get('[data-cy="login-remember"]').should('be.checked');
    cy.get('[data-cy="footer-switch-mode"]').should('contain', 'Criar cadastro');
  });

  it('realiza o fluxo de login', () => {
    cy.get('[data-cy="login-email"]').type('misty@poketrade.com');
    cy.get('[data-cy="login-password"]').type('123456');
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="feedback-message"]').should(
      'contain',
      'Login preparado para misty@poketrade.com.',
    );
  });

  it('permite alternar entre login e cadastro pelos dois controles da tela', () => {
    cy.get('[data-cy="mode-register"]').click();
    cy.get('[data-cy="register-form"]').should('be.visible');
    cy.get('[data-cy="footer-switch-mode"]').should('contain', 'Voltar para login');

    cy.get('[data-cy="footer-switch-mode"]').click();
    cy.get('[data-cy="mode-login"]').should('have.class', 'mode-option-active');
    cy.get('[data-cy="login-form"]').should('be.visible');
  });

  it('mostra erro quando o cadastro tem senhas diferentes', () => {
    cy.get('[data-cy="mode-register"]').click();
    cy.get('[data-cy="register-form"]').should('be.visible');

    cy.get('[data-cy="register-name"]').type('Ash Ketchum');
    cy.get('[data-cy="register-favorite-pokemon"]').type('Pikachu');
    cy.get('[data-cy="register-email"]').type('ash@poketrade.com');
    cy.get('[data-cy="register-password"]').type('senha123');
    cy.get('[data-cy="register-confirm-password"]').type('senha999');
    cy.get('[data-cy="register-submit"]').click();

    cy.get('[data-cy="feedback-message"]').should(
      'contain',
      'As senhas nao conferem. Ajuste os campos e tente novamente.',
    );
  });

  it('limpa o feedback ao trocar de modo', () => {
    cy.get('[data-cy="login-email"]').type('misty@poketrade.com');
    cy.get('[data-cy="login-password"]').type('123456');
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="feedback-message"]').should('be.visible');
    cy.get('[data-cy="mode-register"]').click();
    cy.get('[data-cy="feedback-message"]').should('not.exist');
    cy.get('[data-cy="register-form"]').should('be.visible');
  });

  it('cria cadastro com sucesso e retorna ao login com email preenchido', () => {
    cy.get('[data-cy="footer-switch-mode"]').click();
    cy.get('[data-cy="register-form"]').should('be.visible');

    cy.get('[data-cy="register-name"]').type('Brock');
    cy.get('[data-cy="register-favorite-pokemon"]').type('Onix');
    cy.get('[data-cy="register-email"]').type('brock@poketrade.com');
    cy.get('[data-cy="register-password"]').type('senha123');
    cy.get('[data-cy="register-confirm-password"]').type('senha123');
    cy.get('[data-cy="register-submit"]').click();

    cy.get('[data-cy="mode-login"]').should('have.class', 'mode-option-active');
    cy.get('[data-cy="login-email"]').should('have.value', 'brock@poketrade.com');
    cy.get('[data-cy="feedback-message"]').should(
      'contain',
      'Cadastro criado para Brock. Agora voce ja pode entrar.',
    );
  });

  it('limpa os campos do cadastro apos sucesso quando a pessoa volta para essa aba', () => {
    cy.get('[data-cy="mode-register"]').click();
    cy.get('[data-cy="register-name"]').type('May');
    cy.get('[data-cy="register-favorite-pokemon"]').type('Torchic');
    cy.get('[data-cy="register-email"]').type('may@poketrade.com');
    cy.get('[data-cy="register-password"]').type('senha123');
    cy.get('[data-cy="register-confirm-password"]').type('senha123');
    cy.get('[data-cy="register-submit"]').click();

    cy.get('[data-cy="mode-register"]').click();
    cy.get('[data-cy="register-name"]').should('have.value', '');
    cy.get('[data-cy="register-favorite-pokemon"]').should('have.value', '');
    cy.get('[data-cy="register-email"]').should('have.value', '');
    cy.get('[data-cy="register-password"]').should('have.value', '');
    cy.get('[data-cy="register-confirm-password"]').should('have.value', '');
  });
});
