// ==========================================
// Painel Administrativo
// ==========================================

const API_URL = window.location.origin + '/api';

let produtosAdmin = [];
let pedidosAdmin = [];
let usuariosAdmin = [];

document.addEventListener('DOMContentLoaded', async () => {
    await verificarAdmin();
    configurarEventosAdmin();
    await carregarDadosAdmin();
});

// Verificar se é admin
async function verificarAdmin() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/status`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.autenticado || data.usuario !== 'admin') {
            window.location.href = '/';
        }
    } catch (error) {
        window.location.href = '/';
    }
}

// Carregar todos os dados admin
async function carregarDadosAdmin() {
    await carregarProdutosAdmin();
    await carregarPedidosAdmin();
    await carregarUsuariosAdmin();
    atualizarEstatisticas();
}

// Carregar produtos
async function carregarProdutosAdmin() {
    try {
        const response = await fetch(`${API_URL}/produtos`, {
            credentials: 'include'
        });
        produtosAdmin = await response.json();
        renderizarTabelaProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Renderizar tabela de produtos
function renderizarTabelaProdutos() {
    const tbody = document.querySelector('#produtosTabela tbody');
    tbody.innerHTML = '';

    if (produtosAdmin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Nenhum produto cadastrado</td></tr>';
        return;
    }

    produtosAdmin.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td>${produto.tamanhos.P}</td>
            <td>${produto.tamanhos.M}</td>
            <td>${produto.tamanhos.G}</td>
            <td class="tabela-acoes">
                <button class="btn-info" onclick="abrirModalEditar(${produto.id})">Editar</button>
                <button class="btn-danger" onclick="deletarProduto(${produto.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar pedidos
async function carregarPedidosAdmin() {
    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            credentials: 'include'
        });
        pedidosAdmin = await response.json();
        renderizarTabelaPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

// Renderizar tabela de pedidos
function renderizarTabelaPedidos() {
    const tbody = document.querySelector('#pedidosTabela tbody');
    tbody.innerHTML = '';

    if (pedidosAdmin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Nenhum pedido realizado</td></tr>';
        return;
    }

    pedidosAdmin.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${pedido.id}</td>
            <td>${pedido.usuario}</td>
            <td>R$ ${parseFloat(pedido.total).toFixed(2)}</td>
            <td>${new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
            <td class="tabela-acoes">
                <button class="btn-info" onclick="abrirDetalhesPedido(${pedido.id})">Ver Detalhes</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    // Total de produtos
    document.getElementById('totalProdutos').textContent = produtosAdmin.length;

    // Total de pedidos
    document.getElementById('totalPedidos').textContent = pedidosAdmin.length;

    // Total de vendas
    const totalVendas = pedidosAdmin.reduce((acc, p) => acc + parseFloat(p.total), 0);
    document.getElementById('vendas').textContent = `R$ ${totalVendas.toFixed(2)}`;
}

// Configurar eventos admin
function configurarEventosAdmin() {
    // Abas
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });

    // Form novo produto
    const novoProdutoForm = document.getElementById('novoProdutoForm');
    if (novoProdutoForm) {
        novoProdutoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await criarProduto();
        });
    }

    // Form editar produto
    const editarProdutoForm = document.getElementById('editarProdutoForm');
    if (editarProdutoForm) {
        editarProdutoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await salvarEdicaoProduto();
        });
    }

    // Form editar usuário
    const editarUsuarioForm = document.getElementById('editarUsuarioForm');
    if (editarUsuarioForm) {
        editarUsuarioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await salvarEdicaoUsuario();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch(`${API_URL}/usuarios/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/';
        });
    }

    // Fechar modais
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Criar novo produto
async function criarProduto() {
    const nome = document.getElementById('produtoNome').value.trim();
    const preco = parseFloat(document.getElementById('produtoPreco').value);
    const img = document.getElementById('produtoImg').value.trim();
    const tamanhoP = parseInt(document.getElementById('tamanhoPUnidade').value) || 0;
    const tamanhoM = parseInt(document.getElementById('tamanhoMUnidade').value) || 0;
    const tamanhoG = parseInt(document.getElementById('tamanhoGUnidade').value) || 0;

    const messageEl = document.getElementById('novoProdutoMessage');

    if (!nome || !preco) {
        const mensagem = 'Nome e preço obrigatórios';
        if (messageEl) {
            messageEl.textContent = mensagem;
            messageEl.className = 'form-message error';
        } else {
            SMGToast.show(mensagem, 'error');
        }
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nome,
                preco,
                img,
                tamanhos: {
                    P: tamanhoP,
                    M: tamanhoM,
                    G: tamanhoG
                }
            })
        });

        const data = await response.json();
        
        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);
        console.log('Response Data:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar produto');
        }

        console.log('Produto criado com sucesso, recarregando...');

        SMGToast.show('Produto criado com sucesso!', 'success');
        if (messageEl) {
            messageEl.textContent = 'Produto criado com sucesso!';
            messageEl.className = 'form-message success';
        }

        document.getElementById('novoProdutoForm').reset();
        await carregarProdutosAdmin();
        atualizarEstatisticas();

        if (messageEl) {
            setTimeout(() => {
                messageEl.className = 'form-message';
            }, 3000);
        }
    } catch (error) {
        console.error('Erro na criação:', error);
        const msg = 'Erro: ' + error.message;
        SMGToast.show(msg, 'error');
        if (messageEl) {
            messageEl.textContent = msg;
            messageEl.className = 'form-message error';
        }
    }
}

