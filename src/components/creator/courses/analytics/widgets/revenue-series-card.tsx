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

const RevenueSeriesCard: React.FC = () => {
  const { data, isLoading } = trpc.ordersKpi.getRevenueSeries.useQuery({
    granularity: "month",
    periodMonths: 12,
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

  // TODO: Accurate conversion requires per-currency bucket sums; backend should return series grouped by currency.
  const chartData = useMemo(() => {
    return (data || []).map((p) => ({
      label: new Date(p.periodStart).toLocaleDateString(undefined, {
        year: "2-digit",
        month: "short",
      }),
      amount: convertAmount(Number(p.total || 0), "USD", userCurrency, rates),
    }));
  }, [data, userCurrency, rates]);

  return (
    <AnalyticsCard title="Revenue (last 12 months)" disablePadding loading={isLoading}>
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
