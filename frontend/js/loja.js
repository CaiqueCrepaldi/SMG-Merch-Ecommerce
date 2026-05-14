// ==========================================
// Loja Online - Sistema de Carrinho
// ==========================================

const API_URL = window.location.origin + '/api';

let carrinho = [];
let produtosDisponiveis = [];
let usuarioAtual = null;

document.addEventListener('DOMContentLoaded', async () => {
    await verificarAutenticacao();
    await carregarProdutos();
    configurarEventos();
    recuperarCarrinho();
});

// Verificar se está autenticado
async function verificarAutenticacao() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/status`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.autenticado) {
            usuarioAtual = data.usuario;

            // Se for admin, redirecionar para admin
            if (data.usuario === 'admin') {
                window.location.href = '/admin';
            }
        }
        // Permitir acesso sem autenticação
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Permitir acesso mesmo em caso de erro
    }
}

// Carregar produtos da API
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`, {
            credentials: 'include'
        });
        const data = await response.json();
        produtosDisponiveis = data;
        renderizarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Renderizar grid de produtos
function renderizarProdutos() {
    const container = document.getElementById('produtos');
    container.innerHTML = '';

    if (produtosDisponiveis.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Nenhum produto disponível</p>';
        return;
    }

    produtosDisponiveis.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        
        const imagemUrl = produto.img || 'https://via.placeholder.com/250?text=Sem+Imagem';

        card.innerHTML = `
            <div class="produto-imagem">
                <img src="${imagemUrl}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/250?text=Sem+Imagem'">
            </div>
            <div class="produto-info">
                <div class="produto-nome">${produto.nome}</div>
                <div class="produto-preco">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
                
                <div class="produto-tamanhos">
                    <button class="tamanho-btn" data-tamanho="P" data-produto-id="${produto.id}">P</button>
                    <button class="tamanho-btn" data-tamanho="M" data-produto-id="${produto.id}">M</button>
                    <button class="tamanho-btn" data-tamanho="G" data-produto-id="${produto.id}">G</button>
                </div>
                
                <div class="produto-estoque">
                    P: ${produto.tamanhos.P} | M: ${produto.tamanhos.M} | G: ${produto.tamanhos.G}
                </div>
                
                <button class="btn-adicionar" data-produto-id="${produto.id}">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;

        container.appendChild(card);

        // Configurar seleção de tamanho
        const btsTamanho = card.querySelectorAll('.tamanho-btn');
        btsTamanho.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btsTamanho.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Configurar botão adicionar
        const btnAdicionar = card.querySelector('.btn-adicionar');
        btnAdicionar.addEventListener('click', () => adicionarAoCarrinho(produto));
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    const card = document.querySelector(`[data-produto-id="${produto.id}"]`).closest('.produto-card');
    const tamanhoBtn = card.querySelector('.tamanho-btn.selected');

    if (!tamanhoBtn) {
        alert('Selecione um tamanho!');
        return;
    }

    const tamanho = tamanhoBtn.dataset.tamanho;
    if (produto.tamanhos[tamanho] <= 0) {
        alert(`Tamanho ${tamanho} fora de estoque`);
        return;
    }

    // Verificar se produto já está no carrinho
    const existe = carrinho.find(
        item => item.id === produto.id && item.tamanho === tamanho
    );

    if (existe) {
        existe.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: parseFloat(produto.preco),
            tamanho: tamanho,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    alert(`${produto.nome} (${tamanho}) adicionado ao carrinho!`);
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    document.getElementById('carrinhoCount').textContent = totalItens;
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho_smg', JSON.stringify(carrinho));
}

// Recuperar carrinho do localStorage
function recuperarCarrinho() {
    const salvo = localStorage.getItem('carrinho_smg');
    if (salvo) {
        carrinho = JSON.parse(salvo);
        atualizarContadorCarrinho();
    }
}

// Configurar eventos globais
function configurarEventos() {
    // Botão carrinho
    document.getElementById('carrinhoBtn').addEventListener('click', () => {
        abrirModalCarrinho();
    });

    // Botão meus pedidos
    document.getElementById('pedidosBtn').addEventListener('click', () => {
        carregarMeusPedidos();
    });

    // Botão logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await fetch(`${API_URL}/usuarios/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.removeItem('carrinho_smg');
        window.location.href = '/';
    });

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

    // Configurar botão de calcular frete
    const calcularFreteBtn = document.getElementById('calcularFreteBtn');
    calcularFreteBtn.addEventListener('click', () => {
        const modal = document.getElementById('freteModal');
        modal.classList.add('active');

        const calcularFreteSubmit = document.getElementById('calcularFreteSubmit');
        calcularFreteSubmit.addEventListener('click', calcularFrete);
    });
}

