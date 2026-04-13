# [S03] Tema 5: Visualização de Trocas 

# Integrantes 
- Paulo Vicente de Carvalho Porto
- Igor Nascimento Belisário - GES - 603
- Isabella Santos Fagundes
- Tales Henrique Moreira Carvalho
- Antônio Augusto D'Assumpção

## Descrição
A Visualização de Trocas é o módulo responsável pela interação direta do jogador com o mercado de cartas. Esta aplicação permite que os usuários disponibilizem suas cartas para troca, visualizem ofertas de terceiros e gerenciem o status de suas propostas (aceitar ou negar).

O foco principal é a comunicação em tempo real e a integração entre o serviço de Jogadores (Tema 1) e o serviço de Trocas (Tema 3).

## Funcionalidades
- Disponibilização de Cartas: Interface para o jogador selecionar uma carta de seu inventário e publicá-la para troca.
- Mural de Ofertas: Visualização de todas as cartas disponibilizadas por outros jogadores no sistema.
- Sistema de Notificações: Alerta quando uma proposta é enviada.
- Alerta específico para o solicitante quando uma proposta de troca é recebida.
- Gestão de Propostas: Interface para aceitar ou recusar propostas de troca recebidas.
- Wishlist: listas de cartas da pokedex de um jogador de interesse.
- Autenticação: Login e Registro.

## Arquitetura
Esta aplicação atua como um orquestrador de informações entre diferentes serviços:
    a) Aplicação 1 (Jogadores): Consumida para validar a identidade do usuário e permissões de troca.
    b) Aplicação 3 (Trocas): Consumida para persistir os dados das propostas, buscar o histórico e enviar as notificações de sistema.
    c) PokéAPI: Utilizada para renderizar visualmente as cartas que estão sendo negociadas.
    
## Fluxo

## Diagrama de Casos de Uso

## Diagrama de Classes

## Tecnologias e Frameworks


