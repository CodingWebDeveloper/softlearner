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
import moment from "moment";

const CurrentMonthRevenueCard: React.FC = () => {
  const { data, isLoading } = trpc.ordersKpi.getRevenueSeries.useQuery({
    period: null,
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

  const display = useMemo(() => {
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");
    const converted = (data ?? []).reduce((sum, sample) => {
      const createdAt = moment(sample.created_at);
      if (!createdAt.isBetween(monthStart, monthEnd, undefined, "[]")) {
        return sum;
      }

      const amount = Number(sample.net_amount ?? sample.total_amount ?? 0);
      return (
        sum +
        convertAmount(
          amount,
          (sample.currency || "USD").toUpperCase(),
          userCurrency,
          rates,
        )
      );
    }, 0);
    return formatCurrency(converted, userCurrency);
  }, [data, userCurrency, rates]);

  return (
    <AnalyticsCard title="MRR" subtitle="This month" loading={isLoading}>
      <OneValueStat label="Revenue" value={display} />
    </AnalyticsCard>
  );
};

export default CurrentMonthRevenueCard;
