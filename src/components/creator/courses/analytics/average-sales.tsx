import { SimpleOrder } from "@/lib/di/interfaces/dal.interfaces";
import AnalyticsCard from "./analytics-card";
import TwoValueStat from "./widgets/two-value-stat";
import { convertAmount, formatCurrency, Rates } from "@/utils/currency";
import { useMemo } from "react";

interface AverageSalesProps {
  orders: SimpleOrder[];
  isLoading: boolean;
  rates: Rates | null;
  userCurrency: string;
}

const AverageSales: React.FC<AverageSalesProps> = ({
  orders,
  isLoading,
  rates,
  userCurrency,
}) => {
  const { totalSales, avgPriceConverted } = useMemo(() => {
    const totalSales = orders.length;
    const totalAmountConverted = orders.reduce((sum, o) => {
      const amt = convertAmount(
        Number(o.total_amount || 0),
        (o.currency || "USD").toUpperCase(),
        userCurrency,
        rates
      );
      return sum + amt;
    }, 0);
    const avg = totalSales > 0 ? totalAmountConverted / totalSales : 0;
    return { totalSales, avgPriceConverted: avg };
  }, [orders, userCurrency, rates]);

  return (
    <AnalyticsCard
      title="Sales & Avg Price"
      subtitle={`All time · ${userCurrency}`}
      loading={isLoading}
    >
      <TwoValueStat
        labelLeft="Total Sales"
        valueLeft={totalSales}
        labelRight="Avg Price"
        valueRight={formatCurrency(avgPriceConverted, userCurrency)}
      />
    </AnalyticsCard>
  );
};

export default AverageSales;
