import { addDays, eachDayOfInterval, format, isWeekend } from "date-fns";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

function Calendar({ person, tickets, startDate }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const generateDays = (start) => {
      return eachDayOfInterval({ start, end: addDays(start, 30) }).filter(
        (day) => !isWeekend(day)
      );
    };

    setDays(generateDays(startDate));
  }, [startDate]);

  return (
    <div className="calendar-container">
      <div className="calendar-name">{person.name}</div>
      <div className="calendar">
        {days.map((day) => (
          <Droppable
            key={`${person.id}-${format(day, "yyyy-MM-dd")}`}
            droppableId={`${person.id}-${format(day, "yyyy-MM-dd")}`}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="calendar-day"
              >
                <div className="day-header">{format(day, "EEE dd")}</div>
                {tickets
                  .filter((ticket) => ticket.date === format(day, "yyyy-MM-dd"))
                  .map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="ticket"
                        >
                          {ticket.description}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
