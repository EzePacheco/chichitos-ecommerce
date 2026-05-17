const arsFormatter = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatMoney(cents: number) {
  return arsFormatter.format(cents / 100);
}
