// login.js

const ADMIN_PASSWORD = "Dioney3481@@"; // Senha para o acesso de administrador
let accessInterval;
const passwordTimeout = 30 * 60 * 1000; // 30 minutos

document.addEventListener("DOMContentLoaded", function () {
    const lastLoginTime = localStorage.getItem("lastLoginTime");

    // Verifica se o usuário está autenticado; se não, exibe o modal de login
    if (!lastLoginTime || Date.now() - lastLoginTime > passwordTimeout) {
        showLoginModal();
    } else {
        resetAccessTimeout();
    }
});

function showLoginModal() {
    const loginContainer = document.createElement("div");
    loginContainer.id = "loginContainer";
    loginContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    `;

    const loginBox = document.createElement("div");
    loginBox.style.cssText = `
        background-color: #f3f4f6;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        text-align: center;
        width: 300px;
        transform: translateY(-20px);
        transition: transform 0.4s;
    `;

    const title = document.createElement("h2");
    title.innerText = "Acesso Restrito";
    title.style.cssText = `
        color: #333;
        margin-bottom: 20px;
        font-size: 1.5rem;
    `;

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Digite a senha";
    passwordInput.style.cssText = `
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        margin-bottom: 15px;
        transition: border-color 0.3s;
    `;

    passwordInput.addEventListener("focus", function () {
        passwordInput.style.borderColor = "#6b7280";
    });
    passwordInput.addEventListener("blur", function () {
        passwordInput.style.borderColor = "#ccc";
    });

    const loginButton = document.createElement("button");
    loginButton.innerText = "Entrar";
    loginButton.style.cssText = `
        width: 100%;
        padding: 12px;
        font-size: 16px;
        background-color: #4f46e5;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s;
    `;

    const loginMessage = document.createElement("div");
    loginMessage.id = "loginMessage";
    loginMessage.style.cssText = `
        color: #ef4444;
        margin-top: 15px;
    `;

    loginButton.addEventListener("click", function () {
        resetPasswordUsage(); // Verifica e reseta senhas se necessário

        const storedPasswords = JSON.parse(localStorage.getItem("passwords")) || []; // Busca as senhas cadastradas

        // Verifica se a senha inserida está na lista e é válida (não usada)
        const passwordEntry = storedPasswords.find(
            (entry) => entry.password === passwordInput.value && !entry.used
        );

        if (passwordEntry) {
            // Marcar a senha como usada
            passwordEntry.used = true;
            passwordEntry.timestamp = Date.now(); // Armazena o horário de uso
            localStorage.setItem("passwords", JSON.stringify(storedPasswords));

            loginContainer.style.opacity = "0";
            setTimeout(() => loginContainer.remove(), 300); // Remove após fade-out
            localStorage.setItem("lastLoginTime", Date.now()); // Salva o horário do login
            resetAccessTimeout();
        } else {
            loginMessage.innerText = "Senha incorreta ou já usada. Tente novamente.";
        }
    });

    // Botão "Adquirir Acesso"
    const accessButton = document.createElement("button");
    accessButton.innerText = "Adquirir Acesso";
    accessButton.style.cssText = `
        font-size: 14px;
        padding: 6px 12px;
        background-color: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s;
    `;
    accessButton.addEventListener("click", function () {
        window.open("https://t.me/DioneyWhite", "_blank"); // Abre o link no Telegram em uma nova aba
    });
    accessButton.addEventListener("mouseenter", function () {
        accessButton.style.backgroundColor = "#059669";
    });
    accessButton.addEventListener("mouseleave", function () {
        accessButton.style.backgroundColor = "#10b981";
    });

    loginBox.appendChild(title);
    loginBox.appendChild(passwordInput);
    loginBox.appendChild(loginButton);
    loginBox.appendChild(accessButton); // Adiciona o botão "Adquirir Acesso"
    loginBox.appendChild(loginMessage);
    loginContainer.appendChild(loginBox);
    document.body.appendChild(loginContainer);
}

// Função para resetar o uso das senhas
function resetPasswordUsage() {
    const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    const currentTime = Date.now();
    
    passwords.forEach(passwordEntry => {
        if (passwordEntry.used) {
            const timeUsed = passwordEntry.timestamp || 0;
            if (currentTime - timeUsed >= 25 * 60 * 1000) {
                // Se passaram 25 minutos, resetar a senha
                passwordEntry.used = false;
                delete passwordEntry.timestamp; // Remove o timestamp
            }
        }
    });

    localStorage.setItem("passwords", JSON.stringify(passwords));
}

// Animação de fade-in
const style = document.createElement("style");
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

function resetAccessTimeout() {
    clearTimeout(accessInterval);
    accessInterval = setTimeout(() => {
        alert("Sessão expirada. Por favor, insira a senha novamente.");
        localStorage.removeItem("lastLoginTime"); // Remove o horário ao expirar
        showLoginModal();
    }, passwordTimeout);
}
