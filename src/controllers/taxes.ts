import { Request, Response, Router } from "express";
import { gamesAndServicesTaxes } from "../config/taxes";
import { setCache } from "../utils/cacheControl";

const router = Router();

const taxes = {
  gamesAndServices: gamesAndServicesTaxes,
};

router.get("/", (_req, res) => {
  setCache(res, "taxes");
  res.json(taxes);
});

router.get("/gamesAndServices", (_req: Request, res: Response) => {
  setCache(res, "taxes");
  res.json(taxes.gamesAndServices);
});

export default router;
