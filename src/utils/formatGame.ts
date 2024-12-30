export const formatGame = (games: any) => {

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
            discount
          }
        })
      }
    })
  }

  // console.log(gameData)

  return gameData;
}