import { Request, Response, Router } from "express";

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  res.json({ message: 'Hola!' });
})

export default router;
