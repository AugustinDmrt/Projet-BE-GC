import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Calendar from "../Calendar/Calendar";
import Navbar from "../Navbar/Navbar";
import WaitingZone from "../WaitingZone/WaitingZone";
import "./App.css";

export const WAITING_ZONE_DATE = "0001-01-01";

export const TICKET_TYPES = {
  pec: { name: "PEC", color: "#5dade2" },
  com: { name: "Commercial", color: "#66bb6a" },
  done: { name: "Fait", color: "#9e9e9e" },
};

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [people, setPeople] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  useEffect(() => {
    fetchPeople();
    fetchTickets();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_URL}/people`);
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const addPerson = async (name) => {
    try {
      const id = Date.now().toString();
      const response = await fetch(`${API_URL}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const data = await response.json();
      setPeople([...people, data]);
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const addTicket = async (
    personId,
    date,
    description,
    type = null,
    codeArticle = null
  ) => {
    try {
      const id = codeArticle || Date.now().toString();
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          personId: personId || "waiting",
          date: date || WAITING_ZONE_DATE,
          description,
          type,
          codeArticle,
        }),
      });
      const data = await response.json();
      setTickets([...tickets, data]);
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };

  const moveTicket = async (ticketId, newPersonId, newDate) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: newPersonId,
          date: newDate,
          type: tickets.find((t) => t.id === ticketId)?.type,
        }),
      });
      const data = await response.json();
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, ...data } : ticket
        )
      );
    } catch (error) {
      console.error("Error moving ticket:", error);
    }
  };

  const updateTicketType = async (ticketId, type) => {
    try {
      const ticket = tickets.find((t) => t.id === ticketId);
      const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: ticket.personId,
          date: ticket.date,
          type,
        }),
      });
      const data = await response.json();
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, type: data.type } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket type:", error);
    }
  };

  const loadMoreDays = useCallback(() => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 31);
      return newDate;
    });
  }, []);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const waitingTickets = tickets.filter(
    (ticket) =>
      ticket.personId === "waiting" || ticket.date === WAITING_ZONE_DATE
  );

  const assignedTickets = tickets.filter(
    (ticket) =>
      ticket.personId !== "waiting" && ticket.date !== WAITING_ZONE_DATE
  );

  return (
    <div className="App">
      <Navbar people={people} addPerson={addPerson} addTicket={addTicket} />
      <div className={`calendars-wrapper ${isSideMenuOpen ? "menu-open" : ""}`}>
        <DndProvider backend={HTML5Backend}>
          <div className="calendars-container">
            {people.map((person) => (
              <Calendar
                key={person.id}
                person={person}
                tickets={assignedTickets.filter(
                  (t) => t.personId === person.id
                )}
                startDate={startDate}
                moveTicket={moveTicket}
                onScrollEnd={loadMoreDays}
                updateTicketType={updateTicketType}
              />
            ))}
          </div>
          <div className={`side-menu ${isSideMenuOpen ? "open" : ""}`}>
            <WaitingZone
              tickets={waitingTickets}
              moveTicket={moveTicket}
              updateTicketType={updateTicketType}
            />
          </div>
          <button
            className="side-menu-toggle"
            onClick={toggleSideMenu}
            aria-label={
              isSideMenuOpen ? "Close waiting zone" : "Open waiting zone"
            }
          >
            {isSideMenuOpen ? "→" : "←"}
          </button>
        </DndProvider>
      </div>
    </div>
  );
}
