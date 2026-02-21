export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const hasDiscountPrice = (price: number, newPrice?: number | null) => {
  return newPrice !== null && newPrice !== undefined;
};

export const getDisplayPrice = (price: number, newPrice?: number | null) => {
  return hasDiscountPrice(price, newPrice)
    ? (newPrice as number).toFixed(2)
    : price.toFixed(2);
};

export const getDiscountPercentage = (
  price: number,
  newPrice?: number | null,
) => {
  if (!hasDiscountPrice(price, newPrice)) return null;
  if (!price || price <= 0) return null;

  const finalNewPrice = newPrice as number;
  return Math.round(((price - finalNewPrice) / price) * 100);
};

export const intervalToTotalMinutes = (interval?: string | null) => {
  if (!interval) return 0;

  const parts = interval.split(":");
  if (parts.length !== 3) return 0;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
};

export const formatDurationFromMinutes = (totalMinutes: number) => {
  const safeMinutes = Number.isFinite(totalMinutes)
    ? Math.max(totalMinutes, 0)
    : 0;
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return hours > 0
    ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min` : ""}`.trim()
    : `${minutes} min`;
};

export const getTotalMinutesFromResources = <
  T extends { duration?: string | null },
>(
  resources?: T[] | null,
) => {
  return (
    resources?.reduce(
      (total, r) => total + intervalToTotalMinutes(r.duration),
      0,
    ) ?? 0
  );
};

export const countResourcesByType = <T extends { type?: string | null }>(
  resources: T[] | null | undefined,
  type: string,
) => {
  return (resources ?? []).filter((r) => r.type === type).length;
};