// Abrir modal para editar
function abrirModalEditar(produtoId) {
    const produto = produtosAdmin.find(p => p.id === produtoId);
    if (!produto) return;

    document.getElementById('editarProdutoId').value = produto.id;
    document.getElementById('editarProdutoNome').value = produto.nome;
    document.getElementById('editarProdutoPreco').value = produto.preco;
    document.getElementById('editarProdutoImg').value = produto.img || '';
    document.getElementById('editarTamanhoPUnidade').value = produto.tamanhos.P;
    document.getElementById('editarTamanhoMUnidade').value = produto.tamanhos.M;
    document.getElementById('editarTamanhoGUnidade').value = produto.tamanhos.G;

    document.getElementById('editarProdutoModal').classList.add('active');
}

// Salvar edição
async function salvarEdicaoProduto() {
    const id = parseInt(document.getElementById('editarProdutoId').value);
    const nome = document.getElementById('editarProdutoNome').value.trim();
    const preco = parseFloat(document.getElementById('editarProdutoPreco').value);
    const img = document.getElementById('editarProdutoImg').value.trim();
    const tamanhoP = parseInt(document.getElementById('editarTamanhoPUnidade').value) || 0;
    const tamanhoM = parseInt(document.getElementById('editarTamanhoMUnidade').value) || 0;
    const tamanhoG = parseInt(document.getElementById('editarTamanhoGUnidade').value) || 0;

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nome,
                preco,
                img,
                tamanhos: {
                    P: tamanhoP,
                    M: tamanhoM,
                    G: tamanhoG
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        SMGToast.show('Produto atualizado com sucesso!', 'success');
        document.getElementById('editarProdutoModal').classList.remove('active');
        await carregarProdutosAdmin();
        atualizarEstatisticas();
    } catch (error) {
        SMGToast.show('Erro: ' + error.message, 'error');
    }
}

