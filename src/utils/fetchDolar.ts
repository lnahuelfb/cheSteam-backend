import axios from "axios";
import { Dolar } from "../types/dolar";

export const fetchDolarPrice = async (): Promise<[Dolar, Dolar, Dolar] | null> => {
  try {
    const response = await axios.get<Dolar[]>('https://dolarapi.com/v1/dolares');
  
    const data = response.data;

    // Filtramos los tipos de dólares relevantes
    const dolaresFiltrados = data.filter((dolar) =>
      ["oficial", "bolsa", "cripto"].includes(dolar.casa.toLowerCase())
    );

    // Si no hay 3 tipos, devolvemos null sin errores
    if (dolaresFiltrados.length !== 3) {
      console.warn("No se encontraron los tres tipos de dólares esperados.");
      return null;
    }

    // Devolvemos los tres tipos de dólares, independientemente de otros valores
    return [
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "oficial")!,
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "bolsa")!,
      dolaresFiltrados.find((d) => d.casa.toLowerCase() === "cripto")!
    ];
  } catch (error: any) {
    console.error("Error al obtener el precio del dólar:", error.message || error);
    // Devolvemos null si ocurre cualquier error, pero evitamos fallos críticos
    return null;
  }
};
