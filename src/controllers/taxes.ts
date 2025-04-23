import { Request, Response, Router } from "express";

const router = Router();

const taxes = {
  gamesAndServices: [{
    tax: "IVA",
    percentage: 0.21,
  }, {
    tax: "IIBB",
    percentage: 0.03,
  }]
}

router.get("/", (_req, res) => {
  res.json(taxes);
});

router.get("/gamesAndServices", (_req: Request, res: Response) => {
  res.json(taxes.gamesAndServices);
});

export default router;
