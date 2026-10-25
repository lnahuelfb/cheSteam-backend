/**
 * Single source of truth for the tax rates applied to Steam prices.
 * Change them here and nowhere else.
 *
 * IIBB (provincial gross income tax) varies by jurisdiction: 2% in CABA,
 * 3% in Buenos Aires province. The app does not know the user's location,
 * so it uses the CABA rate for everyone.
 *
 * Which taxes apply to each exchange rate:
 *  - Official: IVA + IIBB
 *  - MEP:      IVA only
 *  - Crypto:   none
 */
export const IVA = 0.21;
export const IIBB = 0.02;

export const officialTaxes: number[] = [IVA, IIBB];
export const mepTaxes: number[] = [IVA];
export const cryptoTaxes: number[] = [];

/** Shape served by `GET /api/taxes`. */
export const gamesAndServicesTaxes = [
  { tax: "IVA", percentage: IVA },
  { tax: "IIBB", percentage: IIBB },
];
