import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { format } from "date-fns";
import { es } from "date-fns/locale";

// ⚠️ Definimos el tipo manualmente
type CalendarValue = Date | [Date, Date] | null;

export const MyCalendar = () => {
  const [value, setValue] = useState<CalendarValue>(new Date());

  const formatDate = (date: Date) =>
    format(date, "PPPP", { locale: es });

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Seleccioná una fecha</h2>
      <Calendar
        onChange={(val) => setValue(val as CalendarValue)} // 👈 usamos type assertion si hace falta
        value={value}
        locale="es-AR"
      />
      <p style={{ marginTop: "1rem" }}>
        Fecha seleccionada:{" "}
        {value
          ? Array.isArray(value)
            ? value.map((date) =>
                date ? formatDate(date) : ""
              ).join(" - ")
            : formatDate(value)
          : "Ninguna"}
      </p>
    </div>
  );
};
