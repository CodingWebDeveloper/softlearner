export type OrderRow = {
  net_amount?: number | null;
  total_amount?: number | null;
  platform_fee_amount?: number | null;
  currency?: string | null;
  created_at?: string | null;
};

export type PeriodDateRange = {
  from: string | undefined;
  to: string | undefined;
};

export type RevenueByCourseEntry = {
  courseId: string;
  name: string;
  total: number;
  currency?: string;
  totalsByCurrency?: Record<string, number>;
};

export function resolveNetAmount(row: OrderRow): number {
  return Number(
    row.net_amount ??
      Number(row.total_amount || 0) - Number(row.platform_fee_amount || 0),
  );
}

export function startOfMonthISO(d: Date): string {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0),
  ).toISOString();
}

export function endOfMonthISO(d: Date): string {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999),
  ).toISOString();
}

export function getPeriodDateRange(
  period: "7d" | "30d" | "1y" | null | undefined,
): PeriodDateRange {
  const now = new Date();

  if (period === "7d" || period === "30d") {
    const days = period === "7d" ? 6 : 29;
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
    );
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );
    start.setUTCDate(start.getUTCDate() - days);
    return { from: start.toISOString(), to: end.toISOString() };
  }

  if (period === "1y") {
    const startMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
    );
    startMonth.setUTCMonth(startMonth.getUTCMonth() - 11);
    const endMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999),
    );
    return { from: startMonth.toISOString(), to: endMonth.toISOString() };
  }

  return { from: undefined, to: undefined };
}

export function aggregateRevenueByCourse(
  rows: any[],
  currencyFilter?: string,
  limit = 10,
): RevenueByCourseEntry[] {
  const map = new Map<string, RevenueByCourseEntry>();

  for (const row of rows) {
    const course = row.course as { id: string; name: string } | null;
    if (!course?.id) continue;

    const rowCurrency = (row.currency || "USD") as string;
    const rowNet = resolveNetAmount(row);
    const prev = map.get(course.id) ?? {
      courseId: course.id,
      name: course.name,
      total: 0,
      currency: currencyFilter || rowCurrency,
      totalsByCurrency: {},
    };

    prev.total += rowNet;
    prev.totalsByCurrency = prev.totalsByCurrency ?? {};
    prev.totalsByCurrency[rowCurrency] = (prev.totalsByCurrency[rowCurrency] || 0) + rowNet;

    if (!currencyFilter) prev.currency = undefined;

    map.set(course.id, prev);
  }

  return Array.from(map.values())
    .map((r) => ({ ...r, total: Number(r.total.toFixed(2)) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, Math.max(1, limit));
}

export function aggregateStudentsByCourse(
  rows: any[],
  limit = 10,
): { courseId: string; name: string; count: number }[] {
  const map = new Map<string, { courseId: string; name: string; count: number }>();

  for (const row of rows) {
    const course = row.course as { id: string; name: string } | null;
    if (!course?.id) continue;

    const prev = map.get(course.id) ?? { courseId: course.id, name: course.name, count: 0 };
    prev.count += 1;
    map.set(course.id, prev);
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, Math.max(1, limit));
}
