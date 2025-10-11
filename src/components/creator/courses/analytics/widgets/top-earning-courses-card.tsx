"use client";

import React, { useEffect, useMemo, useState } from "react";
import AnalyticsCard from "../analytics-card";
import BarChartWidget from "./bar-chart";
import { trpc } from "@/lib/trpc/client";
import {
  convertAmount,
  detectUserCurrency,
  fetchRates,
  formatCurrency,
  Rates,
} from "@/utils/currency";

const TopEarningCoursesCard: React.FC = () => {
  const { data, isPending } = trpc.ordersKpi.getRevenueByCourse.useQuery({
    limit: 10,
  });

  const [userCurrency] = useState(() => detectUserCurrency());
  const [rates, setRates] = useState<Rates | null>(null);
  useEffect(() => {
    fetchRates("USD")
      .then((r) => setRates(r))
      .catch(() => setRates(null));
  }, []);

  // WARNING: Accurate conversion with mixed currencies requires backend grouping per currency.
  const chartData = useMemo(() => {
    const items = data || [];
    return items.map((c) => ({
      label: c.name,
      amount: convertAmount(Number(c.total || 0), "USD", userCurrency, rates),
    }));
  }, [data, userCurrency, rates]);

  return (
    <AnalyticsCard
      title="Top Earning Courses"
      subtitle="By total revenue"
      disablePadding
      loading={isPending}
    >
      <BarChartWidget
        data={chartData}
        xKey="label"
        yKey="amount"
        formatY={(v: number) => formatCurrency(Number(v) || 0, userCurrency)}
      />
    </AnalyticsCard>
  );
};

export default TopEarningCoursesCard;
