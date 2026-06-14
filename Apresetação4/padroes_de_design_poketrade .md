# Documentação dos Padrões de Design — PokeTrade

Este documento descreve os padrões de design implementados no projeto **PokeTrade**, explicando suas funcionalidades, benefícios, justificativas arquiteturais e forma de utilização durante o desenvolvimento do sistema.

A arquitetura do projeto foi estruturada utilizando o conceito de separação em camadas, dividindo as responsabilidades entre páginas da interface, serviços responsáveis pelas regras de negócio, entidades do domínio e uma camada de comunicação centralizada com o backend. Essa abordagem torna o código mais organizado, reutilizável e de fácil manutenção.

---

## 1. Padrões Criacionais

### 1.1 Factory Method Pattern

**Localização:** `models/` e `services/`

O projeto utiliza o **Factory Method Pattern** para padronizar a criação dos principais objetos do domínio, como `Trade`, `Offer` e `Card`. Esse padrão permite centralizar a lógica de criação dos objetos, evitando que as páginas da aplicação instanciem diretamente entidades com dados incompletos ou inconsistentes.

**Estrutura**

- `TradeFactory`
- `OfferFactory`
- `CardFactory`

**Responsabilidades**

- Criar objetos `Trade`, `Offer` e `Card`;
- Padronizar os dados iniciais;
- Reduzir duplicação de código.

**Benefícios**

- Centraliza a criação de objetos;
- Evita repetição de lógica;
- Facilita manutenção;
- Padroniza a estrutura dos dados;
- Torna o código mais organizado.

**Exemplo de uso**

```javascript
const trade = TradeFactory.create({
  tradeCardId: 25,
  sender: "Ash",
  senderId: 1
});

const offer = OfferFactory.create({
  offerCardId: 6,
  receiver: "Misty",
  receiverId: 2
});
```

---

### 1.2 Singleton Pattern

**Localização:** `services/` e `gateway/`

O **Singleton Pattern** garante que determinados serviços possuam apenas uma instância durante a execução da aplicação. Esse padrão é adequado para classes como `Gateway`, `ServiceAuthenticator`, `ServiceTrade` e `ServiceWishlist`, pois representam serviços centrais do sistema.

**Estrutura**

- `Gateway`
- `ServiceAuthenticator`
- `ServiceTrade`
- `ServiceWishlist`
- `ServiceCard`
- `ServicePokedex`

**Responsabilidades**

- Garantir instância única dos serviços;
- Centralizar o acesso às operações principais;
- Evitar múltiplas instâncias desnecessárias;
- Manter consistência na comunicação com o backend.

**Benefícios**

- Evita duplicação de instâncias;
- Centraliza o controle dos serviços;
- Mantém consistência dos dados;
- Facilita a reutilização em diferentes páginas;
- Reduz consumo desnecessário de recursos.

**Exemplo de uso**

```javascript
const gateway = Gateway.getInstance();

gateway.getTrade();
gateway.postTrade();
gateway.authenticateUser();
```

---

### 1.3 Builder Pattern

**Localização:** `models/`

O **Builder Pattern** pode ser aplicado na construção de objetos mais completos, especialmente quando uma entidade possui vários atributos opcionais. No projeto, esse padrão pode ser utilizado para criar objetos do tipo `Card`, `Trade` e `Offer` de forma mais legível e organizada.

**Estrutura**

- `CardBuilder`
- `TradeBuilder`
- `OfferBuilder`

**Benefícios**

- Facilita a criação de objetos complexos;
- Evita construtores com muitos parâmetros;
- Melhora a legibilidade do código;
- Permite criação gradual do objeto;
- Reduz erros na ordem dos parâmetros.

**Exemplo de uso**

```javascript
const card = new CardBuilder()
  .setPokeId(25)
  .setPokename("Pikachu")
  .setImage("pikachu.png")
  .setPokeType(["Electric"])
  .build();
```

---

### 1.4 Aplicação dos Padrões Criacionais no Projeto

Os padrões criacionais contribuem para que o sistema tenha uma estrutura mais organizada na criação de objetos. No contexto do **PokeTrade**, eles são especialmente úteis para:

