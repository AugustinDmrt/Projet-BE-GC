import { addDays, eachDayOfInterval, format, isWeekend } from "date-fns";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

export default function Calendar({ person, tickets, startDate }) {
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
        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const droppableId = `${person.id}-${dayStr}`;
          const dayTickets = tickets.filter((ticket) => ticket.date === dayStr);

          return (
            <Droppable
              key={droppableId}
              droppableId={droppableId}
              type="TICKET"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`calendar-day ${
                    snapshot.isDraggingOver ? "drag-over" : ""
                  }`}
                >
                  <div className="day-header">{format(day, "EEE dd")}</div>
                  {dayTickets.map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id}
                      index={index}
                      type="TICKET"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`ticket ${
                            snapshot.isDragging ? "dragging" : ""
                          }`}
                          style={provided.draggableProps.style}
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
          );
        })}
      </div>
    </div>
  );
}
