import { Resend } from 'resend';

export async function enviarEmailRecuperacao(
  email: string,
  nomeUsuario: string,
  token: string
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/reset-senha?token=${token}`;

  const { error } = await resend.emails.send({
    from: 'SMG Merch <onboarding@resend.dev>',
    to: email,
    subject: 'Recuperação de Senha - SMG Merch',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #111; padding: 30px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px; }
          .header p { color: #aaa; margin: 5px 0 0; font-size: 13px; }
          .body { padding: 35px 30px; }
          .body h2 { color: #111; margin: 0 0 15px; }
          .body p { color: #444; line-height: 1.6; margin: 0 0 20px; }
          .btn { display: block; width: fit-content; margin: 0 auto 25px; padding: 14px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 15px; }
          .warning { background: #fff8e1; border-left: 4px solid #f9a825; padding: 12px 15px; border-radius: 4px; font-size: 13px; color: #555; margin-bottom: 20px; }
          .footer { background: #f4f4f4; padding: 15px 30px; text-align: center; font-size: 12px; color: #999; }
          .link-alt { word-break: break-all; color: #555; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SMG MERCH</h1>
            <p>Sua loja de merchandising</p>
          </div>
          <div class="body">
            <h2>Recuperação de Senha</h2>
            <p>Olá, <strong>${nomeUsuario}</strong>! Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <a href="${resetUrl}" class="btn">Redefinir Minha Senha</a>
            <div class="warning">
              ⏰ Este link expira em <strong>1 hora</strong>. Se não solicitou a recuperação, ignore este email — sua senha permanece a mesma.
            </div>
            <p>Se o botão não funcionar, copie e cole este link no navegador:</p>
            <p class="link-alt">${resetUrl}</p>
          </div>
          <div class="footer">
            &copy; 2026 SMG Merch. Todos os direitos reservados.
          </div>
        </div>
      </body>
      </html>
    `
  });

  if (error) {
    throw new Error(`Falha ao enviar email: ${error.message}`);
  }
}
