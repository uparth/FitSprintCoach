import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { ChartPoint } from "@/domain/charts";

export function ExerciseMinutesChart({ data }: { data: ChartPoint[] }) {
  return <SimpleBarChart data={data} />;
}
