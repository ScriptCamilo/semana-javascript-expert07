# Understanding the application

- index.js
  - É responsável por por chamar todas as camadas
- workers
  - Toda lógica PESADA (Que envolva CPU)
  - Tudo que pode travar a tela (for loop, machine learning, AI, processamento de webcam)
  - Ele chama as regras de negócios do service
- services
  - Toda lógica de negócio
  - Toda chamada externa (API, arquivos, banco de dados)
- views
  - Toda interação com o DOM (com o HTML, com a página)
- controllers
  - É a intermediária entre (services e/ou workers) e views
- factories
  - A factory é quem importa as dependências
  - Cria o objeto final para fazermos as chamadas
  - Retorna a função que inicializa o fluxo daquele componente (init)
