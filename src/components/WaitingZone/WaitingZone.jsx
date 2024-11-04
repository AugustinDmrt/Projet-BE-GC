import { useDrop } from "react-dnd";
import { WAITING_ZONE_DATE } from "../App/App";
import Ticket from "../Ticket/Ticket";

export default function WaitingZone({ tickets, moveTicket, updateTicketType }) {
  const [{ isOver }, drop] = useDrop({
    accept: "ticket",
    drop: (item) => {
      moveTicket(item.id, "waiting", WAITING_ZONE_DATE);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="waiting-zone"
      style={{
        backgroundColor: isOver ? "#e9ecef" : "#f8f9fa",
      }}
    >
      {/* <h3>Zone d'attente des tickets ({tickets.length})</h3> */}
      <div className="waiting-zone-tickets">
        {tickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            updateTicketType={updateTicketType}
          />
        ))}
      </div>
    </div>
  );
}
