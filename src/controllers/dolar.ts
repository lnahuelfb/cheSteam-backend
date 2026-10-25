import { Router } from "express";
import { fetchDolarPrice } from "../utils/fetchDolar";
import { setCache } from "../utils/cacheControl";

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const dolar = await fetchDolarPrice();

    if (dolar) {
      setCache(res, "dolar");
      res.json(dolar);
    } else {
      res.status(500).json({ error: 'No se pudo obtener el precio del dólar' });
    }

  } catch (error) {
    console.error('Error al obtener el precio del dólar:', error);
    res.status(500).json({ error: 'Error al obtener los datos del dólar' });
  }
});

router.get('/:tipo', async (req, res) => {
  const { tipo } = req.params;
  const tiposValidos = ['oficial', 'bolsa', 'cripto'];

  if (!tiposValidos.includes(tipo.toLowerCase())) {
    console.error("Tipo de dólar no válido:", tipo);
    return res.status(400).json({ error: `Tipo de dólar no válido: ${tipo}` });
  }

  try {
    const dolares = await fetchDolarPrice();

    if (dolares === null) {
      return res.status(500).json({ error: 'No se pudo obtener el precio del dólar' });
    }

    const dolarFiltrado = dolares.find((d) => d.casa.toLowerCase() === tipo.toLowerCase());

    if (!dolarFiltrado) {
      return res.status(404).json({ error: `No se encontró el tipo de dólar: ${tipo}` });
    }

    setCache(res, "dolar");
    return res.json(dolarFiltrado);
  } catch (error) {
    console.error("Error en la consulta de la API de dólares:", error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;