- Criar cartas Pokémon;
- Criar trocas e ofertas;
- Instanciar serviços;
- Padronizar dados utilizados pelas telas;
- Facilitar futuras expansões do sistema.

Com isso, páginas como `Dashboard`, `TradePage`, `WishlistPage` e `LoginPage` não precisam se preocupar com a forma exata de criação dos objetos, apenas com sua utilização.

---

## 2. Padrões Estruturais

### 2.1 Facade Pattern

**Localização:** `Gateway`

O padrão **Facade** foi implementado através da classe `Gateway`, responsável por fornecer uma interface única para comunicação entre o frontend e os serviços do backend. Ao invés de cada página realizar chamadas HTTP diretamente, todas as operações passam pelo `Gateway`, que centraliza a comunicação com a API.

**Estrutura**

- `Gateway`
  - `authenticateUser()`
  - `registerUser()`
  - `getTrade()`
  - `postTrade()`
  - `putTrade()`
  - `deleteTrade()`
  - `postOffer()`
  - `putOffer()`
  - `getWishlist()`
  - `postWishlist()`
  - `removeWishlist()`

**Benefícios**

- Centralização das chamadas para a API;
- Redução do acoplamento entre interface e backend;
- Facilidade para manutenção;
- Padronização da comunicação;
- Facilidade para alteração futura da API.

**Fluxo**

```
LoginPage
    │
    ▼
ServiceAuthenticator
    │
    ▼
Gateway
    │
    ▼
Backend REST
```

**Exemplo de uso**

```javascript
Gateway.authenticateUser();
Gateway.registerUser();
Gateway.getTrade();
Gateway.postWishlist();
```

---

### 2.2 Service Layer Pattern

**Localização:** `services/`

O projeto utiliza uma camada de serviços responsável por encapsular todas as regras de negócio do sistema. As páginas não implementam diretamente a lógica da aplicação — apenas solicitam operações aos respectivos serviços.

**Serviços existentes**

| Serviço | Responsabilidade |
|---|---|
| `ServiceAuthenticator` | Toda a autenticação da aplicação |
| `ServiceTrade` | Gerenciamento das trocas |
| `ServiceWishlist` | Lista de desejos do usuário |
| `ServiceCard` | Consulta das cartas do usuário |
| `ServicePokedex` | Busca das cartas já visualizadas |

#### ServiceAuthenticator

Responsável por toda autenticação da aplicação.

Operações: `login()`, `logout()`, `validateSession()`, `getLoggedUser()`, `registerUser()`

Benefícios: centralização das regras de autenticação, reutilização do código, segurança na validação de sessão, facilidade para futuras alterações.

#### ServiceTrade

Responsável pelo gerenciamento das trocas.

Operações: `listActiveTrades()`, `sendTrade()`, `cancelTrade()`, `sendOffer()`, `finishOffer()`

Benefícios: isolamento das regras de negócio, facilidade de manutenção, código mais organizado.

#### ServiceWishlist

Gerencia toda a lista de desejos do usuário.

Operações: `getWishlist()`, `addToWishlist()`, `removeFromWishlist()`

Benefícios: encapsulamento das operações, facilidade para expansão futura, separação da lógica da interface.

#### ServiceCard

Responsável pela consulta das cartas pertencentes ao usuário.

Operação: `searchOwnedCards()`

#### ServicePokedex

Responsável pela busca das cartas já visualizadas pelo usuário.

Operação: `searchSeenCards()`

---

### 2.3 Model Pattern (Entidades de Domínio)

O sistema utiliza entidades específicas para representar os objetos do domínio da aplicação. Essas classes armazenam exclusivamente informações relacionadas ao negócio.

**Trade** — representa uma troca cadastrada.

Atributos: `tradeId`, `tradeCardId`, `sender`, `senderId`

**Offer** — representa uma oferta realizada para determinada troca.

Atributos: `offerId`, `offerCardId`, `receiver`, `receiverId`

**Card** — representa uma carta Pokémon.

Atributos: `pokeId`, `pokename`, `image`, `pokeType[]`

**Benefícios**

- Organização dos dados;
- Separação entre modelo e interface;
- Facilidade para serialização;
- Maior clareza do domínio.

---

## 3. Arquitetura e Princípios

