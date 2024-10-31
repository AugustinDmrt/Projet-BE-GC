import {
  addDays,
  eachDayOfInterval,
  format,
  getWeek,
  isWeekend,
  startOfWeek,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import Ticket from "../Ticket/Ticket";

export default function Calendar({ person, tickets, startDate, moveTicket }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const generateDays = (start) => {
      const today = new Date();
      const previousWeekStart = startOfWeek(subDays(today, 7));
      return eachDayOfInterval({
        start: previousWeekStart,
        end: addDays(start, 30),
      }).filter((day) => !isWeekend(day));
    };

    setDays(generateDays(startDate));
  }, [startDate]);

  const scrollToToday = () => {
    const today = document.querySelector(".today");
    if (today) {
      today.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    scrollToToday();
  }, [days]);

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

    const isToday =
      format(new Date(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    const weekNumber = getWeek(day);
    const formattedDate = format(day, "EEEE dd MMMM", { locale: fr });

    return (
      <div
        ref={drop}
        className={`calendar-day ${isOver ? "drag-over" : ""} ${
          isToday ? "today" : ""
        }`}
      >
        <div className="day-header">
          <div className="week-number">S{weekNumber}</div>
          <div className="date">{formattedDate}</div>
        </div>
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