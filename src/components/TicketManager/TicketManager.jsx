import { useEffect, useState } from "react";
import { WAITING_ZONE_DATE } from "../App/App";

export default function TicketManager({
  people,
  addTicket,
  closeModal,
  initialTicket,
  onSubmit,
}) {
  const [ticket, setTicket] = useState({
    personId: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (initialTicket) {
      setTicket({
        personId:
          initialTicket.personId === "waiting" ? "" : initialTicket.personId,
        date:
          initialTicket.date === WAITING_ZONE_DATE ? "" : initialTicket.date,
        description: initialTicket.description,
      });
    }
  }, [initialTicket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticket.description.trim()) {
      if (initialTicket) {
        onSubmit(
          ticket.personId || "waiting",
          ticket.date || WAITING_ZONE_DATE,
          ticket.description.trim()
        );
      } else {
        addTicket(ticket.personId, ticket.date, ticket.description.trim());
      }
      setTicket({ personId: "", date: "", description: "" });
      closeModal();
    }
  };

  return (
    <div className="ticket-manager">
      <form onSubmit={handleSubmit}>
        <select
          value={ticket.personId}
          onChange={(e) => setTicket({ ...ticket, personId: e.target.value })}
          className="modal-input"
        >
          <option value="">Zone d'attente</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        {ticket.personId && (
          <input
            type="date"
            value={ticket.date}
            onChange={(e) => setTicket({ ...ticket, date: e.target.value })}
            className="modal-input"
          />
        )}
        <input
          type="text"
          value={ticket.description}
          onChange={(e) =>
            setTicket({ ...ticket, description: e.target.value })
          }
          placeholder="Description du ticket"
          required
          className="modal-input"
        />
        <button type="submit" className="modal-button">
          {initialTicket ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
