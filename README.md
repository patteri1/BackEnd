# Patteri 1 - Server 

The server for providing the GraphQL API and business logic like managing orders and creating storage reports for the [Patteri 1 application](https://github.com/patteri1/frontend). With the API the application can fetch, add and edit the data in the database.

## Built with

- Node.js
- TypeScript
- Apollo GraphQL
- PostgreSQL
- Sequelize ORM
- Docker

## Getting started

### Prerequisites

Easiest way to run the server locally is by using Visual Studio Code, the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension and Docker.

### Running the server locally with Dev Containers

1. Clone the repository to your machine and open it with VS Code.

    ```
    git clone https://github.com/patteri1/backend.git
    code backend
    ```

2. VS Code should prompt you to reopen the folder in a container. Click "Reopen in Container".
    * If not you can open it in a container manually:
    1. Open the VS Code Command palette (F1 or View -> Command Palette...).
    2. Type "open folder in container" and select *Dev Containers: Open Folder in Container*
    3. Select the *Node.js & PostgreSQL* container

3. Wait for the extension to load the container.

4. When container is ready open a new terminal inside VS Code and install dependencies.
    ```
    npm install
    ```

5. Start the application
    ```
    npm run dev
    ```

    Apollo server should now be available at [http://localhost:3000/graphql](http://localhost:3000/graphql).
    
    The application should automatically reload when you make changes. You can also restart manually with the command `rs`.

    [Dev Containers: Getting Started](https://microsoft.github.io/code-with-engineering-playbook/developer-experience/devcontainers/)

### Accessing the database

1. Acquire the id of the database container. It has the `postgres:latest` image. You can do this in terminal with the `docker ps` command or via Docker Desktop.

2. Open a terminal and access the database container shell.

    ```
    docker exec -it [container-id] psql -U postgres
    ```

    You can now run SQL commands to create, update and delete data in the database. The command `\d` shows the contents of the database. You can exit psql with `\q`. You can exit the container shell with `Ctrl + D`.

    [psql documentation](https://www.postgresql.org/docs/current/app-psql.html)
