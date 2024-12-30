import { fetchDolarPrice } from "./fetchDolar"
import { Dolar } from "../types/dolar"

export const formatGame = async (games: any) => {

  const dolar: Dolar[] | null = await fetchDolarPrice();

  if (!dolar) {
    return null;
  }

  const [oficial, mep, crypto] = dolar;

  const taxes = {
    gamesAndServices: {
      IVA: 0.21,
      IIBB: 0.03,
      Ganancias: 0.30,
    },
  }

  const {
    steam_appid,
    name,
    is_free,
    type,
    header_image,
    price_overview,
    package_groups,
    short_description
  } = games

  let gameData = {
    id: steam_appid,
    name,
    isFree: is_free,
    type,
    headerImage: header_image,
    description: short_description,
    priceOverview: price_overview,
    packageGroups: package_groups,
  }

  gameData.priceOverview = {
    initial: gameData.priceOverview.initial / 100,
    final: gameData.priceOverview.final / 100,
    finalOficial: gameData.priceOverview.final / 100 * oficial.venta,
    finalMep: gameData.priceOverview.final / 100 * mep.venta,
    finalCrypto: gameData.priceOverview.final / 100 * crypto.venta,
    discount: gameData.priceOverview.discount_percent === 0 ? false : true,
    discountPercent: gameData.priceOverview.discount_percent,
  }

  gameData = {
    ...gameData,
    packageGroups: gameData.packageGroups.map((item: any) => {
      let { title } = item

      title = title.split(' ').slice(1).join(' ')

      return {
        title,
        subs: item.subs.map((sub: any) => {
          let { packageid, percent_savings_text, option_text, price_in_cents_with_discount } = sub

          const discount = percent_savings_text.toString().replace(/[^0-9]/g, '')

          const title = option_text.split(' - ')[0]
          const price = price_in_cents_with_discount / 100

          return {
            id: packageid,
            title,
            price,
            priceOficial: price * oficial.venta,
            priceMep: price * mep.venta,
            priceCrypto: price * crypto.venta,
            discount
          }
        })
      }
    })
  }

  // console.log(gameData)

  return gameData;
}