const API_URL = window.location.origin + '/api';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const loadingState = document.getElementById('loadingState');
    const formState = document.getElementById('formState');
    const errorState = document.getElementById('errorState');
    const successState = document.getElementById('successState');

    function mostrarEstado(estado) {
        loadingState.style.display = 'none';
        formState.style.display = 'none';
        errorState.style.display = 'none';
        successState.style.display = 'none';
        document.getElementById(estado + 'State').style.display = 'block';
    }

    if (!token) {
        mostrarEstado('error');
        document.getElementById('errorText').textContent = 'Nenhum token encontrado no link.';
        return;
    }

    // Token presente — mostra o formulário
    mostrarEstado('form');

    document.getElementById('resetForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const messageEl = document.getElementById('resetMessage');

        if (novaSenha.length < 6) {
            messageEl.className = 'form-message error';
            messageEl.textContent = 'A senha deve ter no mínimo 6 caracteres.';
            return;
        }

        if (novaSenha !== confirmarSenha) {
            messageEl.className = 'form-message error';
            messageEl.textContent = 'As senhas não coincidem.';
            return;
        }

        try {
            messageEl.className = 'form-message';
            messageEl.textContent = 'Salvando...';
            messageEl.style.display = 'block';
            messageEl.style.color = '#3498db';

            const response = await fetch(`${API_URL}/usuarios/resetar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                mostrarEstado('error');
                document.getElementById('errorText').textContent = data.error || 'Token inválido ou expirado.';
                return;
            }

            mostrarEstado('success');
            setTimeout(() => {
                window.location.href = '/auth';
            }, 2500);
        } catch (err) {
            messageEl.className = 'form-message error';
            messageEl.textContent = 'Erro ao conectar ao servidor. Tente novamente.';
        }
    });
});
