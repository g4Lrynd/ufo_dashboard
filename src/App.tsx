import "./App.css";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "./data.json";

function App() {
  const url =
    "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings";
  const [ufos, setUfos] = useState<UfoSighting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  interface UfoSighting {
    date: string;
    sightings: number;
  }

  interface UfoSightingWeek {
    [label: string]: UfoSighting;
  }

  const parseDate = (date: string): Date => {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortDataByWeeks = (data: UfoSighting[]) => {
    let weeks: UfoSightingWeek[] = [];
    const startDate = parseDate(data[0].date);
    const endDate = parseDate(data[data.length - 1].date);
    let currentDate = startDate;

    // This gets the day and removes however days is needed to get to Monday
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    // Do the same for the end date but to Friday instead
    endDate.setDate(endDate.getDate() + endDate.getDay() + 1);

    while (currentDate <= endDate) {
      if (1 === currentDate.getDay()) {
        const monday = currentDate;
        let sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);

        let label =
          monday.toLocaleDateString("en-GB") +
          " - " +
          sunday.toLocaleDateString("en-GB");

        weeks[label] = ["monday", "tuesday"];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(weeks);
  };

  const fetchUfos = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        setError(`Error ${response.status}`);
        return;
      }

      const json: UfoSighting[] = await response.json();
      setUfos(json);
      sortDataByWeeks(json);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchUfos();
    setUfos(data);
    sortDataByWeeks(data);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong: {error}</div>;
  }

  return (
    <div className="App">
      {ufos.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width={500}
            height={300}
            data={ufos}
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
      )}
    </div>
  );
}

export default App;
