# PokeTrade Completo

Projeto React + Vite com Login, Cadastro, Dashboard, Trocas, Wishlist e Pokédex.

## Como rodar

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:5173
```

## O que foi ajustado

- Botão **Criar troca** funcionando.
- Botão **Fazer oferta** funcionando.
- Botão **Remover** funcionando para trocas criadas pelo usuário logado.
- Mensagens de sucesso e erro na tela de Trocas.
- Persistência em `localStorage`, mantendo trocas, ofertas e wishlist após atualizar a página.
- Gateway, Services e Pages seguindo o diagrama do projeto.

## Observação

O backend está simulado no arquivo `src/gateway/Gateway.js`.
