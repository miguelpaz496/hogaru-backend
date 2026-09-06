import { Router, Response } from 'express';
import { authenticate, isAdmin, AuthRequest } from '../middlewares/auth';
import {
  createHousehold,
  findHouseholdById,
  findHouseholdsByUserId,
  addMemberToHousehold,
  removeMemberFromHousehold,
  findAllUsers
} from '../repositories/household.repository';

const router = Router();

// GET /households — hogares del usuario autenticado
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const households = await findHouseholdsByUserId(req.userId!);
    res.json(households);
  } catch {
    res.status(500).json({ error: 'Error getting households' });
  }
});

// GET /households/:id — detalle de un hogar
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const household = await findHouseholdById(Number(req.params.id));
    if (!household) return res.status(404).json({ error: 'Household not found' });
    res.json(household);
  } catch {
    res.status(500).json({ error: 'Error getting household' });
  }
});

// POST /households — crear hogar (solo admin)
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const household = await createHousehold(name, req.userId!);
    res.status(201).json(household);
  } catch {
    res.status(500).json({ error: 'Error creating household' });
  }
});

// POST /households/:id/members — agregar miembro (solo admin)
router.post('/:id/members', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const member = await addMemberToHousehold(Number(userId), Number(req.params.id));
    res.status(201).json(member);
  } catch {
    res.status(500).json({ error: 'Error adding member' });
  }
});

// DELETE /households/:id/members/:userId — eliminar miembro (solo admin)
router.delete('/:id/members/:userId', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await removeMemberFromHousehold(Number(req.params.userId), Number(req.params.id));
    res.json({ message: 'Member removed' });
  } catch {
    res.status(500).json({ error: 'Error removing member' });
  }
});

// GET /households/users/all — lista de usuarios (solo admin)
router.get('/users/all', authenticate, isAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Error getting users' });
  }
});

export default router;