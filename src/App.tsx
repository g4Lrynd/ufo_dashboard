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
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUfos();
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
