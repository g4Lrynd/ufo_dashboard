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
  const [sortedUfos, setSortedUfos] = useState<UfoWeek[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  interface UfoSighting {
    date: string;
    sightings: number;
  }

  interface UfoWeek {
    range: string;
    days: UfoSighting[];
  }

  const parseDate = (date: string): Date => {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortDataByWeeks = (data: UfoSighting[]) => {
    const weeks: UfoWeek[] = [];
    const startDate = parseDate(data[0].date);
    const endDate = parseDate(data[data.length - 1].date);
    let currentDate = startDate;

    // This gets the day and removes however days is needed to get to Monday
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    // Do the same for the end date but to Friday instead
    endDate.setDate(endDate.getDate() + endDate.getDay() + 1);

    while (currentDate <= endDate) {
      if (1 === currentDate.getDay()) {
        const weekDays: UfoSighting[] = [];
        const monday = currentDate;
        const mondayString = monday.toLocaleDateString("en-GB");

        let sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        const sundayString = sunday.toLocaleDateString("en-GB");

        let label = `${mondayString} - ${sundayString}`;

        // Loops through days of the week and checks if ufo data has corrospoding day of sightings
        for (let i = 0; i < 6; i++) {
          const weekDay = new Date(currentDate.getTime());
          weekDay.setDate(monday.getDate() + i);
          const weekDayString = weekDay.toLocaleDateString("en-GB", {
            weekday: "long",
          });

          const found = data.find(
            (element) => parseDate(element.date).getTime() === weekDay.getTime()
          );

          weekDays.push({
            date: weekDayString,
            sightings: found ? found?.sightings : 0,
          });
        }

        weeks.push({
          range: label,
          days: weekDays,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(weeks);
    setSortedUfos(weeks);
  };

  const fetchUfos = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        setError(`Error ${response.status}`);
        return;
      }

      const json: UfoSighting[] = await response.json();
      sortDataByWeeks(json);
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
      {sortedUfos.length > 0 && (
        <>
          <h1>Weekly UFO Sightings Dashboard</h1>
          <ResponsiveContainer width="60%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={sortedUfos[selectedWeekIndex].days}
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

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <div className="week-nav-buttons">
              <button
                onClick={() => setSelectedWeekIndex((prev) => prev - 1)}
                disabled={selectedWeekIndex === 0}
              >
                Previous Week
              </button>
              <p>{sortedUfos[selectedWeekIndex].range}</p>
              <button
                onClick={() => setSelectedWeekIndex((prev) => prev + 1)}
                disabled={selectedWeekIndex === sortedUfos.length - 1}
              >
                Next Week
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
