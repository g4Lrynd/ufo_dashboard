import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { UfoWeek } from "../types";

interface UfoBarGraphProps {
  data: UfoWeek["days"];
}

const UfoBarGraph = ({ data }: UfoBarGraphProps) => {
  return (
    <ResponsiveContainer width="60%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="sightings"
          fill="#8884d8"
          activeBar={<Rectangle fill="#514aa5" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UfoBarGraph;
