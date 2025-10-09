"use client";

import React, { useEffect, useMemo, useState } from "react";
import AnalyticsCard from "../analytics-card";
import OneValueStat from "./one-value-stat";
import { trpc } from "@/lib/trpc/client";
import {
  convertAmount,
  detectUserCurrency,
  fetchRates,
  formatCurrency,
  Rates,
} from "@/utils/currency";

const TotalRevenueCard: React.FC = () => {
  const { data, isLoading, isError } = trpc.ordersKpi.getTotalRevenue.useQuery();

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

  const display = useMemo(() => {
    const raw = Number(data ?? 0);
    const converted = convertAmount(raw, "USD", userCurrency, rates);
    return formatCurrency(converted, userCurrency);
  }, [data, userCurrency, rates]);

  return (
    <AnalyticsCard
      title="Total Revenue"
      subtitle="All time"
      loading={isLoading}
    >
      <OneValueStat label="Revenue" value={display} />
    </AnalyticsCard>
  );
};

export default TotalRevenueCard;
