import { useDrag } from "react-dnd";

export default function Ticket({ ticket }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ticket",
    item: { id: ticket.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`ticket ${isDragging ? "dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {ticket.description}
    </div>
  );
}
