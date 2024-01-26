# Development environment setup

Visual Studio Code and Docker are required for this setup.

1. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extensions for VSCode.

2. Open the VS Code Command Palette (Ctrl-Shift-P) or from View -> Command Palette... 

3. Type *New Dev Container* and select **Dev Containers: New Dev Container**

4. Type *Node* and select **Node & PostgreSQL**

5. Name your container and select **Create-Dev-Container**

6. Wait for the container to be set up (this can take awhile, you can click see logs on the notification to see that something is really happening)

7. When the container is ready open a new terminal in VS Code.

8. Clone the backend repository:
    ```
    git clone https://github.com/patteri1/backend.git
    cd backend
    ```
 9. Install dependencies and start the application with nodemon.
    ```
    npm install
    npm run dev
    ```

The application should automatically reload when you make changes.