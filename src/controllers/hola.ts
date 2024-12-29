import { Request, Response, Router } from "express";

const router = Router();

router.get('/', async (_req, res) => {
  res.json({ message: 'Hola!' });
})

export default router;
