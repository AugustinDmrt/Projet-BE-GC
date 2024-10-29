import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Calendar from "../Calendar/Calendar";
import PeopleManager from "../PeopleManager/PeopleManager";
import TicketManager from "../TicketManager/TicketManager";
import "./App.css";

export default function App() {
  const [people, setPeople] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const addPerson = (name) => {
    setPeople([...people, { id: Date.now().toString(), name }]);
  };

  const addTicket = (personId, date, description) => {
    setTickets([
      ...tickets,
      { id: Date.now().toString(), personId, date, description },
    ]);
  };

  const deleteTicket = (ticketId) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      return;
    }

    const [destPersonId, destDate] = destination.droppableId.split("-");
    const ticketToMove = tickets.find((t) => t.id === draggableId);

    if (!ticketToMove) return;

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === draggableId) {
        return {
          ...ticket,
          personId: destPersonId,
          date: destDate,
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
  };

  const loadMoreDays = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 31);
      return newDate;
    });
  };

  return (
    <div className="App">
      <h1>Calendar Ticket Manager</h1>
      <PeopleManager people={people} addPerson={addPerson} />
      <TicketManager
        people={people}
        tickets={tickets}
        addTicket={addTicket}
        deleteTicket={deleteTicket}
      />
      <div className="calendars-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="calendars-container">
            {people.map((person) => (
              <Calendar
                key={person.id}
                person={person}
                tickets={tickets.filter((t) => t.personId === person.id)}
                startDate={startDate}
              />
            ))}
            {people.length > 0 && (
              <button onClick={loadMoreDays} className="load-more">
                Load More
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
