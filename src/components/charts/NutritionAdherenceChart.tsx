import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { ChartPoint } from "@/domain/charts";

export function NutritionAdherenceChart({ data }: { data: ChartPoint[] }) {
  return <SimpleBarChart data={data} />;
}
