import { useState } from "react";
import { WAITING_ZONE_DATE } from "../App/App";

export default function TicketManager({ people, addTicket, closeModal }) {
  const [newTicket, setNewTicket] = useState({
    personId: "",
    date: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTicket.description.trim()) {
      const personId = newTicket.personId || "waiting";
      const date = newTicket.date || WAITING_ZONE_DATE;
      addTicket(personId, date, newTicket.description.trim());
      setNewTicket({ personId: "", date: "", description: "" });
      closeModal();
    }
  };

  return (
    <div className="ticket-manager">
      <form onSubmit={handleSubmit}>
        <select
          value={newTicket.personId}
          onChange={(e) =>
            setNewTicket({ ...newTicket, personId: e.target.value })
          }
          className="modal-input"
        >
          <option value="">Zone d'attente</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        {newTicket.personId && (
          <input
            type="date"
            value={newTicket.date}
            onChange={(e) =>
              setNewTicket({ ...newTicket, date: e.target.value })
            }
            className="modal-input"
          />
        )}
        <input
          type="text"
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket({ ...newTicket, description: e.target.value })
          }
          placeholder="Description du ticket"
          required
          className="modal-input"
        />
        <button type="submit" className="modal-button">
          Ajouter
        </button>
      </form>
    </div>
  );
}