// Abrir modal carrinho
function abrirModalCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    const container = document.getElementById('carrinhoItens');
    
    if (carrinho.length === 0) {
        container.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    } else {
        container.innerHTML = '';
        let total = 0;

        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'carrinho-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <div class="item-nome">${item.nome}</div>
                    <div class="item-detalhes">Tamanho: ${item.tamanho} | Qtd: ${item.quantidade}</div>
                </div>
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
                <button class="btn-danger" onclick="removerDoCarrinho(${index})">Remover</button>
            `;
            container.appendChild(itemEl);
        });

        // Verificar se há frete selecionado
        const freteSelecionado = JSON.parse(localStorage.getItem('frete_selecionado') || 'null');
        let totalComFrete = total;
        
        if (freteSelecionado) {
            totalComFrete = total + freteSelecionado.preco;
        }

        document.getElementById('carrinhoTotal').textContent = totalComFrete.toFixed(2);
    }

    modal.classList.add('active');

    // Botão finalizar compra
    const btnFinalizar = document.getElementById('finalizarCompraBtn');
    btnFinalizar.onclick = finalizarCompra;
}

// Remover item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarContadorCarrinho();
    abrirModalCarrinho();
}

// Finalizar compra
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }

    // Pedir CEP ao cliente
    const cepInput = prompt('Por favor, digite seu CEP (8 dígitos):', '');
    
    if (cepInput === null) {
        // Usuário clicou em cancelar
        return;
    }

    const cepLimpo = cepInput.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        alert('CEP inválido! Digite 8 dígitos numerados.');
        return;
    }

    // Mostrar carregando
    const originalText = 'Finalizando compra...';
    const btnFinalizar = document.getElementById('finalizarCompraBtn');
    const textOriginal = btnFinalizar.textContent;
    btnFinalizar.textContent = '⏳ Calculando frete...';
    btnFinalizar.disabled = true;

    try {
        // Calcular frete
        const responseFrente = await fetch(`${API_URL}/frete/calcular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cep: cepLimpo, peso: 5 })
        });

        const dataFrete = await responseFrente.json();

        if (!dataFrete.sucesso) {
            alert('Erro ao calcular frete: ' + (dataFrete.erro || 'CEP não encontrado'));
            btnFinalizar.textContent = textOriginal;
            btnFinalizar.disabled = false;
            return;
        }

        // Mostrar opções de frete
        btnFinalizar.textContent = 'Selecione o frete';
        
        let selecaoFrete = null;
        
        // Criar uma interface para seleção de frete
        mostrarModalSelecaoFrete(dataFrete.opcoes, (freteEscolhido) => {
            selecaoFrete = freteEscolhido;
            
            // Fechar modal e finalizar
            finalizarCompraComFrete(cepLimpo, dataFrete.regiao, selecaoFrete);
            
            btnFinalizar.textContent = textOriginal;
            btnFinalizar.disabled = false;
        }, () => {
            // Usuário cancelou
            btnFinalizar.textContent = textOriginal;
            btnFinalizar.disabled = false;
        });

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao calcular frete. Tente novamente.');
        btnFinalizar.textContent = textOriginal;
        btnFinalizar.disabled = false;
    }
}

