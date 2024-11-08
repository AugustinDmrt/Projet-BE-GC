import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { TICKET_TYPES } from "../App/App";

export default function Ticket({ ticket, updateTicketType }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ticket",
      item: { id: ticket.codeArticle || ticket.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [ticket.codeArticle, ticket.id]
  );

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });
    setShowTypeMenu(true);
  };

  const handleTypeSelect = (type) => {
    updateTicketType(ticket.codeArticle || ticket.id, type);
    setShowTypeMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowTypeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const typeClass = ticket.type ? `type-${ticket.type}` : "";

  return (
    <>
      <div
        ref={drag}
        className={`ticket ${typeClass} ${isDragging ? "dragging" : ""}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={handleClick}
      >
        {ticket.description}
      </div>

      {showTypeMenu && (
        <div
          ref={menuRef}
          className="type-menu"
          style={
            {
              // left: menuPosition.x,
              // top: menuPosition.y,
            }
          }
        >
          {Object.entries(TICKET_TYPES).map(([type, { name, color }]) => (
            <div
              key={type}
              className="type-menu-item"
              onClick={() => handleTypeSelect(type)}
            >
              <span
                className="type-indicator"
                style={{ backgroundColor: color }}
              />
              {name}
            </div>
          ))}
          {ticket.type && (
            <div
              className="type-menu-item"
              onClick={() => handleTypeSelect(null)}
            >
              <span
                className="type-indicator"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              Aucun type
            </div>
          )}
        </div>
      )}
    </>
  );
}
