import axios from 'axios';
import { formatGame } from './formatGame';
import { GameFetched } from '../types/games';

interface CachedGameData {
  data: any;
  timestamp: number;
}

const gameCache: { [key: string]: CachedGameData } = {};
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export const getGames = async (gameTitle: string) => {
  try {
    // Verificar si los datos del juego están en caché y no han expirado
    const cachedData = gameCache[gameTitle];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_TIME) {
      console.log("Cargando desde caché");
      return cachedData.data;
    }

    const title = encodeURIComponent(gameTitle);
    const response = await fetch(`https://store.steampowered.com/search/suggest?cc=AR&l=spanish&f=jsonfull&term=${title}`);

    if (!response?.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const relevantTypes = new Set(["game", "sub", "dlc", "bundle"]);

    const filteredData = data.filter((item: any) => {
      const isRelevantType = relevantTypes.has(item.type);
      const isNotFreeDlc = !(item.type === "dlc" && item.price === "Gratuito" || item.type === "dlc" && item.price === "Free to Play");
      return isRelevantType && isNotFreeDlc;
    });

    if (filteredData.length === 0) {
      return null;
    }

    // Almacenar los datos en caché con la fecha actual
    gameCache[gameTitle] = {
      data: filteredData,
      timestamp: Date.now(),
    };

    return filteredData;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return null;
  }
};