// Mostrar modal de seleção de frete
function mostrarModalSelecaoFrete(opcoes, callback, onCancel) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    // Criar modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 30px;
        max-width: 500px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
        <h2 style="color: #000000; margin-bottom: 20px; font-size: 22px;">Selecione a Opção de Frete</h2>
        <div id="fretoOpcoes" style="margin-bottom: 20px;"></div>
        <div style="text-align: right; gap: 10px; display: flex; justify-content: flex-end;">
            <button id="cancelarFrete" class="btn-secundario" style="padding: 10px 20px; cursor: pointer; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 5px; color: #000000;">Cancelar</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const opcoesContainer = document.getElementById('fretoOpcoes');
    
    opcoes.forEach(opcao => {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: 0.3s;
        `;
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="color: #000000; font-size: 16px;">${opcao.tipo}</strong><br>
                    <small style="color: #666666;">${opcao.descricao}</small>
                </div>
                <div style="text-align: right;">
                    <strong style="font-size: 18px; color: #000000;">R$ ${opcao.preco.toFixed(2)}</strong>
                </div>
            </div>
        `;
        
        div.addEventListener('mouseover', () => {
            div.style.borderColor = '#000000';
            div.style.backgroundColor = '#f9f9f9';
        });
        
        div.addEventListener('mouseout', () => {
            div.style.borderColor = '#e0e0e0';
            div.style.backgroundColor = 'transparent';
        });
        
        div.addEventListener('click', () => {
            overlay.remove();
            callback(opcao);
        });
        
        opcoesContainer.appendChild(div);
    });

    // Botão cancelar
    const btnCancelar = document.getElementById('cancelarFrete');
    btnCancelar.addEventListener('click', () => {
        overlay.remove();
        onCancel();
    });
}

// Finalizar compra com frete selecionado
async function finalizarCompraComFrete(cep, regiao, frete) {
    let mensagem = '🛒 *NOVO PEDIDO SMG MERCH*\n\n';
    
    // Dados do cliente
    mensagem += `📍 *Endereço de Entrega:*\n`;
    mensagem += `CEP: ${cep}\n`;
    mensagem += `Cidade: ${regiao.cidade}\n`;
    mensagem += `Estado: ${regiao.estado}\n`;
    mensagem += `Região: ${regiao.regiao}\n\n`;
    
    // Itens do pedido
    mensagem += `📦 *Itens do Pedido:*\n`;
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.nome}\n`;
        mensagem += `  └─ Tamanho: ${item.tamanho} | Qtd: ${item.quantidade} | R$ ${subtotal.toFixed(2)}\n`;
    });

    // Informações de frete
    mensagem += `\n🚚 *Opção de Entrega:*\n`;
    mensagem += `${frete.tipo} - R$ ${frete.preco.toFixed(2)}\n`;
    mensagem += `Prazo: ${frete.diasEntrega} dia(s)\n`;

    // Subtotal e total
    const subtotal = total;
    total += frete.preco;
    
    mensagem += `\n💰 *Resumo Financeiro:*\n`;
    mensagem += `Subtotal (produtos): R$ ${subtotal.toFixed(2)}\n`;
    mensagem += `Frete (${frete.tipo}): R$ ${frete.preco.toFixed(2)}\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `✅ *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    
    mensagem += `Por favor, confirme seu pedido respondendo a esta mensagem com SIM!`;

    // Enviar via WhatsApp
    const telefone = '5511976754392';
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Limpar carrinho e localStorage
    carrinho = [];
    salvarCarrinho();
    atualizarContadorCarrinho();
    localStorage.removeItem('frete_selecionado');

    // Fechar modal
    document.getElementById('carrinhoModal').classList.remove('active');
    
    // Abrir WhatsApp
    window.open(url, '_blank');
    
    alert('✅ Sua compra foi enviada para o WhatsApp!\n\nAguarde um resposta da SMG Merch para confirmar seu pedido. Obrigado!');
}

// Calcular frete com preços regionalizados dos Correios
async function calcularFrete() {
    const cep = document.getElementById('cepFrete').value;
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/frete/calcular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cep, peso: 5 })
        });

        const data = await response.json();

        if (!data.sucesso) {
            alert('Erro: ' + (data.erro || 'CEP não encontrado'));
            return;
        }

        // Mostrar informações da região
        const regiao = data.regiao;
        const opcoesContainer = document.getElementById('opcoesFrete');
        opcoesContainer.innerHTML = '';

        // Criar cards de opções de frete
        const headerRegiao = document.createElement('div');
        headerRegiao.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;';
        headerRegiao.innerHTML = `
            <strong>${regiao.cidade}, ${regiao.estado}</strong><br>
            <small>Região: ${regiao.regiao}</small>
        `;
        opcoesContainer.appendChild(headerRegiao);

        // Adicionar opções de frete
        data.opcoes.forEach(opcao => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 12px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; cursor: pointer; transition: 0.3s;';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${opcao.tipo}</strong><br>
                        <small>${opcao.descricao}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong style="font-size: 18px; color: #000;">R$ ${opcao.preco.toFixed(2)}</strong><br>
                        <small>${opcao.diasEntrega} dia(s)</small>
                    </div>
                </div>
            `;
            
            div.addEventListener('mouseover', () => {
                div.style.backgroundColor = '#f9f9f9';
                div.style.borderColor = '#000';
            });
            
            div.addEventListener('mouseout', () => {
                div.style.backgroundColor = 'transparent';
                div.style.borderColor = '#ddd';
            });

            div.addEventListener('click', () => {
                selecionarFrete(opcao);
            });

            opcoesContainer.appendChild(div);
        });

        document.getElementById('resultadoFrete').style.display = 'block';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao calcular frete. Tente novamente mais tarde.');
    }
}

