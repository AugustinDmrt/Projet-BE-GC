import { addDays, eachDayOfInterval, format, isWeekend } from "date-fns";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import Ticket from "../Ticket/Ticket";

export default function Calendar({ person, tickets, startDate, moveTicket }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const generateDays = (start) => {
      return eachDayOfInterval({ start, end: addDays(start, 30) }).filter(
        (day) => !isWeekend(day)
      );
    };

    setDays(generateDays(startDate));
  }, [startDate]);

  const CalendarDay = ({ day, dayTickets }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "ticket",
      drop: (item) => {
        moveTicket(item.id, person.id, format(day, "yyyy-MM-dd"));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div ref={drop} className={`calendar-day ${isOver ? "drag-over" : ""}`}>
        <div className="day-header">{format(day, "EEE dd")}</div>
        {dayTickets.map((ticket) => (
          <Ticket key={ticket.id} ticket={ticket} />
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-name">{person.name}</div>
      <div className="calendar">
        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const dayTickets = tickets.filter((ticket) => ticket.date === dayStr);

          return <CalendarDay key={dayStr} day={day} dayTickets={dayTickets} />;
        })}
      </div>
    </div>
  );
}
