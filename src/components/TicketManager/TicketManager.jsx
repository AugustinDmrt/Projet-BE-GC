import React, { useState } from "react";

export default function TicketManager({ people, addTicket, closeModal }) {
  const [newTicket, setNewTicket] = useState({
    personId: "",
    date: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTicket.personId && newTicket.date && newTicket.description.trim()) {
      addTicket(
        newTicket.personId,
        newTicket.date,
        newTicket.description.trim()
      );
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
          required
          className="modal-input"
        >
          <option value="">Select a person</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTicket.date}
          onChange={(e) => setNewTicket({ ...newTicket, date: e.target.value })}
          required
          className="modal-input"
        />
        <input
          type="text"
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket({ ...newTicket, description: e.target.value })
          }
          placeholder="Ticket description"
          required
          className="modal-input"
        />
        <button type="submit" className="modal-button">
          Add Ticket
        </button>
      </form>
    </div>
  );
}
