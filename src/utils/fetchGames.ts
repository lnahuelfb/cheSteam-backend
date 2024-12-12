export const getGames = async (gameTitle: string) => {
  try {
    const response = await fetch(`https://store.steampowered.com/search/suggest?cc=AR&l=spanish&f=jsonfull&term=${encodeURIComponent(gameTitle)}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const relevantTypes = { game: true, sub: true, dlc: true, bundle: true };

const filteredData = data.filter((item: any) => {
  const isRelevantType = relevantTypes[item.type];
  const isNotFreeDlc = !(item.type === "dlc" && item.price === "Gratuito");
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