### 3.1 Arquitetura em Camadas (Layered Architecture)

Todo o projeto foi organizado em camadas independentes:

```
┌───────────────────────┐
│         Pages         │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│       Services        │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│        Gateway        │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Backend API      │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Banco de Dados   │
└───────────────────────┘
```

---

### 3.2 Separation of Concerns (SoC)

Cada componente possui uma responsabilidade específica:

- **Pages** — responsáveis apenas pela interação com o usuário (`LoginPage`, `Dashboard`, `TradePage`, `WishlistPage`);
- **Services** — responsáveis pelas regras de negócio (autenticação, wishlist, pokédex, cartas, trocas);
- **Gateway** — responsável exclusivamente pela comunicação com o backend;
- **Models** — responsáveis apenas pelo armazenamento dos dados.

Benefícios: código desacoplado, melhor organização, maior reutilização, facilidade de testes.

---

### 3.3 Single Responsibility Principle (SRP)

Cada classe possui apenas uma responsabilidade:

| Classe | Responsabilidade |
|---|---|
| `LoginPage` | Apenas a interface de login (`login()`, `cadastro()`) |
| `ServiceAuthenticator` | Apenas a autenticação (`login()`, `logout()`, `validateSession()`, `registerUser()`) |
| `Gateway` | Apenas as chamadas HTTP |
| `ServiceWishlist` | Apenas as operações da wishlist |
| `ServiceTrade` | Apenas as regras relacionadas às trocas |

---

### 3.4 Dependency Inversion Principle (DIP)

As páginas dependem de abstrações (Services) e não diretamente do backend:

```
LoginPage
    ↓
ServiceAuthenticator
    ↓
Gateway
    ↓
API REST
```

Essa organização reduz o acoplamento e facilita futuras mudanças tecnológicas.

---

## 4. Fluxos Principais

### Fluxo de Login

```
Usuário → LoginPage → ServiceAuthenticator.login()
    → Gateway.authenticateUser() → Backend → Banco de Dados
    → Token → Gateway → ServiceAuthenticator → Dashboard
```

### Fluxo de Cadastro

```
Cadastro → LoginPage → ServiceAuthenticator.registerUser()
    → Gateway.registerUser() → Backend → Banco de Dados
    → Usuário criado → Tela inicial
```

### Fluxo de Criação de Troca

```
TradePage → ServiceTrade → Gateway.postTrade()
    → Backend → Persistência → Troca criada
```

### Fluxo de Oferta

```
Dashboard → fazerOferta() → Gateway.postOffer()
    → Backend → Oferta registrada → Notificação enviada
```

### Fluxo da Wishlist

**Adição:**
```
WishlistPage → ServiceWishlist → Gateway.postWishlist()
    → Backend → Banco de Dados
```

**Remoção:**
```
WishlistPage → ServiceWishlist → Gateway.removeWishlist()
    → Backend
```

---

## 5. Benefícios Gerais

A utilização dessa arquitetura proporciona:

- Separação clara das responsabilidades;
- Código modular;
- Facilidade para manutenção;
- Redução do acoplamento;
- Facilidade para criação de testes;
- Reutilização de regras de negócio;
- Escalabilidade do sistema;
- Facilidade para integração com novas APIs.

---

## 6. Considerações Futuras

Para evolução do projeto, podem ser implementados novos padrões de projeto, como:

- **Strategy Pattern** — para diferentes algoritmos de recomendação de trocas;
- **Observer Pattern** — para sistema de notificações em tempo real;
- **Repository Pattern** — para abstração do acesso aos dados;
- **Adapter Pattern** — para integração com APIs externas.

---

## 7. Conclusão

A arquitetura do projeto **PokeTrade** foi estruturada utilizando uma combinação de **Facade Pattern**, **Service Layer Pattern**, **Layered Architecture** e **Model Pattern**, aliados aos princípios **SOLID** — principalmente **Single Responsibility Principle** e **Dependency Inversion Principle**.

Essa organização garante uma aplicação modular, desacoplada e preparada para futuras expansões, permitindo que novas funcionalidades sejam incorporadas sem comprometer a estrutura existente, além de facilitar significativamente a manutenção e evolução do sistema.
