<img width="601" height="552" alt="image" src="https://github.com/user-attachments/assets/7196daed-a519-4d59-800d-6f4caca94e8b" />
<img width="1252" height="653" alt="image" src="https://github.com/user-attachments/assets/444f4c6d-f9c9-4d1c-968e-57d96f532ab5" />

# 📊 Dashboard de Gestão Lista de Tarefas

Este é um projeto Full-Stack desenvolvido como projeto de extensão universitária para o curso de Sistemas de Informação. A aplicação consiste em um "To-Do List" avançado e um painel de controle projetado para ajudar a organizar suas tarefas diárias, prioridades e categorias de forma simples e segura.

## 🚀 Funcionalidades

- **Autenticação Segura:** Criação de conta e login protegidos com criptografia de senha (BCrypt) e tokens JWT.
- **Gestão de Tarefas (CRUD):** Criação, leitura, atualização e exclusão de tarefas.
- **Categorização:** Criação dinâmica de pastas/categorias para agrupar tarefas (ex: "Projetos", "Financeiro").
- **Painel de Estatísticas:** Resumo em tempo real do total de tarefas, pendências e itens concluídos.
- **Rotas Privadas:** Proteção no Front-end que impede o acesso ao painel sem um token de autenticação válido.

## 💻 Tecnologias Utilizadas

O projeto adota uma arquitetura dividida em duas aplicações independentes (Front-end e Back-end) que se comunicam via API REST.

### ⚙️ Back-end (API REST)
- **Java:** Linguagem principal da regra de negócios.
- **Spring Boot:** Framework para criação rápida da aplicação.
- **Spring Security & JWT:** Gerenciamento de permissões, proteção de rotas e geração de tokens de acesso.
- **Padrão DTO (Data Transfer Object):** Segurança e controle rigoroso sobre os dados que entram e saem da API.
- **Banco de Dados Relacional:** Persistência das entidades (Usuários, Tarefas e Categorias).
- **Swagger / OpenAPI:** Documentação interativa dos endpoints da API.

### 🎨 Front-end (Interface do Usuário)
- **React & TypeScript:** Construção de interfaces dinâmicas e tipagem estática para evitar erros de execução.
- **Vite:** Ferramenta de build super-rápida.
- **Axios:** Cliente HTTP para comunicação e consumo da API Java.
- **React Router DOM:** Gerenciamento das rotas e navegação da aplicação (Single Page Application).
- **CSS Customizado:** Design moderno, responsivo e limpo utilizando variáveis CSS nativas, sem dependência de bibliotecas externas pesadas.

## 🛠️ Como executar o projeto localmente

### Pré-requisitos
- Java Development Kit (JDK) instalado.
- Node.js e npm instalados.
- Banco de dados configurado e rodando.

### Rodando a API (Back-end)
1. Abra a pasta do Back-end na sua IDE (IntelliJ, Eclipse ou VS Code).
2. Configure as credenciais do seu banco de dados no arquivo `application.properties`.
3. Execute a classe principal da aplicação Spring Boot. A API estará disponível em `http://localhost:8080`.

### Rodando a Interface (Front-end)
1. Pelo terminal, acesse a pasta do Front-end.
2. Crie um arquivo `.env` na raiz do projeto e aponte para a sua API:
   ```env
   VITE_API_URL=http://localhost:8080

## 🗄️ Estrutura do Banco de Dados (PostgreSQL)

O projeto utiliza o **PostgreSQL** como banco de dados relacional. A estrutura foi desenhada com relacionamentos em cascata para garantir a integridade dos dados caso um usuário ou categoria seja excluído.

O script de criação (DDL) está localizado em `database/init.sql` e contém a seguinte estrutura:

- **`usuarios`**: Armazena as credenciais e dados básicos.
- **`categorias`**: Pastas personalizadas criadas pelos usuários (relacionamento 1:N com usuários).
- **`tarefas`**: As atividades do To-Do List, vinculadas a um usuário e, opcionalmente, a uma categoria.

## 🐳 Como rodar com Docker (Recomendado)

Para facilitar o ambiente de desenvolvimento, o projeto conta com um arquivo `docker-compose.yml` já configurado com o PostgreSQL. O script SQL de criação das tabelas é executado **automaticamente** assim que o contêiner sobe pela primeira vez.

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Passos para rodar
1. Abra o terminal na raiz do projeto (onde está o arquivo `docker-compose.yml`).
2. Execute o comando para baixar a imagem e subir o banco em segundo plano:
   ```bash
   docker-compose up -d
