import rateLimit from 'express-rate-limit';

// 🔒 Rate Limiting - proteção contra força bruta e DDoS

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: true
});
