export const getGames = async (gameTitle: string) => {
  try {
    const title = encodeURIComponent(gameTitle);
    const response = await fetch(`https://store.steampowered.com/search/suggest?cc=AR&l=spanish&f=jsonfull&term=${title}`);

    if (!response.ok) {
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

    return filteredData;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return null;
  }
};
