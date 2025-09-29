export type Rates = Record<string, number>;

// Very small region->currency mapping for common cases; default fallback to USD
const REGION_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  IE: "EUR",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  TR: "TRY",
};

export function detectUserCurrency(defaultCurrency = "USD"): string {
  try {
    const locale = navigator?.language || (Intl?.DateTimeFormat?.().resolvedOptions()?.locale as string) || "en-US";
    const region = locale.split("-")[1]?.toUpperCase();
    if (region && REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region];
  } catch {}
  return defaultCurrency;
};

export async function fetchRates(base: string): Promise<Rates> {
  // Uses exchangerate.host which is free and does not require an API key
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch currency rates");
  const json = await res.json();
  return (json && json.rates) || {};
};

export function convertAmount(amount: number, from: string, to: string, rates: Rates | null): number {
  if (!rates || from === to) return amount;
  // rates are in BASE terms; if we fetched with base=X, then rates[to] gives multiplier from base->to
  // To convert from currency A to B with base=X:
  // amount_in_X = amount / rates[A]
  // amount_in_B = amount_in_X * rates[B]
  const rateFrom = rates[from];
  const rateTo = rates[to];
  if (!rateFrom || !rateTo) return amount; // fallback
  const inBase = amount / rateFrom;
  return inBase * rateTo;
};

export const formatCurrency = (n: number, code: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(n);
  