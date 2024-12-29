import { Request, Response, Router } from "express";

const router = Router();

const taxes = {
  gamesAndServices: {
    IVA: 0.21,
    IIBB: 0.03,
    Ganancias: 0.30,
  },
}

router.get("/", (_req: Request, res: Response) => {
  res.json(taxes);
});

router.get("/gamesAndServices", (_req: Request, res: Response) => {
  res.json(taxes.gamesAndServices);
});

export default router;