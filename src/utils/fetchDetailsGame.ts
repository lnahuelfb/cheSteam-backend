import { formatGame } from './formatGame';
import { GameFetched } from '../types/games';

type CacheEntry = {
  data: any;
  timestamp: number;
};

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export const fetchDetailsGame = async (id: string) => {
  const currentTime = Date.now();

  // Verifica si el ID está en caché y si todavía es válido
  if (cache[id] && currentTime - cache[id].timestamp < CACHE_DURATION) {
    console.log('Cargando desde caché');
    return cache[id].data;
  }

  // Realiza la solicitud si no hay caché o está vencida
  const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`);
  const game: GameFetched = await res.json();

  const gameData = formatGame(game[id].data);
  const result = gameData.packageGroups[0].subs;

  // Almacena el resultado en caché
  cache[id] = {
    data: result,
    timestamp: currentTime,
  };

  return result;
};