// Deletar produto
async function deletarProduto(produtoId) {
    const ok = await SMGToast.confirm('Tem certeza que deseja deletar este produto?', 'Deletar Produto');
    if (!ok) return;

    try {
        const response = await fetch(`${API_URL}/produtos/${produtoId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        SMGToast.show('Produto deletado com sucesso!', 'success');
        await carregarProdutosAdmin();
        atualizarEstatisticas();
    } catch (error) {
        SMGToast.show('Erro: ' + error.message, 'error');
    }
}

// Abrir detalhes do pedido
function abrirDetalhesPedido(pedidoId) {
    const pedido = pedidosAdmin.find(p => p.id === pedidoId);
    if (!pedido) return;

    const container = document.getElementById('detalhesPedido');
    
    let htmlProdutos = '';
    pedido.produtos.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        htmlProdutos += `
            <div class="detalhe-item">
                <div><strong>${item.nome}</strong></div>
                <div>Tamanho: ${item.tamanho} | Quantidade: ${item.quantidade}</div>
                <div>Preço unitário: R$ ${parseFloat(item.preco).toFixed(2)}</div>
                <div style="color: #0066cc; font-weight: 600;">Subtotal: R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Pedido #${pedido.id}</h3>
            <p><strong>Usuário:</strong> ${pedido.usuario}</p>
            <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleDateString('pt-BR')} ${new Date(pedido.data).toLocaleTimeString('pt-BR')}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Produtos:</h4>
            ${htmlProdutos}
        </div>
        <div style="border-top: 2px solid #e0e0e0; padding-top: 20px; font-size: 18px; font-weight: 600;">
            Total: R$ ${parseFloat(pedido.total).toFixed(2)}
        </div>
    `;

    document.getElementById('detalhesPedidoModal').classList.add('active');
}

// Carregar usuários
async function carregarUsuariosAdmin() {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            credentials: 'include'
        });
        usuariosAdmin = await response.json();
        renderizarTabelaUsuarios();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Renderizar tabela de usuários
function renderizarTabelaUsuarios() {
    const tbody = document.querySelector('#usuariosTabela tbody');
    tbody.innerHTML = '';

    if (usuariosAdmin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">Nenhum usuário cadastrado</td></tr>';
        return;
    }

    usuariosAdmin.forEach(usuario => {
        const row = document.createElement('tr');
        const dataCriacao = new Date(usuario.created_at).toLocaleDateString('pt-BR');
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.email || '-'}</td>
            <td>${usuario.cpf || '-'}</td>
            <td>${dataCriacao}</td>
            <td class="tabela-acoes">
                <button class="btn-info" onclick="abrirModalEditarUsuario(${usuario.id})">Editar</button>
                ${usuario.usuario !== 'admin' ? `<button class="btn-danger" onclick="deletarUsuario(${usuario.id})">Deletar</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Abrir modal para editar usuário
function abrirModalEditarUsuario(usuarioId) {
    const usuario = usuariosAdmin.find(u => u.id === usuarioId);
    if (!usuario) return;

    document.getElementById('editarUsuarioId').value = usuario.id;
    document.getElementById('editarUsuarioNome').value = usuario.usuario;
    document.getElementById('editarUsuarioEmail').value = usuario.email || '';
    document.getElementById('editarUsuarioCPF').value = usuario.cpf || '';
    document.getElementById('editarUsuarioSenha').value = '';
    document.getElementById('editarUsuarioMessage').textContent = '';

    document.getElementById('editarUsuarioModal').classList.add('active');
}

// Salvar edição de usuário
async function salvarEdicaoUsuario() {
    const id = parseInt(document.getElementById('editarUsuarioId').value);
    const email = document.getElementById('editarUsuarioEmail').value.trim();
    const cpf = document.getElementById('editarUsuarioCPF').value.trim();
    const novaSenha = document.getElementById('editarUsuarioSenha').value.trim();
    const messageEl = document.getElementById('editarUsuarioMessage');

    if (!email) {
        messageEl.textContent = 'Email é obrigatório';
        messageEl.style.color = 'red';
        return;
    }

    if (novaSenha && novaSenha.length < 6) {
        messageEl.textContent = 'Senha deve ter no mínimo 6 caracteres';
        messageEl.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                cpf: cpf || null,
                novaSenha: novaSenha || undefined
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        messageEl.textContent = 'Usuário atualizado com sucesso!';
        messageEl.style.color = 'green';

        setTimeout(() => {
            document.getElementById('editarUsuarioModal').classList.remove('active');
            carregarUsuariosAdmin();
        }, 1500);
    } catch (error) {
        messageEl.textContent = 'Erro: ' + error.message;
        messageEl.style.color = 'red';
    }
}

// Deletar usuário
async function deletarUsuario(usuarioId) {
    const usuario = usuariosAdmin.find(u => u.id === usuarioId);

    if (!usuario || usuario.usuario === 'admin') {
        SMGToast.show('Não é possível deletar este usuário', 'error');
        return;
    }

    const ok = await SMGToast.confirm(`Tem certeza que deseja deletar o usuário "${usuario.usuario}"?`, 'Deletar Usuário');
    if (!ok) return;

    try {
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        SMGToast.show('Usuário deletado com sucesso!', 'success');
        await carregarUsuariosAdmin();
    } catch (error) {
        SMGToast.show('Erro: ' + error.message, 'error');
    }
}
