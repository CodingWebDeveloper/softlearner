"use client";

import React, { useEffect, useMemo, useState } from "react";
import AnalyticsCard from "../analytics-card";
import AreaChartWidget from "./area-chart";
import { trpc } from "@/lib/trpc/client";
import {
  convertAmount,
  detectUserCurrency,
  fetchRates,
  formatCurrency,
  Rates,
} from "@/utils/currency";
import moment from "moment";
import { Chip, Stack } from "@mui/material";

type PeriodKey = "7d" | "30d" | "1y" | "all";

const RevenueSeriesCard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const { data, isLoading } = trpc.ordersKpi.getRevenueSeries.useQuery({
    period: period === "all" ? null : period,
  });

  const [userCurrency] = useState(() => detectUserCurrency());
  const [rates, setRates] = useState<Rates | null>(null);
  useEffect(() => {
    let mounted = true;
    fetchRates("USD")
      .then((r) => mounted && setRates(r))
      .catch(() => mounted && setRates(null));
    return () => {
      mounted = false;
    };
  }, []);

  // Build series on client similar to earnings-over-time.tsx
  const chartData = useMemo(() => {
    const samples = data || [];
    const now = moment();

    const sumConv = (amount: number, currency: string) =>
      convertAmount(
        Number(amount || 0),
        (currency || "USD").toUpperCase(),
        userCurrency,
        rates
      );

    if (period === "7d" || period === "30d") {
      const days = period === "7d" ? 6 : 29;
      const end = now.clone().startOf("day");
      const start = end.clone().subtract(days, "days");
      const map = new Map<string, number>();
      for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, "day")) {
        map.set(d.format("YYYY-MM-DD"), 0);
      }
      for (const s of samples) {
        const created = moment(s.created_at).startOf("day");
        if (created.isBetween(start, end, "day", "[]")) {
          const key = created.format("YYYY-MM-DD");
          map.set(
            key,
            (map.get(key) || 0) + sumConv(s.total_amount, s.currency)
          );
        }
      }
      return Array.from(map.entries()).map(([date, amount]) => ({
        label: moment(date, "YYYY-MM-DD").format("MMM D"),
        amount,
      }));
    }

    // Monthly aggregation for 1y and all
    const monthKey = (m: moment.Moment) => m.format("YYYY-MM");
    const firstSampleDate = samples.length
      ? moment.min(samples.map((s) => moment(s.created_at))).startOf("month")
      : now.clone().startOf("month");
    const startMonth =
      period === "1y"
        ? now.clone().startOf("month").subtract(11, "months")
        : firstSampleDate;
    const endMonth = now.clone().startOf("month");

    const map = new Map<string, number>();
    for (
      let m = startMonth.clone();
      m.isSameOrBefore(endMonth);
      m.add(1, "month")
    ) {
      map.set(monthKey(m), 0);
    }
    for (const s of samples) {
      const created = moment(s.created_at);
      if (created.isBetween(startMonth, endMonth, "month", "[]")) {
        const key = monthKey(created);
        map.set(key, (map.get(key) || 0) + sumConv(s.total_amount, s.currency));
      }
    }
    return Array.from(map.entries()).map(([ym, amount]) => ({
      label: moment(ym, "YYYY-MM").format("MMM YYYY"),
      amount,
    }));
  }, [data, userCurrency, rates, period]);

  return (
    <AnalyticsCard
      title="Revenue"
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
        data={chartData}
        xKey="label"
        yKey="amount"
        formatY={(v) => formatCurrency(Number(v) || 0, userCurrency)}
      />
    </AnalyticsCard>
  );
};

export default RevenueSeriesCard;
