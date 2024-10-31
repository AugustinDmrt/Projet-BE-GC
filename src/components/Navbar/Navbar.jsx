import React from "react";
import Modal from "../Modal/Modal";
import PeopleManager from "../PeopleManager/PeopleManager";
import TicketManager from "../TicketManager/TicketManager";

export default function Navbar({ people, addPerson, addTicket }) {
  const [isPeopleModalOpen, setIsPeopleModalOpen] = React.useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Calendrier BE</h1>
      <div className="navbar-buttons">
        <button
          onClick={() => setIsPeopleModalOpen(true)}
          className="navbar-button"
        >
          Add Person
        </button>
        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="navbar-button"
        >
          Add Ticket
        </button>
      </div>

      <Modal
        isOpen={isPeopleModalOpen}
        onClose={() => setIsPeopleModalOpen(false)}
        title="Add Person"
      >
        <PeopleManager people={people} addPerson={addPerson} />
      </Modal>

      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Add Ticket"
      >
        <TicketManager
          people={people}
          addTicket={addTicket}
          closeModal={() => setIsTicketModalOpen(false)}
        />
      </Modal>
    </nav>
  );
}
