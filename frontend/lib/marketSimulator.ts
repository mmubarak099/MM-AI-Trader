type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};
export function generateMarketPrice(
  basePrice: number
) {

  const movement =
    (Math.random() - 0.5) * 50;


  const newPrice =
    basePrice + movement;

    const candle: Candle = {

  open: basePrice,

  close: Number(newPrice.toFixed(2)),

  high: Number(
    Math.max(basePrice, newPrice) +
      Math.random() * 10
  ),

  low: Number(
    Math.min(basePrice, newPrice) -
      Math.random() * 10
  ),

};


  const change =
    ((newPrice - basePrice) / basePrice) * 100;


  return {

  price: Number(newPrice.toFixed(2)),

  change: Number(change.toFixed(2)),

  candle,

};

}