import { Request, Response, Router } from "express";
import { Game } from "../classes/Game";
import { getGames } from "../utils/fetchGames";
import { Dolar } from "../types/dolar";
import { fetchDolarPrice } from "../utils/fetchDolar";
import { fetchDetailsGame } from "../utils/fetchDetailsGame";
import { setCache } from "../utils/cacheControl";

const router = Router();

interface Params {
  gameTitle?: string;
}

interface Games {
  id: number;
  type: string;
  name: string;
  price: string;
  img: string;
  small_cap: string;
}

router.get('/:gameTitle', async (req, res) => {
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

    const gamesList = games.filter(game => game.price && game.price.trim() !== "")
      .map(game => {
        const gameInstance = new Game(game.id, game.name, game.price, game.small_cap, game.type, oficial.venta, mep.venta, crypto.venta);

        return {
          id: gameInstance.getId(),
          name: gameInstance.getName(),
          image: gameInstance.getImage(),
          type: gameInstance.getType(),
          formattedPrice: gameInstance.formattedPrice(),
          formattedTotalOfficialPrice: gameInstance.formattedTotalOfficialPrice(),
          formattedTotalMepPrice: gameInstance.formattedTotalMepPrice(),
          formattedTotalCryptoPrice: gameInstance.formattedTotalCryptoPrice(),
          formattedOfficialTaxes: gameInstance.formattedOfficialTaxes(),
          formattedMepTaxes: gameInstance.formattedMepTaxes(),
          formattedCryptoTaxes: gameInstance.formattedCryptoTaxes(),
        };
      });

    setCache(res, "games");
    return res.json(gamesList);
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})

router.get('/details/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'El id del juego no puede ser vacío' });
  }

  try {
    const game = await fetchDetailsGame(id);

    setCache(res, "games");
    return res.json(game);
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

})

export default router;