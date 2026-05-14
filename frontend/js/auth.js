// ==========================================
// Sistema de Autenticação
// ==========================================

const API_URL = window.location.origin + '/api';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se já está autenticado (apenas para redirecionar se for admin)
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/status`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.autenticado && data.usuario === 'admin') {
            window.location.href = '/admin';
        }
        // Permitir usuários não autenticados ou usuários normais acessarem a página de login
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Permitir acesso mesmo em caso de erro
    }

    // Configurar abas de login/registro/recuperação
    const loginTab = document.getElementById('loginTab');
    const registroTab = document.getElementById('registroTab');
    const recuperacaoTab = document.getElementById('recuperacaoTab');
    const loginForm = document.getElementById('loginForm');
    const registroForm = document.getElementById('registroForm');
    const recuperacaoForm = document.getElementById('recuperacaoForm');

    function ativarTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        if (tabName === 'login') {
            loginTab.classList.add('active');
            loginForm.classList.add('active');
        } else if (tabName === 'registro') {
            registroTab.classList.add('active');
            registroForm.classList.add('active');
        } else if (tabName === 'recuperacao') {
            recuperacaoTab.classList.add('active');
            recuperacaoForm.classList.add('active');
        }
    }

    loginTab.addEventListener('click', () => ativarTab('login'));
    registroTab.addEventListener('click', () => ativarTab('registro'));
    recuperacaoTab.addEventListener('click', () => ativarTab('recuperacao'));

    // Função para exibir mensagens com estilo
    function exibirMensagem(mensagem, tipo = 'erro') {
        const messageEl = document.getElementById('loginMessage');
        messageEl.textContent = mensagem;
        messageEl.className = 'form-message';
        
        if (tipo === 'sucesso') {
            messageEl.style.backgroundColor = '#27ae60';
            messageEl.style.color = 'white';
            messageEl.style.padding = '12px 16px';
            messageEl.style.borderRadius = '8px';
            messageEl.style.marginTop = '15px';
            messageEl.style.fontWeight = 'bold';
            messageEl.style.textAlign = 'center';
            messageEl.style.display = 'block';
            messageEl.style.animation = 'slideIn 0.4s ease';
        } else {
            messageEl.style.backgroundColor = '#e74c3c';
            messageEl.style.color = 'white';
            messageEl.style.padding = '12px 16px';
            messageEl.style.borderRadius = '8px';
            messageEl.style.marginTop = '15px';
            messageEl.style.fontWeight = 'bold';
            messageEl.style.textAlign = 'center';
            messageEl.style.display = 'block';
            messageEl.style.animation = 'slideIn 0.4s ease';
        }
    }

    // Form Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('loginUsuario').value.trim();
        const senha = document.getElementById('loginSenha').value.trim();
        const messageEl = document.getElementById('loginMessage');

        if (!usuario || !senha) {
            exibirMensagem('❌ Erro: Preencha usuário e senha!', 'erro');
            return;
        }

        try {
            messageEl.textContent = 'Autenticando...';
            messageEl.style.color = '#3498db';
            messageEl.style.display = 'block';

            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            const data = await response.json();

            if (response.ok) {
                exibirMensagem('✅ Login realizado com sucesso!', 'sucesso');
                setTimeout(() => {
                    window.location.href = '/loja';
                }, 800);
            } else {
                // Mensagens criativas de erro
                let mensagem = '❌ Erro ao fazer login';
                
                if (data.tipo === 'usuario_nao_existe') {
                    mensagem = '🔍 Erro: Usuário não encontrado! Verifique ou registre-se.';
                } else if (data.tipo === 'senha_incorreta') {
                    mensagem = '🔐 Erro: Senha incorreta! Tente novamente.';
                } else if (data.tipo === 'campos_vazios') {
                    mensagem = '❌ Erro: Usuário e senha obrigatórios!';
                } else if (data.tipo === 'erro_servidor') {
                    mensagem = '⚠️ Erro: Falha no servidor. Tente mais tarde.';
                } else {
                    mensagem = `❌ Erro: ${data.error}`;
                }
                
                exibirMensagem(mensagem, 'erro');
            }
        } catch (error) {
            exibirMensagem('⚠️ Erro: Não conseguimos conectar ao servidor!', 'erro');
        }
    });

    // Form Registro
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('registroUsuario').value.trim();
        const email = document.getElementById('registroEmail').value.trim();
        const cpf = document.getElementById('registroCPF').value.trim();
        const senha = document.getElementById('registroSenha').value;
        const messageEl = document.getElementById('registroMessage');

        if (usuario.length < 3) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '❌ Erro: Usuário deve ter no mínimo 3 caracteres!';
            messageEl.style.display = 'block';
            return;
        }

        if (senha.length < 6) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '🔐 Erro: Senha deve ter no mínimo 6 caracteres!';
            messageEl.style.display = 'block';
            return;
        }

        if (!email.includes('@')) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '✉️ Erro: Email inválido!';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'form-message';
            messageEl.textContent = '⏳ Criando sua conta...';
            messageEl.style.color = '#3498db';
            messageEl.style.display = 'block';

            const response = await fetch(`${API_URL}/usuarios/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ usuario, email, cpf, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.className = 'form-message error';
                
                if (data.error.includes('Usuário já existe')) {
                    messageEl.textContent = '👤 Erro: Este usuário já está registrado!';
                } else if (data.error.includes('Email já existe')) {
                    messageEl.textContent = '✉️ Erro: Este email já foi registrado!';
                } else {
                    messageEl.textContent = `❌ Erro: ${data.error}`;
                }
                
                messageEl.style.display = 'block';
                return;
            }

            messageEl.className = 'form-message success';
            messageEl.textContent = '✅ Conta criada com sucesso! Redirecionando para login...';
            messageEl.style.display = 'block';

            registroForm.reset();

            setTimeout(() => {
                loginTab.click();
            }, 1500);
        } catch (error) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '⚠️ Erro: Falha ao registrar. Tente novamente!';
            messageEl.style.display = 'block';
        }
    });

    // Form Recuperação de Senha
    recuperacaoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('recuperacaoUsuario').value.trim();
        const email = document.getElementById('recuperacaoEmail').value.trim();
        const messageEl = document.getElementById('recuperacaoMessage');

        if (!usuario || !email) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '❌ Erro: Preencha usuário e email!';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'form-message';
            messageEl.textContent = '⏳ Verificando dados...';
            messageEl.style.color = '#3498db';
            messageEl.style.display = 'block';

            const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, email })
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.className = 'form-message error';
                messageEl.textContent = '🔍 Erro: Usuário ou email não encontrado!';
                messageEl.style.display = 'block';
                return;
            }

            messageEl.className = 'form-message success';
            messageEl.textContent = '✅ Verificado! Agora preencha sua nova senha abaixo.';
            messageEl.style.display = 'block';
        } catch (error) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '⚠️ Erro: Falha ao verificar. Tente novamente!';
            messageEl.style.display = 'block';
        }
    });

    // Resetar Senha
    document.getElementById('btnResetarSenha').addEventListener('click', async () => {
        const usuario = document.getElementById('recuperacaoUsuario').value.trim();
        const email = document.getElementById('recuperacaoEmail').value.trim();
        const novaSenha = document.getElementById('resetarSenha').value.trim();
        const messageEl = document.getElementById('resetarMessage');

        if (!usuario || !email || !novaSenha) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '❌ Erro: Preencha todos os campos!';
            messageEl.style.display = 'block';
            return;
        }

        if (novaSenha.length < 6) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '🔐 Erro: Senha deve ter no mínimo 6 caracteres!';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'form-message';
            messageEl.textContent = '⏳ Atualizando senha...';
            messageEl.style.color = '#3498db';
            messageEl.style.display = 'block';

            const response = await fetch(`${API_URL}/usuarios/resetar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, email, novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.className = 'form-message error';
                messageEl.textContent = '❌ Erro: Falha ao resetar senha. Tente novamente!';
                messageEl.style.display = 'block';
                return;
            }

            messageEl.className = 'form-message success';
            messageEl.textContent = '✅ Senha alterada com sucesso! Faça login com sua nova senha.';
            messageEl.style.display = 'block';

            setTimeout(() => {
                recuperacaoForm.reset();
                document.getElementById('resetarSenha').value = '';
                loginTab.click();
            }, 1500);
        } catch (error) {
            messageEl.className = 'form-message error';
            messageEl.textContent = '⚠️ Erro: Falha ao conectar ao servidor!';
            messageEl.style.display = 'block';
        }
    });
});
