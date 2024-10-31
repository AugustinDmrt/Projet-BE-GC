import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Calendar from "../Calendar/Calendar";
import Navbar from "../Navbar/Navbar";
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

  const moveTicket = (ticketId, personId, date) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return { ...ticket, personId, date };
        }
        return ticket;
      })
    );
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
      <Navbar people={people} addPerson={addPerson} addTicket={addTicket} />
      <div className="calendars-wrapper">
        <DndProvider backend={HTML5Backend}>
          <div className="calendars-container">
            {people.map((person) => (
              <Calendar
                key={person.id}
                person={person}
                tickets={tickets.filter((t) => t.personId === person.id)}
                startDate={startDate}
                moveTicket={moveTicket}
              />
            ))}
            {people.length > 0 && (
              <button onClick={loadMoreDays} className="load-more">
                Load More
              </button>
            )}
          </div>
        </DndProvider>
      </div>
    </div>
  );
}