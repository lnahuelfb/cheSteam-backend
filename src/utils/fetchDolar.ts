import axios from "axios";
import { Dolar } from "../types/dolar";

let cachedDolarPrice: [Dolar, Dolar, Dolar] | null = null;
let lastFetchTime: number = 0;

export const fetchDolarPrice = async (): Promise<[Dolar, Dolar, Dolar] | null> => {
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  const now = Date.now();

  if (cachedDolarPrice && now - lastFetchTime < CACHE_DURATION) {
    return cachedDolarPrice;
  }

  try {
    const response = await axios.get<Dolar[]>('https://dolarapi.com/v1/dolares');
    const data = response.data;

    // Filtramos los tipos de dólares relevantes
    const dolaresFiltrados = data.filter((dolar) =>
      ["oficial", "bolsa", "cripto"].includes(dolar.casa.toLowerCase())
    );

    if (dolaresFiltrados.length !== 3) {
      console.warn("No se encontraron los tres tipos de dólares esperados.");
      return null;
    }

    cachedDolarPrice = [
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "oficial")!,
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "bolsa")!,
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "cripto")!
    ];
    lastFetchTime = now;

    return cachedDolarPrice;
  } catch (error: any) {
    console.error("Error al obtener el precio del dólar:", error.message || error);
    return null;
  }
};
