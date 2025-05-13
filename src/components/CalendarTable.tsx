import React from "react";
import useCalendarDays from "../hooks/useCalendarDays";
import {
  phaseStyles,
  newAppPhaseStyles,
  daysInMonth,
  monthNames,
} from "../constants/phaseStyles";

// --- Celdas vacías ---
type EmptyCellsProps = {
  from: number;
  to: number;
  className?: string;
};
const EmptyCells: React.FC<EmptyCellsProps> = ({
  from,
  to,
  className = "style11 null",
}) => (
  <>
    {Array.from({ length: to - from + 1 }, (_, i) => (
      <td key={from + i} className={`column${from + i} ${className}`}></td>
    ))}
  </>
);

type PaintMap = { [key: string]: string };

type CalendarTableProps = {
  paintMap: PaintMap;
  paintMode: boolean;
  freeDayMode: boolean;
  freeDays: Set<number>;
  onPaintCell: (row: number, col: number) => void;
  onMarkFreeDay: (col: number) => void;
};

const CalendarTable: React.FC<CalendarTableProps> = ({
  paintMap,
  paintMode,
  freeDayMode,
  freeDays,
  onPaintCell,
  onMarkFreeDay,
}) => {
  const days = useCalendarDays();
  const colStart = 6;
  const colEnd = colStart + days.length - 1;

  const monthDayCols = days.map(({ col }) => (
    <col key={`col-${col}`} className={`col${col}`} />
  ));

  const monthColStart = (m: number) =>
    colStart + daysInMonth.slice(0, m).reduce((a, b) => a + b, 0);

  const PaintableDayCell: React.FC<{
    row: number;
    col: number;
    className?: string;
  }> = ({ row, col, className = "style11 null" }) => {
    const paintKey = `${row}|${col}`;
    const paintedColor = paintMap[paintKey];
    const isFree = freeDays.has(col);

    let style: React.CSSProperties | undefined = undefined;
    if (isFree) {
      style = {
        background: "#e0e0e0",
        color: "#888",
        cursor: "not-allowed",
        pointerEvents: "none",
        opacity: 0.7,
      };
    } else if (paintedColor) {
      style = {
        background: paintedColor,
        cursor: paintMode ? "pointer" : undefined,
      };
    } else if (paintMode) {
      style = { cursor: "pointer" };
    }

    return (
      <td
        className={`column${col} ${className}`}
        style={style}
        onClick={
          !isFree && paintMode && !freeDayMode
            ? () => onPaintCell(row, col)
            : undefined
        }
        title={
          isFree
            ? "Día libre"
            : paintMode && !freeDayMode
            ? "Pintar celda"
            : undefined
        }
      ></td>
    );
  };

  const PhaseRows: React.FC<{
    phases: { class: string; text: string }[];
    rowStart: number;
    days: { month: number; day: number; col: number }[];
    styleClass?: string;
  }> = ({ phases, rowStart, days, styleClass = "style11 null" }) => (
    <>
      {phases.map((phase, idx) => (
        <tr key={rowStart + idx} className={`row${rowStart + idx}`}>
          <td className={`column3 ${phase.class} s`}>{phase.text}</td>
          <td className="column4 style11 null"></td>
          {days.map(({ col }) => (
            <PaintableDayCell
              key={col}
              row={rowStart + idx}
              col={col}
              className={styleClass}
            />
          ))}
        </tr>
      ))}
    </>
  );

  const NewAppPhaseRows: React.FC<{
    days: { month: number; day: number; col: number }[];
  }> = ({ days }) => (
    <>
      {newAppPhaseStyles.map((phase, idx) => (
        <tr key={25 + idx} className={`row${25 + idx}`}>
          <td className={`column3 ${phase.class} s`}>{phase.text}</td>
          <td className="column4 style11 null"></td>
          {days.map(({ col }) => {
            const isLastRow = idx === newAppPhaseStyles.length - 1;
            const styleClass = isLastRow && col === 8 ? "style45" : "style44";
            return (
              <PaintableDayCell
                key={col}
                row={25 + idx}
                col={col}
                className={styleClass + " null"}
              />
            );
          })}
        </tr>
      ))}
    </>
  );

  // Día libre: solo en la fila de días (Scope/Phase/Note)
  const CalendarDayCell: React.FC<{
    day: number;
    col: number;
  }> = ({ day, col }) => {
    const isFree = freeDays.has(col);
    return (
      <td
        className={`column${col} style11 n`}
        style={
          isFree
            ? {
                background: "#e0e0e0",
                color: "#888",
                cursor: "not-allowed",
                pointerEvents: "none",
                opacity: 0.7,
                fontWeight: "bold",
              }
            : freeDayMode
            ? { cursor: "pointer" }
            : undefined
        }
        onClick={freeDayMode && !isFree ? () => onMarkFreeDay(col) : undefined}
        title={
          isFree
            ? "Día libre"
            : freeDayMode
            ? "Marcar como día libre"
            : undefined
        }
      >
        {day}
      </td>
    );
  };

  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      id="sheet0"
      className="sheet0 gridlines"
    >
      <col className="col0" />
      <col className="col1" />
      <col className="col2" />
      <col className="col3" />
      <col className="col4" />
      <col className="col5" />
      {monthDayCols}
      <tbody>
        {/* Fila 0 */}
        <tr className="row0">
          <td className="column0 style1 s" colSpan={5}>
            SOMOSBELCORP ECOSYSTEM
          </td>
          {monthNames.map((_, m) => (
            <td
              key={`r0-m${m}`}
              className={`column${monthColStart(m)} style2 null`}
              colSpan={daysInMonth[m]}
            ></td>
          ))}
        </tr>
        {/* Fila 1 */}
        <tr className="row1">
          <td className="column0 style3 s" colSpan={5}>
            IMPORTANT Commercial dates
          </td>
          {monthNames.map((_, m) => (
            <td
              key={`r1-m${m}`}
              className={`column${monthColStart(m)} style4 null`}
              colSpan={daysInMonth[m]}
            ></td>
          ))}
        </tr>
        {/* Fila 2 */}
        <tr className="row2">
          <td className="column0 style5 s" colSpan={5} rowSpan={2}>
            Release Plan
          </td>
          {monthNames.map((month, m) => (
            <td
              key={`r2-m${m}`}
              className={`column${monthColStart(m)} style6 s`}
              colSpan={daysInMonth[m]}
            >
              {month}
            </td>
          ))}
        </tr>
        {/* Fila 3 */}
        <tr className="row3">
          {monthNames.map((_, m) => (
            <td
              key={`r3-m${m}`}
              className={`column${monthColStart(m)} style8 null`}
              colSpan={daysInMonth[m]}
            ></td>
          ))}
        </tr>
        {/* Fila 6 */}
        <tr className="row6">
          <td className="column0 style9 s" colSpan={3}>
            Scope
          </td>
          <td className="column3 style9 s">Phase</td>
          <td className="column4 style10 s">
            Release <br />
            Note
          </td>
          {days.map(({ day, col }) => (
            <CalendarDayCell key={col} day={day} col={col} />
          ))}
        </tr>
        {/* Fila 7 */}
        <tr className="row7">
          <td className="column0 style12 s">VERSION:</td>
          <td className="column1 style13 s">2.18.7</td>
          <td className="column2 style12 s">COMPONENTS:</td>
          <td className="column3 style13 s">WEB + BACKEND</td>
          <td className="column4 style14 s">INFO</td>
          <EmptyCells from={colStart} to={colEnd} className="style15 null" />
        </tr>
        {/* Fila 8 */}
        <tr className="row8">
          <td className="column0 style16 s" colSpan={3} rowSpan={15}>
            <span
              style={{
                fontWeight: "bold",
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              SBR Release Web
              <br />
            </span>
            <span
              style={{
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              Release Date: 07/04/2025
              <br />
            </span>
            <span
              style={{
                fontWeight: "bold",
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              Features:
              <br />
            </span>
            <span
              style={{
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              <br />
              BackEnd New App 1.1.0 (3 tickets)
              <br />
              PR - USA New Home Update - FF = OFF
              <br />
            </span>
          </td>
          <td className="column3 style17 s">Sprint - Planning</td>
          <td className="column4 style4 null" rowSpan={15}></td>
          <EmptyCells from={colStart} to={colEnd} />
        </tr>
        {/* Filas 9-22 */}
        <PhaseRows phases={phaseStyles} rowStart={9} days={days} />
        {/* Fila 23 */}
        <tr className="row23">
          <td className="column0 style33 s">VERSION:</td>
          <td className="column1 style34 s">1.1.0</td>
          <td className="column2 style33 s">COMPONENTS:</td>
          <td className="column3 style34 s">NEW APP</td>
          <td className="column4 style35 s">INFO</td>
          <EmptyCells from={colStart} to={colEnd} className="style36 null" />
        </tr>
        {/* Fila 24 */}
        <tr className="row24">
          <td className="column0 style38 s" colSpan={3} rowSpan={14}>
            <span
              style={{
                fontWeight: "bold",
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              SBR Release New App
              <br />
            </span>
            <span
              style={{
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              Release Beta: 07/04/2025
              <br />
              Release Date: 14/04/2025
              <br />
              <br />
            </span>
            <span
              style={{
                fontWeight: "bold",
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              Features:
              <br />
            </span>
            <span
              style={{
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "14pt",
              }}
            >
              PR - USA New Home Update <br />
              New App 1.1.0 (3 tickets) Fixes
              <br />
              PR - USA New Home Update - FF = ON
            </span>
          </td>
          <td className="column3 style19 s">Development . JM</td>
          <td className="column4 style42 null" rowSpan={14}></td>
          <EmptyCells from={colStart} to={colEnd} />
        </tr>
        <NewAppPhaseRows days={days} />
      </tbody>
    </table>
  );
};

export default CalendarTable;
