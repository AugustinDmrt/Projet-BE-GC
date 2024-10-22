import React, { useState } from "react";

function TicketManager({ people, tickets, addTicket, deleteTicket }) {
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
    }
  };

  return (
    <div className="ticket-manager">
      <h2>Add New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={newTicket.personId}
          onChange={(e) =>
            setNewTicket({ ...newTicket, personId: e.target.value })
          }
          required
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
        />
        <input
          type="text"
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket({ ...newTicket, description: e.target.value })
          }
          placeholder="Ticket description"
          required
        />
        <button type="submit">Add Ticket</button>
      </form>
    </div>
  );
}

export default TicketManager;
