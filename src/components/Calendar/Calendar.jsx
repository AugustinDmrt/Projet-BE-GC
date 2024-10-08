import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import "./Calendar.css";

const initialTickets = {
  "Person 1": {
    "Semaine 1": {
      Lundi: [{ id: "ticket-1", content: "Tâche 1" }],
      Mardi: [],
      Mercredi: [{ id: "ticket-2", content: "Tâche 2" }],
      Jeudi: [],
      Vendredi: [],
    },
    "Semaine 2": {
      Lundi: [],
      Mardi: [{ id: "ticket-3", content: "Tâche 3" }],
      Mercredi: [],
      Jeudi: [],
      Vendredi: [],
    },
  },
};

function Ticket({ id, content }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="ticket"
    >
      {content}
    </div>
  );
}

function CalendarCell({ tickets, day, week, person }) {
  const { setNodeRef } = useDroppable({
    id: `${person}-${week}-${day}`,
  });

  return (
    <td ref={setNodeRef} className="calendar-cell">
      <h4>{day}</h4>
      {/* Affichage des tickets directement dans la cellule */}
      {tickets.map((ticket) => (
        <Ticket key={ticket.id} id={ticket.id} content={ticket.content} />
      ))}
    </td>
  );
}

function Calendar() {
  const [tickets, setTickets] = useState(initialTickets);
  const [people, setPeople] = useState(["Person 1"]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const [person, week, day] = over.id.split("-");
    const source = findTicketLocation(tickets, active.id);

    if (!source) return;

    const newTickets = { ...tickets };

    // Retirer le ticket de son ancienne position
    newTickets[source.person][source.week][source.day] = newTickets[
      source.person
    ][source.week][source.day].filter((ticket) => ticket.id !== active.id);

    // Ajouter le ticket dans la nouvelle position
    newTickets[person][week][day].push({
      id: active.id,
      content: `Tâche ${active.id.split("-")[1]}`,
    });

    setTickets(newTickets);
  };

  const findTicketLocation = (tickets, ticketId) => {
    for (const person in tickets) {
      for (const week in tickets[person]) {
        for (const day in tickets[person][week]) {
          const dayTickets = tickets[person][week][day];
          if (dayTickets.find((ticket) => ticket.id === ticketId)) {
            return { person, week, day };
          }
        }
      }
    }
    return null;
  };

  const weeks = [
    "Semaine 1",
    "Semaine 2",
    "Semaine 3",
    "Semaine 4",
    "Semaine 5",
  ];
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  const addPerson = () => {
    const newPerson = `Person ${people.length + 1}`;
    setTickets((prev) => ({
      ...prev,
      [newPerson]: {
        "Semaine 1": {
          Lundi: [],
          Mardi: [],
          Mercredi: [],
          Jeudi: [],
          Vendredi: [],
        },
        "Semaine 2": {
          Lundi: [],
          Mardi: [],
          Mercredi: [],
          Jeudi: [],
          Vendredi: [],
        },
        "Semaine 3": {
          Lundi: [],
          Mardi: [],
          Mercredi: [],
          Jeudi: [],
          Vendredi: [],
        },
        "Semaine 4": {
          Lundi: [],
          Mardi: [],
          Mercredi: [],
          Jeudi: [],
          Vendredi: [],
        },
        "Semaine 5": {
          Lundi: [],
          Mardi: [],
          Mercredi: [],
          Jeudi: [],
          Vendredi: [],
        },
      },
    }));
    setPeople((prev) => [...prev, newPerson]);
  };

  return (
    <div>
      <h1>Calendrier de planification</h1>
      <button onClick={addPerson}>Ajouter une personne</button>
      <DndContext onDragEnd={handleDragEnd}>
        <table>
          <thead>
            <tr>
              <th>Personnes</th>
              {weeks.map((week) => (
                <th key={week}>{week}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person}>
                <td>{person}</td>
                {weeks.map((week) => (
                  <td key={week}>
                    {/* Affichage des jours avec leurs tickets dans une seule cellule */}
                    {days.map((day) => (
                      <CalendarCell
                        key={day}
                        day={day}
                        week={week}
                        person={person}
                        tickets={tickets[person]?.[week]?.[day] || []}
                      />
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}

export default Calendar;
