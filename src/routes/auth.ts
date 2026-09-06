import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Inicia el flujo de Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failed' }),
  (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Temporal para pruebas — luego vuelve a la redirección
    res.json({ token, user });
  }
);

router.get('/failed', (_req: Request, res: Response) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;