import { Request, Response, Router } from "express";

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  res.json({ message: 'Tu nariz contra mis bolas!' });
})

export default router;