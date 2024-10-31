import React, { useState } from "react";

function PeopleManager({ people, addPerson }) {
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
      <h2>Employé</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Add new person"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PeopleManager;
