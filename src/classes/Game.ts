export class Game {
  private id: number;
  private name: string;
  private price: number;
  private image: string;
  private type: string;
  private dolarPrice: number;
  private dolarMepPrice: number;
  private dolarCryptoPrice: number;

  private static officialTaxes: number[] = [0.21, 0.02];
  private static mepTaxes: number[] = [0.21];
  private static cryptoTaxes: number[] = [0];

  constructor(
    id: number,
    name: string,
    price: string,
    image: string,
    type: string,
    dolarPrice: number,
    dolarMepPrice: number,
    dolarCryptoPrice: number,
  ) {
    this.id = id;
    this.name = name;
    const cleanPrice = price.replace(/[^0-9.]+/g, "");
    if (price.includes("Free to Play") || price.includes("Gratuito")) {
      this.price = 0;
    } else {
      const numberPrice = parseFloat(cleanPrice);
      if (isNaN(numberPrice)) {
        throw new Error('El precio no tiene un formato válido');
      }
      this.price = numberPrice;
    }

    this.image = image;
    this.type = type;
    this.dolarPrice = dolarPrice;
    this.dolarMepPrice = dolarMepPrice;
    this.dolarCryptoPrice = dolarCryptoPrice;
  }

  private calculatePriceARS(rate: number): number {
    return parseFloat((this.price * rate).toFixed(2));
  }

  public getPriceARS(): number {
    return this.calculatePriceARS(this.dolarPrice);
  }

  public getPriceARS_Mep(): number {
    return this.calculatePriceARS(this.dolarMepPrice);
  }

  public getPriceARS_Crypto(): number {
    return this.calculatePriceARS(this.dolarCryptoPrice);
  }

  public getImage(): string {
    return this.image;
  }

  public getId(): number {
    return this.id;
  }

  public getType(): string {
    return this.type;
  }

  private calculateTotalTaxes(priceARS: number, taxes: number[]): number {
    const totalTaxRate = taxes.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((priceARS * totalTaxRate).toFixed(2));
  }

  public getOfficialTaxes(): number {
    return this.calculateTotalTaxes(this.getPriceARS(), Game.officialTaxes);
  }

  public getMepTaxes(): number {
    return this.calculateTotalTaxes(this.getPriceARS_Mep(), Game.mepTaxes);
  }

  public getCryptoTaxes(): number {
    return this.calculateTotalTaxes(this.getPriceARS_Crypto(), Game.cryptoTaxes);
  }

  private formatCurrency(value: number): string {
    return `$ ${value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  public formattedPrice(): string {
    return this.price === 0 ? "Gratis" : this.formatCurrency(this.price);
  }

  public formattedTotalOfficialPrice(): string {
    return this.formatCurrency(this.getPriceARS() + this.getOfficialTaxes());
  }

  public formattedTotalMepPrice(): string {
    return this.formatCurrency(this.getPriceARS_Mep() + this.getMepTaxes());
  }

  public formattedTotalCryptoPrice(): string {
    return this.formatCurrency(this.getPriceARS_Crypto() + this.getCryptoTaxes());
  }

  public formattedOfficialTaxes(): string {
    return this.formatCurrency(this.getOfficialTaxes());
  }

  public formattedMepTaxes(): string {
    return this.formatCurrency(this.getMepTaxes());
  }

  public formattedCryptoTaxes(): string {
    return this.formatCurrency(this.getCryptoTaxes());
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getResponse(): string {
    return `
 **:flag_ar: Precios en ARS (Impuestos incluidos):**
 **:dollar: Oficial:** ${this.formattedTotalOfficialPrice()} (Impuestos: ${this.formattedOfficialTaxes()}) 
 **:moneybag: MEP:** ${this.formattedTotalMepPrice()} (Impuestos: ${this.formattedMepTaxes()})
 **:coin: Cripto:** ${this.formattedTotalCryptoPrice()} (Impuestos: ${this.formattedCryptoTaxes()})

**:flag_us: Precio en USD:** ${this.formattedPrice()}`;
  }
}
