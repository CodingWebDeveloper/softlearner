import { useMemo, useState } from "react";
import moment from "moment";
import AnalyticsCard from "./analytics-card";
import AreaChartWidget from "./widgets/area-chart";
import { SimpleOrder } from "@/lib/di/interfaces/dal.interfaces";
import { convertAmount, formatCurrency, Rates } from "@/utils/currency";
import { Chip, Stack } from "@mui/material";

interface EarningsOverTimeProps {
  orders: SimpleOrder[];
  isLoading: boolean;
  userCurrency: string;
  rates: Rates | null;
}

type SeriesPoint = { label: string; amount: number };
type PeriodKey = "7d" | "30d" | "1y" | "all";

const EarningsOverTime: React.FC<EarningsOverTimeProps> = ({
  orders,
  isLoading,
  userCurrency,
  rates,
}) => {
  const [period, setPeriod] = useState<PeriodKey>("30d");

  const data = useMemo<SeriesPoint[]>(() => {
    const conv = (o: SimpleOrder) => {
      const netAmount =
        o.net_amount ??
        Number(o.total_amount || 0) - Number(o.platform_fee_amount || 0);
      return convertAmount(
        Number(netAmount || 0),
        (o.currency || "USD").toUpperCase(),
        userCurrency,
        rates,
      );
    };

    const now = moment();

    if (period === "7d" || period === "30d") {
      const days = period === "7d" ? 6 : 29;
      const end = now.clone().startOf("day");
      const start = end.clone().subtract(days, "days");
      const map = new Map<string, number>();
      for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, "day")) {
        map.set(d.format("YYYY-MM-DD"), 0);
      }
      for (const o of orders) {
        const created = moment(o.created_at).startOf("day");
        if (created.isBetween(start, end, "day", "[]")) {
          const key = created.format("YYYY-MM-DD");
          map.set(key, (map.get(key) || 0) + conv(o));
        }
      }
      return Array.from(map.entries()).map(([date, amount]) => ({
        label: moment(date, "YYYY-MM-DD").format("MMM D"),
        amount,
      }));
    }

    // Monthly aggregation for 1y and all
    const monthKey = (m: moment.Moment) => m.format("YYYY-MM");
    const firstOrderDate = orders.length
      ? moment.min(orders.map((o) => moment(o.created_at))).startOf("month")
      : now.clone().startOf("month");
    const startMonth =
      period === "1y"
        ? now.clone().startOf("month").subtract(11, "months")
        : firstOrderDate;
    const endMonth = now.clone().startOf("month");

    const map = new Map<string, number>();
    for (
      let m = startMonth.clone();
      m.isSameOrBefore(endMonth);
      m.add(1, "month")
    ) {
      map.set(monthKey(m), 0);
    }
    for (const o of orders) {
      const created = moment(o.created_at);
      if (created.isBetween(startMonth, endMonth, "month", "[]")) {
        const key = monthKey(created);
        map.set(key, (map.get(key) || 0) + conv(o));
      }
    }
    return Array.from(map.entries()).map(([ym, amount]) => ({
      label: moment(ym, "YYYY-MM").format("MMM YYYY"),
      amount,
    }));
  }, [orders, userCurrency, rates, period]);

  return (
    <AnalyticsCard
      title="Earnings Over Time"
      subtitle={
        period === "7d"
          ? `Last 7 days · ${userCurrency}`
          : period === "30d"
            ? `Last 30 days · ${userCurrency}`
            : period === "1y"
              ? `Last 12 months · ${userCurrency}`
              : `All time · ${userCurrency}`
      }
      disablePadding
      loading={isLoading}
      action={
        <Stack direction="row" spacing={1}>
          {(
            [
              { key: "7d", label: "7d" },
              { key: "30d", label: "30d" },
              { key: "1y", label: "1y" },
              { key: "all", label: "All" },
            ] as { key: PeriodKey; label: string }[]
          ).map((p) => (
            <Chip
              key={p.key}
              label={p.label}
              size="small"
              color={period === p.key ? "primary" : "default"}
              variant={period === p.key ? "filled" : "outlined"}
              onClick={() => setPeriod(p.key)}
            />
          ))}
        </Stack>
      }
    >
      <AreaChartWidget
        data={data}
        xKey="label"
        yKey="amount"
        formatY={(v) => formatCurrency(Number(v) || 0, userCurrency)}
      />
    </AnalyticsCard>
  );
};

export default EarningsOverTime;
