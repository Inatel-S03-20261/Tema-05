# Documentação dos Padrões de Design — PokeTrade

Este documento descreve os padrões de design **efetivamente implementados** no projeto **PokeTrade**, com base na inspeção direta do código-fonte em `PokeTrade_Completo/src/`. Cada seção indica o arquivo responsável, trechos reais de código e o papel do padrão na arquitetura.

A arquitetura do projeto foi estruturada em camadas, separando páginas da interface, serviços de regra de negócio e uma camada de comunicação centralizada com a fonte de dados (simulada via `localStorage`). Essa separação torna o código mais organizado e fácil de manter.

---

## 1. Facade Pattern

**Localização:** `src/gateway/Gateway.js`

O objeto `Gateway` concentra toda a comunicação com a camada de dados. Nenhuma página ou serviço acessa `localStorage` diretamente — tudo passa por ele, que esconde os detalhes de persistência (`readStorage()` / `writeStorage()`) atrás de uma API única e simples.

**Estrutura**

```javascript
export const Gateway = {
  async authenticateUser({ email, password }) { ... },
  async registerUser({ name, email, favoritePokemon, password }) { ... },
  async logoutUser() { ... },
  async getLoggedUser() { ... },
  async getTrade() { ... },
  async postTrade(idCarta) { ... },
  async putTrade(idTroca, updates) { ... },
  async deleteTrade(idTroca) { ... },
  async postOffer(idTroca, idCartaOfertada) { ... },
  async putOffer(idOferta, accepted) { ... },
  async getOffers() { ... },
  async getWishlist() { ... },
  async postWishlist(idCarta) { ... },
  async removeWishlist(idCarta) { ... },
  async getCards() { ... },
};
```

**Benefícios**

- Centraliza toda a comunicação com a fonte de dados;
- Esconde detalhes de persistência (`localStorage`) das páginas e serviços;
- Facilita a substituição futura por um backend REST real, sem alterar quem consome o `Gateway`;
- Padroniza o formato de resposta (todas as operações retornam Promises via `delay()`).

**Exemplo de uso**

```javascript
Gateway.authenticateUser({ email, password });
Gateway.getTrade();
Gateway.postWishlist(idCarta);
```

---

## 2. Service Layer Pattern

**Localização:** `src/services/`

Cada serviço é um objeto literal que delega chamadas ao `Gateway`, isolando a regra de negócio da camada de UI. As páginas não chamam o `Gateway` diretamente para suas operações principais — apenas solicitam aos serviços correspondentes.

**Serviços existentes**

| Serviço | Responsabilidade |
|---|---|
| `ServiceAuthenticator` | Autenticação da aplicação |
| `ServiceTrade` | Gerenciamento das trocas e ofertas |
| `ServiceWishlist` | Lista de desejos do usuário |
| `ServiceCard` | Consulta das cartas pertencentes ao usuário |
| `ServicePokedex` | Consulta das cartas já visualizadas pelo usuário |

#### ServiceAuthenticator

```javascript
export const ServiceAuthenticator = {
  async login(user, password) {
    const response = await Gateway.authenticateUser({ email: user, password });
    this.token = response.token;
    this.user = response.user;
    return response.user;
  },
  async logout() { ... },
  validateSession(token = this.token) {
    return Boolean(token);
  },
  async getLoggedUser() { ... },
  async registerUser(data) { ... },
};
```

#### ServiceTrade

```javascript
export const ServiceTrade = {
  listActiveTrades() { return Gateway.getTrade(); },
  sendTrade(idCarta) { return Gateway.postTrade(idCarta); },
  cancelTrade(idTroca) { return Gateway.deleteTrade(idTroca); },
  sendOffer(idTroca, idCartaOfertada) { return Gateway.postOffer(idTroca, idCartaOfertada); },
  finishOffer(idOferta, status) { return Gateway.putOffer(idOferta, status); },
  listOffers() { return Gateway.getOffers(); },
};
```

#### ServiceWishlist

```javascript
export const ServiceWishlist = {
  getWishlist() { return Gateway.getWishlist(); },
  addToWishlist(idCarta) { return Gateway.postWishlist(idCarta); },
  removeFromWishlist(idCarta) { return Gateway.removeWishlist(idCarta); },
};
```

#### ServiceCard e ServicePokedex

Além de delegar ao `Gateway`, esses dois serviços também aplicam uma regra de negócio simples — filtrar a lista completa de cartas conforme os IDs pertencentes ao usuário:

