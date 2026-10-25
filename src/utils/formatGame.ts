import { fetchDolarPrice } from "./fetchDolar";
import { Dolar } from "../types/dolar";
import { officialTaxes, mepTaxes } from "../config/taxes";

// Helpers
function calculatePrice(basePrice: number, rate: number, taxes: number[]): number {
  const totalTaxRate = taxes.reduce((acc, tax) => acc + tax, 0);
  return parseFloat((basePrice * (1 + totalTaxRate) * rate).toFixed(2));
}

function formatTitle(optionText: string): string {
  return optionText
    .replace(/[^a-zA-Z0-9\s\-\.\:]/g, "")
    .split(" - span")[0];
}

function filterSubs(subs: any[]): any[] {
  return subs.filter((sub) => !sub.option_text.includes("Commercial License"));
}

// Main function
export const formatGame = async (games: any) => {
  const dolar: Dolar[] | null = await fetchDolarPrice();
  if (!dolar) return null;

  const [oficial, mep, crypto] = dolar;

  const {
    steam_appid,
    name,
    is_free,
    type,
    header_image,
    price_overview,
    package_groups,
    short_description,
  } = games;

  const gameData = {
    id: steam_appid,
    name,
    isFree: is_free,
    type,
    headerImage: header_image,
    description: short_description,
    priceOverview: {
      initial: price_overview.initial / 100,
      initialARS: calculatePrice(
        price_overview.initial / 100,
        oficial.venta,
        officialTaxes
      ),
      final: price_overview.final / 100,
      priceOficial: calculatePrice(
        price_overview.final / 100,
        oficial.venta,
        officialTaxes
      ),
      priceMep: calculatePrice(price_overview.final / 100, mep.venta, mepTaxes),
      priceCrypto: (
        (price_overview.final / 100) *
        crypto.venta
      ).toFixed(2),
      discount: price_overview.discount_percent > 0,
      discountPercent: price_overview.discount_percent,
    },
    packageGroups: package_groups.map((item: any) => ({
      title: item.title.split(" ").slice(1).join(" "),
      subs: filterSubs(item.subs).map((sub: any) => {
        const { packageid, percent_savings_text, option_text, price_in_cents_with_discount } = sub;

        return {
          id: packageid,
          title: formatTitle(option_text),
          price: price_in_cents_with_discount / 100,
          priceOficial: calculatePrice(
            price_in_cents_with_discount / 100,
            oficial.venta,
            officialTaxes
          ),
          priceMep: calculatePrice(
            price_in_cents_with_discount / 100,
            mep.venta,
            mepTaxes
          ),
          priceCrypto: (
            (price_in_cents_with_discount / 100) *
            crypto.venta
          ).toFixed(2),
          discount: percent_savings_text.replace(/[^0-9]/g, ""),
        };
      }),
    })),
  };

  return gameData;
};
