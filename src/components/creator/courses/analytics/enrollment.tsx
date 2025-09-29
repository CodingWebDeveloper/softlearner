import { SimpleOrder } from "@/lib/di/interfaces/dal.interfaces";
import AnalyticsCard from "./analytics-card";
import TwoValueStat from "./widgets/two-value-stat";
import moment from "moment";
import { useMemo } from "react";

interface EnrollmentProps {
  orders: SimpleOrder[];
  isLoading: boolean;
}

const Enrollment: React.FC<EnrollmentProps> = ({ orders, isLoading }) => {
  const { totalCount, newLast30 } = useMemo(() => {
    const now = moment();
    const last30Start = moment().subtract(30, "days");

    const total = orders.length;
    let last30 = 0;

    for (const o of orders) {
      const createdAt = moment(o.created_at);
      if (createdAt.isBetween(last30Start, now, "day", "[]")) {
        last30 += 1;
      }
    }

    return { totalCount: total, newLast30: last30 };
  }, [orders]);

  return (
    <AnalyticsCard title="Students" subtitle="Enrollment" loading={isLoading}>
      <TwoValueStat
        labelLeft="Total Students"
        valueLeft={totalCount}
        labelRight="New (30d)"
        valueRight={newLast30}
      />
    </AnalyticsCard>
  );
};

export default Enrollment;
