import { daysInMonth } from "../constants/phaseStyles";

function useCalendarDays() {
  // El primer día debe ser col=6 (colStart)
  const days: { month: number; day: number; col: number }[] = [];
  let col = 6;
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= daysInMonth[m]; d++) {
      days.push({ month: m, day: d, col });
      col++;
    }
  }
  return days;
}

export default useCalendarDays;
