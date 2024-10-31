import React, { useState } from "react";

export default function PeopleManager({ people, addPerson }) {
  const [newPerson, setNewPerson] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPerson.trim()) {
      addPerson(newPerson.trim());
      setNewPerson("");
    }
  };

  return (
    <div className="people-manager">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Add new person"
          className="modal-input"
        />
        <button type="submit" className="modal-button">
          Add
        </button>
      </form>
      <ul className="people-list">
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}
