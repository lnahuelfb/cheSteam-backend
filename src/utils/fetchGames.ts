export const getGames = async (gameTitle: string) => {
  console.log('Obteniendo juegos...');
  console.log('Título del juego:', gameTitle);
  try {
    const response = await fetch(`https://store.steampowered.com/search/suggest?cc=AR&l=spanish&f=jsonfull&term=${encodeURIComponent(gameTitle)}`);

    console.log(response);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const filteredData = data.filter((item: any) => {
      const isRelevantType = item.type === "game" || item.type === "sub" || item.type === "dlc";
      const isNotFreeDlc = !(item.type === "dlc" && item.price === 'Gratuito');
      return isRelevantType && isNotFreeDlc;
    });

    if (filteredData.length === 0) {

      return null;
    }

    return filteredData;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return null;
  }
};
