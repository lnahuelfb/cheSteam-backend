import { Request, Response, Router } from "express";
import { Game } from "../classes/Game";
import { getGames } from "../utils/fetchGames";
import { Dolar } from "../types/dolar";
import { fetchDolarPrice } from "../utils/fetchDolar";

const router = Router();

interface Params {
  gameTitle: string;
}

interface Games {
  id: number;
  type: string;
  name: string;
  price: string;
  img: string;
  small_cap: string;
}

router.get('/:gameTitle', async (req: Request<Params>, res: Response) => {
  const { gameTitle } = req.params;

  if (!gameTitle) {
    return res.status(400).json({ error: 'El título del juego no puede ser vacío' });
  }

  try {
    const games: Games[] = await getGames(gameTitle);
    const dolar: Dolar[] | null = await fetchDolarPrice();

    if (!dolar) {
      return res.status(500).json({ error: 'No se pudieron obtener los precios del dólar' });
    }

    const [oficial, mep, crypto] = dolar;

    if (!games) {
      return res.status(500).json({ error: 'No se pudieron obtener los juegos' });
    }

    const gamesList = games.map(game => {
      const gameInstance = new Game(game.name, game.price, game.small_cap, oficial.venta, mep.venta, crypto.venta);
      
      return {
        name: gameInstance.getName(),
        image: gameInstance.getImage(),
        formattedPrice: gameInstance.formattedPrice(),
        formattedTotalOfficialPrice: gameInstance.formattedTotalOfficialPrice(),
        formattedTotalMepPrice: gameInstance.formattedTotalMepPrice(),
        formattedTotalCryptoPrice: gameInstance.formattedTotalCryptoPrice(),
        formattedOfficialTaxes: gameInstance.formattedOfficialTaxes(),
        formattedMepTaxes: gameInstance.formattedMepTaxes(),
        formattedCryptoTaxes: gameInstance.formattedCryptoTaxes(),
      };
    });

    return res.json(gamesList);
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})

export default router;