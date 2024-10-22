import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Calendar from "../Calendar/Calendar";
import PeopleManager from "../PeopleManager/PeopleManager";
import TicketManager from "../TicketManager/TicketManager";
import "./App.css";

function App() {
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

    const newTickets = Array.from(tickets);
    const [reorderedTicket] = newTickets.splice(result.source.index, 1);
    reorderedTicket.date = result.destination.droppableId.split("-")[1];
    reorderedTicket.personId = result.destination.droppableId.split("-")[0];
    newTickets.splice(result.destination.index, 0, reorderedTicket);

    setTickets(newTickets);
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
      <h1>Calendrier Ticket BE</h1>
      <div className="header-section">
        <PeopleManager people={people} addPerson={addPerson} />
        <TicketManager
          people={people}
          tickets={tickets}
          addTicket={addTicket}
          deleteTicket={deleteTicket}
        />
      </div>

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
  );
}

export default App;