// Selecionar opção de frete
function selecionarFrete(opcao) {
    // Armazenar frete selecionado
    localStorage.setItem('frete_selecionado', JSON.stringify(opcao));
    alert(`${opcao.tipo} selecionado! Prazo: ${opcao.diasEntrega} dia(s) - R$ ${opcao.preco.toFixed(2)}`);
}

// Carregar meus pedidos
async function carregarMeusPedidos() {
    try {
        const response = await fetch(`${API_URL}/pedidos/meus-pedidos`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar pedidos');
        }

        const pedidos = await response.json();
        const modal = document.getElementById('pedidosModal');
        const container = document.getElementById('pedidosList');

        if (pedidos.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Você não tem pedidos ainda</div>';
        } else {
            container.innerHTML = '';
            pedidos.forEach(pedido => {
                const card = document.createElement('div');
                card.className = 'pedido-card';
                card.innerHTML = `
                    <div class="pedido-header">
                        <div>
                            <div class="pedido-id">Pedido #${pedido.id}</div>
                            <div class="pedido-data">${new Date(pedido.data).toLocaleDateString('pt-BR')}</div>
                        </div>
                        <div class="pedido-total">R$ ${parseFloat(pedido.total).toFixed(2)}</div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    exibirDetalhesPedido(pedido);
                });
                container.appendChild(card);
            });
        }

        modal.classList.add('active');
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// Exibir detalhes do pedido
function exibirDetalhesPedido(pedido) {
    const modal = document.getElementById('pedidoDetalheModal');
    const container = document.getElementById('pedidoDetalhe');

    let htmlProdutos = '';
    let total = 0;

    pedido.produtos.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
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
            <p>Data: ${new Date(pedido.data).toLocaleDateString('pt-BR')} ${new Date(pedido.data).toLocaleTimeString('pt-BR')}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Produtos:</h4>
            ${htmlProdutos}
        </div>
        <div style="border-top: 2px solid #e0e0e0; padding-top: 20px; font-size: 18px; font-weight: 600;">
            Total do Pedido: R$ ${parseFloat(pedido.total).toFixed(2)}
        </div>
    `;

    // Fechar modal anterior
    document.getElementById('pedidosModal').classList.remove('active');
    modal.classList.add('active');
}