```javascript
// ServiceCard.js
export const ServiceCard = {
  async searchOwnedCards(idUser) {
    const cards = await Gateway.getCards();
    return cards.filter((card) => ownedCardIds.includes(card.pokeId));
  },
};

// ServicePokedex.js
export const ServicePokedex = {
  async searchSeenCards(idUser) {
    const cards = await Gateway.getCards();
    return cards.filter((card) => seenCardIds.includes(card.pokeId));
  },
};
```

**Benefícios**

- Isola as regras de negócio (autenticação, trocas, wishlist, filtragem de cartas) da camada visual;
- Permite reutilizar a mesma regra em páginas diferentes;
- Facilita testes e manutenção, já que cada serviço tem uma única responsabilidade.

---

## 3. Layered Architecture (Arquitetura em Camadas)

**Localização:** estrutura de pastas `src/`

```
src/pages/      → Dashboard.jsx, TradePage.jsx, WishlistPage.jsx, PokedexPage.jsx
src/services/   → ServiceAuthenticator, ServiceTrade, ServiceWishlist, ServiceCard, ServicePokedex
src/gateway/    → Gateway.js
```

O fluxo de dependência é confirmado nos imports reais das páginas:

```javascript
// src/pages/TradePage.jsx
import { ServiceTrade } from '../services/ServiceTrade.js';
import { ServiceCard } from '../services/ServiceCard.js';
// ...
ServiceTrade.listActiveTrades();
ServiceCard.searchOwnedCards(user?.id);
ServiceTrade.sendTrade(idCarta);
ServiceTrade.sendOffer(idTroca, selectedOfferCard);
```

```javascript
// src/pages/PokedexPage.jsx
import { ServicePokedex } from '../services/ServicePokedex.js';
import { ServiceCard } from '../services/ServiceCard.js';
// ...
ServicePokedex.searchSeenCards(user?.id);
ServiceCard.searchOwnedCards(user?.id);
```

```javascript
// src/App.jsx
import { ServiceAuthenticator } from './services/ServiceAuthenticator.js';
// ...
ServiceAuthenticator.getLoggedUser();
ServiceAuthenticator.login(loginData.email, loginData.password);
```

**Fluxo típico (login)**

```
LoginForm (página) → ServiceAuthenticator.login()
    → Gateway.authenticateUser() → localStorage
    → retorna usuário autenticado → App.jsx atualiza estado
```

**Benefícios**

- Código desacoplado entre interface, regra de negócio e persistência;
- Cada camada pode evoluir de forma independente (ex.: troca de `localStorage` por uma API real, alterando apenas o `Gateway`);
- Facilita a leitura do fluxo de dados do projeto.

---

## 4. Single Responsibility Principle (SRP)

Cada arquivo de serviço tem uma responsabilidade única e bem definida, refletida diretamente no código:

| Classe/Objeto | Responsabilidade única |
|---|---|
| `ServiceAuthenticator` | Apenas autenticação (`login`, `logout`, `validateSession`, `registerUser`) |
| `ServiceTrade` | Apenas regras de trocas e ofertas |
| `ServiceWishlist` | Apenas operações da wishlist |
| `ServiceCard` | Apenas consulta de cartas do usuário |
| `ServicePokedex` | Apenas consulta de cartas já vistas |
| `Gateway` | Apenas comunicação com a fonte de dados |

---

## 5. Benefícios Gerais Observados no Código

- Separação clara entre páginas, serviços e persistência;
- Reutilização de lógica: `ServiceCard.searchOwnedCards()` é usado tanto em `TradePage.jsx` quanto em `PokedexPage.jsx` e `Dashboard.jsx`;
- Facilidade para trocar a fonte de dados no futuro (de `localStorage` para uma API REST), alterando apenas `Gateway.js`;
- Código modular, com cada arquivo de serviço focado em um domínio específico.

---

## 6. Conclusão

A arquitetura do projeto **PokeTrade** combina **Facade Pattern** (`Gateway.js`) e **Service Layer Pattern** (`src/services/`), organizados em uma **Arquitetura em Camadas** que separa páginas, regras de negócio e persistência. Essa estrutura garante uma aplicação desacoplada e de fácil manutenção, na qual a camada de Services pode ser reaproveitada por múltiplas páginas e a fonte de dados pode ser substituída sem impactar a interface.