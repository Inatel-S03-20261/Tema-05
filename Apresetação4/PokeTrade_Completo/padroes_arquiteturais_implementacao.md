# Onde os Padrões Arquiteturais Estão no Código — PokeTrade

Este documento mapeia cada padrão descrito em `padroes_de_design_poketrade.md` para sua localização **real** no código-fonte (`PokeTrade_Completo/src/`), com trechos de código e observações sobre divergências entre o que foi documentado e o que foi efetivamente implementado.

---

## 1. Facade Pattern — `src/gateway/Gateway.js`

**Status: ✅ Implementado**

O objeto `Gateway` concentra toda a comunicação com a "camada de dados" (neste projeto, simulada com `localStorage` + um `delay()` artificial, no lugar de um backend REST real). Nenhuma página ou serviço acessa `localStorage` diretamente — tudo passa pelo `Gateway`.

```javascript
// src/gateway/Gateway.js
export const Gateway = {
  async authenticateUser({ email, password }) { ... },
  async registerUser({ name, email, favoritePokemon, password }) { ... },
  async getTrade() { ... },
  async postTrade(idCarta) { ... },
  async deleteTrade(idTroca) { ... },
  async postOffer(idTroca, idCartaOfertada) { ... },
  async putOffer(idOferta, accepted = true) { ... },
  async getWishlist() { ... },
  async postWishlist(idCarta) { ... },
  async removeWishlist(idCarta) { ... },
  async getCards() { ... },
};
```

Internamente, o `Gateway` usa funções privadas `readStorage()` / `writeStorage()` para persistir `trades`, `offers`, `wishlistIds` e `currentUser` — esse detalhe é escondido de quem o consome, que só vê uma API simples e única de métodos assíncronos.

---

## 2. Service Layer Pattern — `src/services/`

**Status: ✅ Implementado**

Cada serviço é um objeto literal que delega chamadas ao `Gateway`, isolando a regra de negócio da camada de UI:

| Arquivo | Operações | Delega para |
|---|---|---|
| `ServiceAuthenticator.js` | `login()`, `logout()`, `validateSession()`, `getLoggedUser()`, `registerUser()` | `Gateway` |
| `ServiceTrade.js` | `listActiveTrades()`, `sendTrade()`, `cancelTrade()`, `sendOffer()`, `finishOffer()`, `listOffers()` | `Gateway` |
| `ServiceWishlist.js` | `getWishlist()`, `addToWishlist()`, `removeFromWishlist()` | `Gateway` |
| `ServiceCard.js` | `searchOwnedCards()` | `Gateway` |
| `ServicePokedex.js` | `searchSeenCards()` | `Gateway` |

Exemplo (`ServiceTrade.js`):

```javascript
import { Gateway } from '../gateway/Gateway.js';

export const ServiceTrade = {
  listActiveTrades() {
    return Gateway.getTrade();
  },
  sendTrade(idCarta) {
    return Gateway.postTrade(idCarta);
  },
  cancelTrade(idTroca) {
    return Gateway.deleteTrade(idTroca);
  },
  sendOffer(idTroca, idCartaOfertada) {
    return Gateway.postOffer(idTroca, idCartaOfertada);
  },
  finishOffer(idOferta, status) {
    return Gateway.putOffer(idOferta, status);
  },
};
```

`ServiceCard.js` e `ServicePokedex.js` também aplicam filtragem de dados (regra de negócio) antes de devolver o resultado à página:

```javascript
// src/services/ServiceCard.js
export const ServiceCard = {
  async searchOwnedCards(idUser) {
    const cards = await Gateway.getCards();
    return cards.filter((card) => ownedCardIds.includes(card.pokeId));
  },
};
```

---

## 3. Model Pattern (Entidades de Domínio) — `src/models/`

**Status: ⚠️ Implementado, mas não utilizado**

As classes existem exatamente como descritas, com construtores que apenas atribuem atributos:

```javascript
// src/models/Trade.js
export class Trade {
  constructor({ tradeId, tradeCardId, sender, senderId }) {
    this.tradeId = tradeId;
    this.tradeCardId = tradeCardId;
    this.sender = sender;
    this.senderId = senderId;
  }
}
```

