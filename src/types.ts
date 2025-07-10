export interface UfoSighting {
  date: string;
  sightings: number;
}

export interface UfoWeek {
  range: string;
  days: UfoSighting[];
}
