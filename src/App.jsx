import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import Calendar from "./components/Calendar";
import PeopleManager from "./components/PeopleManager";
import TicketManager from "./components/TicketManager";

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
      <h1>Calendar Ticket Manager</h1>
      <PeopleManager people={people} addPerson={addPerson} />
      <TicketManager
        people={people}
        tickets={tickets}
        addTicket={addTicket}
        deleteTicket={deleteTicket}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendars-container">
          {people.map((person, index) => (
            <Calendar
              key={person.id}
              person={person}
              tickets={tickets.filter((t) => t.personId === person.id)}
              startDate={startDate}
              loadMoreDays={loadMoreDays}
              isLastPerson={index === people.length - 1}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
