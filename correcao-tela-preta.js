// Script de correção para o problema da tela preta

// Executar assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de correção para tela preta iniciado');
    
    // Forçar exibição da tela de login
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.style.display = 'block';
        console.log('Tela de login forçada para exibição');
    }
    
    // Verificar se há elementos com display: none incorreto
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (window.getComputedStyle(screen).display === 'none') {
            screen.style.display = 'block';
            console.log('Tela forçada para exibição:', screen.id);
        }
    });
    
    // Garantir que as tabs funcionem corretamente
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remover classe active de todos os botões e conteúdos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado e conteúdo correspondente
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Verificar se o tema escuro está causando problemas
    if (document.body.classList.contains('dark-theme')) {
        // Adicionar estilos inline para garantir visibilidade no tema escuro
        const style = document.createElement('style');
        style.textContent = `
            body.dark-theme {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }
            body.dark-theme h1, 
            body.dark-theme h2, 
            body.dark-theme h3, 
            body.dark-theme p, 
            body.dark-theme label, 
            body.dark-theme button {
                color: #e0e0e0 !important;
            }
            body.dark-theme .primary-btn {
                background-color: #4a90e2 !important;
                color: white !important;
            }
            body.dark-theme input, 
            body.dark-theme textarea, 
            body.dark-theme select {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('Estilos de tema escuro corrigidos');
    }
    
    console.log('Script de correção para tela preta concluído');
});
