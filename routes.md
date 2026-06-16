# 🗺️ Guia de Rotas da API e Permissões

Este documento mapeia todas as rotas da API REST do **Gerenciador de Bibliotecas** e define as regras de controle de acesso (permissões) para cada endpoint.

---

## 1. Rotas Públicas (Sem necessidade de login)

Estas rotas são abertas a qualquer cliente e não exigem token de autenticação:

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/v1/auth/login` | `POST` | Autenticação do usuário e geração de token JWT |

---

## 2. Rotas Exclusivas do Administrador (`ADMIN`)

Rotas que exigem a autoridade `SCOPE_ADMIN`. Usuários comuns (`USER`) receberão `403 Forbidden` ao tentar acessá-las:

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/v1/genres` | `POST` | Criar um novo gênero literário |
| `/v1/genres/{id}` | `PUT` | Atualizar dados de um gênero existente |
| `/v1/genres/{id}` | `DELETE` | Remover um gênero do sistema |
| `/v1/books` | `POST` | Cadastrar um novo livro no acervo |
| `/v1/books/{id}` | `PATCH` | Atualizar informações parciais de um livro |
| `/v1/books/{id}` | `DELETE` | Remover um livro do acervo |
| `/v1/users` | `GET` | Listar todos os usuários com filtros |
| `/v1/users` | `POST` | Cadastrar um novo usuário no sistema |
| `/v1/users/{id}` | `DELETE` | Deletar um usuário do sistema |
| `/v1/loans` | `GET` | Listar todos os empréstimos cadastrados |
| `/v1/loans/{id}` | `GET` | Buscar os detalhes de um empréstimo específico |
| `/v1/loans` | `POST` | Registrar um novo empréstimo de livro |
| `/v1/loans/{id}/renew` | `PATCH` | Renovar o prazo de um empréstimo ativo |
| `/v1/loans/{id}/return` | `PATCH` | Registrar a devolução do livro e finalizar empréstimo |
| `/v1/loans/{id}/lost` | `PATCH` | Marcar o livro do empréstimo como perdido |
| `/v1/loans/{id}/cancel` | `PATCH` | Cancelar um registro de empréstimo |

---

## 3. Rotas de Leitura Compartilhadas (`USER` e `ADMIN`)

Rotas acessíveis por qualquer usuário autenticado (`SCOPE_USER`). Administradores também herdam essa permissão:

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/v1/genres` | `GET` | Listar todos os gêneros (com filtros) |
| `/v1/genres/{id}` | `GET` | Buscar informações de um gênero por ID |
| `/v1/books` | `GET` | Listar todos os livros (com filtros) |
| `/v1/books/{id}` | `GET` | Buscar informações de um livro por ID |
| `/v1/loans/my-history` | `GET` | Visualizar histórico pessoal de empréstimos do usuário logado |

---

## 4. Rotas com Regra de Dono (`ADMIN` ou Próprio Dono)

Estas rotas exigem perfil de `ADMIN` ou que o `userId` contido no token JWT seja correspondente ao `{id}` solicitado no path:

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/v1/users/{id}` | `GET` | Detalhes do cadastro do usuário |
| `/v1/users/{id}` | `PATCH` | Atualizar dados cadastrais do usuário |
