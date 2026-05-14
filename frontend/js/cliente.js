// ==========================================
// Perfil do Cliente - Editar Dados Pessoais
// ==========================================

const API_URL = window.location.origin + '/api';

let usuarioAtual = null;

document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosUsuario();
    configurarEventos();
});

// Carregar dados do usuário
async function carregarDadosUsuario() {
    try {
        console.log('Carregando dados do usuário...');
        const response = await fetch(`${API_URL}/usuarios/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Não autenticado, redirecionando...');
                setTimeout(() => {
                    window.location.href = '/auth.html';
                }, 1000);
            }
            throw new Error(data.error || 'Erro ao carregar dados do usuário');
        }

        // Preencher os dados
        document.getElementById('usuarioDisplay').textContent = data.usuario || '-';
        document.getElementById('cpfDisplay').textContent = data.cpf || '-';
        document.getElementById('emailDisplay').textContent = data.email || '-';
        document.getElementById('novoEmail').value = data.email || '';
        
        usuarioAtual = data.usuario;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (error.message !== 'Não autenticado') {
            mostrarMensagem('Erro ao carregar seus dados', 'error', 'editEmailMessage');
        }
    }
}

// Configurar eventos
function configurarEventos() {
    const editEmailForm = document.getElementById('editEmailForm');
    const editSenhaForm = document.getElementById('editSenhaForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (editEmailForm) {
        editEmailForm.addEventListener('submit', alterarEmail);
    }

    if (editSenhaForm) {
        editSenhaForm.addEventListener('submit', alterarSenha);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Alterar e-mail
async function alterarEmail(e) {
    e.preventDefault();

    const novoEmail = document.getElementById('novoEmail').value.trim();
    const messageEl = document.getElementById('editEmailMessage');

    if (!novoEmail) {
        mostrarMensagem('Por favor, insira um e-mail válido', 'error', 'editEmailMessage');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/perfil/atualizar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: novoEmail })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar e-mail');
        }

        mostrarMensagem('E-mail atualizado com sucesso!', 'success', 'editEmailMessage');
        
        // Recarregar dados do usuário após sucesso
        setTimeout(() => {
            carregarDadosUsuario();
        }, 1500);
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'error', 'editEmailMessage');
    }
}

// Alterar senha
async function alterarSenha(e) {
    e.preventDefault();

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mostrarMensagem('Todos os campos são obrigatórios', 'error', 'editSenhaMessage');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem', 'error', 'editSenhaMessage');
        return;
    }

    if (novaSenha.length < 6) {
        mostrarMensagem('A nova senha deve ter pelo menos 6 caracteres', 'error', 'editSenhaMessage');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/alterar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                senhaAtual,
                novaSenha,
                confirmarSenha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao alterar senha');
        }

        mostrarMensagem('Senha alterada com sucesso!', 'success', 'editSenhaMessage');
        
        // Limpar formulário após sucesso
        document.getElementById('editSenhaForm').reset();
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(error.message, 'error', 'editSenhaMessage');
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_URL}/usuarios/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/auth.html';
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/auth.html';
    }
}

// Função auxiliar para mostrar mensagens
function mostrarMensagem(mensagem, tipo, elementId) {
    const messageEl = document.getElementById(elementId);
    if (!messageEl) return;

    messageEl.textContent = mensagem;
    messageEl.classList.remove('success', 'error');
    messageEl.classList.add(tipo);

    // Auto-hide após 5 segundos se for sucesso
    if (tipo === 'success') {
        setTimeout(() => {
            messageEl.classList.remove('success');
            messageEl.textContent = '';
        }, 5000);
    }
}

// Função de debug - para diagnosticar problemas
window.debugCliente = async function() {
    console.log('=== DEBUG CLIENTE ===');
    
    // Verificar sessão
    try {
        const sessionResponse = await fetch('http://localhost:3000/api/debug/session', {
            credentials: 'include'
        });
        const sessionData = await sessionResponse.json();
        console.log('Session Info:', sessionData);
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
    }
    
    // Verificar status de autenticação
    try {
        const authResponse = await fetch('http://localhost:3000/api/auth/status', {
            credentials: 'include'
        });
        const authData = await authResponse.json();
        console.log('Auth Status:', authData);
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
    
    // Tentar carregar dados do usuário
    try {
        const meResponse = await fetch(`${API_URL}/usuarios/me`, {
            credentials: 'include'
        });
        console.log('ME Response Status:', meResponse.status);
        const meData = await meResponse.json();
        console.log('ME Data:', meData);
    } catch (error) {
        console.error('Erro ao carregar /me:', error);
    }
    
    console.log('=== FIM DEBUG ===');
}
