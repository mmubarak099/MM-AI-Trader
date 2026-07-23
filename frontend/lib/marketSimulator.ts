export function generateMarketPrice(
  basePrice: number
) {

  const movement =
    (Math.random() - 0.5) * 50;


  const newPrice =
    basePrice + movement;


  const change =
    ((newPrice - basePrice) / basePrice) * 100;


  return {

    price: Number(newPrice.toFixed(2)),

    change: Number(change.toFixed(2))

  };

}