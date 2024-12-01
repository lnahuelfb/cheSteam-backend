import { Request, Response, Router } from "express";
import { getGames } from "../utils/fetchGames";

const router = Router();

interface Params {
  gameTitle: string;
}

router.get('/:gameTitle', async (req: Request<Params>, res: Response) => {
  const { gameTitle } = req.params;

  if (!gameTitle) {
    return res.status(400).json({ error: 'El título del juego no puede ser vacío' });
  }

  try {
    const games = await getGames(gameTitle);

    if (!games) {
      return res.status(500).json({ error: 'No se pudieron obtener los juegos' });
    }

    return res.json(games);
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})

export default router;