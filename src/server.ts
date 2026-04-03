import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';

import usuarioRoutes from './routes/usuarioRoutes';
import produtoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import freteRoutes from './routes/freteRoutes';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'smg-merch-secret-key-2024',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS)
      maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
  })
);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/frete', freteRoutes);

// Verificar autenticação
app.get('/api/auth/status', (req: any, res) => {
  if (req.session?.usuarioId) {
    res.json({ 
      autenticado: true, 
      usuario: req.session.usuario 
    });
  } else {
    res.json({ autenticado: false });
  }
});

// Debug - verificar dados da sessão
app.get('/api/debug/session', (req: any, res) => {
  res.json({
    sessionId: req.sessionID,
    usuarioId: req.session?.usuarioId,
    usuario: req.session?.usuario,
    hasSession: !!req.session
  });
});

// Rota padrão - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cliente.html'));
});

app.get('/loja', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/loja.html'));
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor SMG Merch rodando em http://localhost:${PORT}`);
});
