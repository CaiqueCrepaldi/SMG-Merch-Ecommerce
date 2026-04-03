import express, { Response, Router } from 'express';
import FreteController from '../controllers/freteController';

const router = Router();

// Calcular frete por CEP
router.post('/calcular', async (req: any, res: Response) => {
  try {
    const { cep, peso } = req.body;

    if (!cep) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'CEP é obrigatório' 
      });
    }

    const resultado = await FreteController.calcularFrete(cep, peso || 5);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    res.json(resultado);
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    res.status(500).json({ 
      sucesso: false,
      erro: error.message 
    });
  }
});

export default router;
