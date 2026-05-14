import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';

import usuarioRoutes from './routes/usuarioRoutes';
import produtoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import freteRoutes from './routes/freteRoutes';
import { limiter, loginLimiter } from './config/limiters';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  console.error('ERRO FATAL: SESSION_SECRET não definido no arquivo .env');
  process.exit(1);
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rate limiting global nas rotas da API
app.use('/api/', limiter);

// Rate limiting específico para login
app.use('/api/usuarios/login', loginLimiter);

// Rotas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/frete', freteRoutes);

// Status de autenticação
app.get('/api/auth/status', (req: any, res) => {
  if (req.session?.usuarioId) {
    res.json({ autenticado: true, usuario: req.session.usuario });
  } else {
    res.json({ autenticado: false });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas do frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/auth.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin.html'));
});
app.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/cliente.html'));
});
app.get('/loja', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/loja.html'));
});

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor SMG Merch rodando em http://localhost:${PORT}`);
});
