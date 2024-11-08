import { useCallback, useState } from "react";
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
};

export default function App() {
  const [people, setPeople] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  const addPerson = (name) => {
    setPeople([...people, { id: Date.now().toString(), name }]);
  };

  const addTicket = (
    personId,
    date,
    description,
    type = null,
    codeArticle = null
  ) => {
    setTickets((prev) => {
      const existingTicket = prev.find(
        (ticket) => ticket.codeArticle === codeArticle
      );

      if (existingTicket) {
        return prev.map((ticket) => {
          if (ticket.codeArticle === codeArticle) {
            return {
              ...ticket,
              description,
              type: type || ticket.type,
            };
          }
          return ticket;
        });
      }

      const newTicket = {
        id: codeArticle || Date.now().toString(),
        personId: personId || "waiting",
        date: date || WAITING_ZONE_DATE,
        description,
        type,
        codeArticle,
      };
      return [...prev, newTicket];
    });
  };

  const moveTicket = (ticketId, newPersonId, newDate) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            personId: newPersonId,
            date: newDate,
          };
        }
        return ticket;
      })
    );
  };

  const updateTicketType = (ticketId, type) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            type,
          };
        }
        return ticket;
      })
    );
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
