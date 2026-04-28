import { useMemo } from "react";
import { convertAmount, formatCurrency, Rates } from "@/utils/currency";
import AnalyticsCard from "./analytics-card";
import OneValueStat from "./widgets/one-value-stat";
import moment from "moment";
import { SimpleOrder } from "@/lib/di/interfaces/dal.interfaces";

interface TotalEarningsProps {
  orders: SimpleOrder[];
  isLoading: boolean;
  rates: Rates | null;
  userCurrency: string;
}

const TotalEarnigns: React.FC<TotalEarningsProps> = ({
  orders,
  isLoading,
  userCurrency,
  rates,
}) => {
  const { totalEarningsConverted, delta } = useMemo(() => {
    const now = moment();
    const last30Start = moment().subtract(30, "days");
    const prev30Start = moment().subtract(60, "days");
    const prev30End = last30Start;

    let allTime = 0;
    let last30 = 0;
    let prev30 = 0;

    for (const o of orders) {
      const netAmount =
        o.net_amount ??
        Number(o.total_amount || 0) - Number(o.platform_fee_amount || 0);
      const amt = convertAmount(
        Number(netAmount || 0),
        (o.currency || "USD").toUpperCase(),
        userCurrency,
        rates,
      );
      const createdAt = moment(o.created_at);

      allTime += amt;

      if (createdAt.isBetween(last30Start, now, "day", "[]")) {
        // Within last 30 days (inclusive)
        last30 += amt;
      } else if (createdAt.isBetween(prev30Start, prev30End, "day", "[)")) {
        // Within previous 30 days (inclusive start, exclusive end)
        prev30 += amt;
      }
    }

    let pct = 0;
    let direction: "up" | "down" | "neutral" = "neutral";

    if (prev30 > 0) {
      pct = ((last30 - prev30) / prev30) * 100;
      direction = pct > 0 ? "up" : pct < 0 ? "down" : "neutral";
    } else if (last30 > 0) {
      // No previous period revenue but some this period
      pct = 100;
      direction = "up";
    }

    return {
      totalEarningsConverted: allTime,
      delta: {
        value: `${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%`,
        direction,
        tooltip: "vs previous 30 days",
      },
    };
  }, [orders, userCurrency, rates]);

  return (
    <AnalyticsCard
      title="Total Earnings"
      subtitle={`All time · ${userCurrency}`}
      loading={isLoading}
    >
      <OneValueStat
        label="Revenue"
        value={formatCurrency(totalEarningsConverted, userCurrency)}
        delta={delta}
        helpText="Completed orders only"
      />
    </AnalyticsCard>
  );
};

export default TotalEarnigns;