O mesmo padrão se repete em `Offer.js` e `Card.js`.

**Divergência encontrada:** uma busca por `models/Trade`, `models/Offer` e `models/Card` em todo o diretório `src/` não retornou nenhuma importação:

```bash
grep -rn "models/Trade\|models/Offer\|models/Card" src/
# (nenhum resultado)
```

Ou seja, **o `Gateway` manipula objetos literais simples** (`{ tradeId, tradeCardId, sender, senderId }`) em vez de instanciar `new Trade({...})`. As classes-modelo existem no projeto, mas estão desconectadas do fluxo de dados real.

---

## 4. Layered Architecture — estrutura de pastas `src/`

**Status: ✅ Implementado**

```
src/pages/        → Dashboard.jsx, TradePage.jsx, WishlistPage.jsx, PokedexPage.jsx
src/services/      → ServiceAuthenticator, ServiceTrade, ServiceWishlist, ServiceCard, ServicePokedex
src/gateway/      → Gateway.js
src/models/        → Trade.js, Offer.js, Card.js (não conectados ao fluxo — ver seção 3)
```

O fluxo real de dependência, confirmado em `Dashboard.jsx`, `TradePage.jsx` e `PokedexPage.jsx`:

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

**Divergência encontrada — quebra parcial de camada em `WishlistPage.jsx`:**

```javascript
// src/pages/WishlistPage.jsx
import { Gateway } from '../gateway/Gateway.js';
import { ServiceWishlist } from '../services/ServiceWishlist.js';
// ...
Gateway.getCards();              // ⚠️ chamada direta ao Gateway, pulando o Service
ServiceWishlist.getWishlist();
ServiceWishlist.addToWishlist(idCarta);
ServiceWishlist.removeFromWishlist(idCarta);
```

A página deveria buscar as cartas via `ServiceCard.searchOwnedCards()` (como fazem `TradePage.jsx` e `PokedexPage.jsx`), mas chama `Gateway.getCards()` diretamente.

`Dashboard.jsx` também importa `Gateway`, mas apenas para um utilitário de debug/reset, **não** para um fluxo de negócio:

```javascript
// src/pages/Dashboard.jsx
import { Gateway } from '../gateway/Gateway.js';
// ...
Gateway.resetMockData(); // botão de debug, não é parte do fluxo principal
```

---

## 5. Padrões Documentados mas **Não Encontrados** no Código

| Padrão | Onde deveria estar | Resultado da busca |
|---|---|---|
| **Factory Method** (`TradeFactory`, `OfferFactory`, `CardFactory`) | `models/` ou `services/` | Não existe nenhum arquivo ou classe com esse nome no projeto. |
| **Builder Pattern** (`CardBuilder`, `TradeBuilder`, `OfferBuilder`) | `models/` | Não existe nenhum arquivo ou classe com esse nome no projeto. |
| **Singleton clássico** (`getInstance()`) | `Gateway`, `ServiceAuthenticator`, etc. | `Gateway` e os Services são objetos literais exportados via `export const`. Isso já garante uma única instância por módulo (comportamento equivalente a Singleton em ESM), mas **não há** a estrutura formal de classe com construtor privado e método `getInstance()` mencionada no documento original. |

---

## 6. Resumo — Padrão vs. Realidade

| Padrão | Documentado | Implementado | Observação |
|---|:---:|:---:|---|
| Facade | ✅ | ✅ | `Gateway.js` cumpre o papel descrito |
| Service Layer | ✅ | ✅ | Todos os 5 serviços batem com a documentação |
| Model (entidades) | ✅ | ⚠️ | Classes existem, mas não são usadas em nenhum import |
| Layered Architecture | ✅ | ⚠️ | Estrutura de pastas correta, mas `WishlistPage.jsx` pula o Service Layer para buscar cartas |
| Singleton (clássico) | ✅ | ⚠️ | Resolvido implicitamente via módulos ES, sem `getInstance()` |

---

