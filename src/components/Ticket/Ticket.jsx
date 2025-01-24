import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { TICKET_TYPES } from "../App/App";

export default function Ticket({ ticket, updateTicketType, onEdit, onDelete }) {
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
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const menuWidth = 150; // Largeur approximative du menu

    // Calcul de la position horizontale
    let x = rect.left;
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10; // 10px de marge
    }

    setMenuPosition({
      x,
      y: rect.top + window.scrollY,
    });
    setShowActionMenu(true);
  };

  const handleTypeClick = (e) => {
    e.stopPropagation();
    setShowActionMenu(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const menuWidth = 150;

    let x = rect.left;
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }

    setMenuPosition({
      x,
      y: rect.top + window.scrollY,
    });
    setShowTypeMenu(true);
  };

  const handleTypeSelect = (type) => {
    updateTicketType(ticket.codeArticle || ticket.id, type);
    setShowTypeMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowActionMenu(false);
    onEdit(ticket);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowActionMenu(false);
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      onDelete(ticket.codeArticle || ticket.id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowTypeMenu(false);
        setShowActionMenu(false);
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

      {showActionMenu && (
        <div
          ref={menuRef}
          className="action-menu"
          style={{
            position: "fixed",
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
        >
          <div className="action-menu-item" onClick={handleTypeClick}>
            Changer le type
          </div>
          <div className="action-menu-item" onClick={handleEdit}>
            Modifier
          </div>
          <div className="action-menu-item delete" onClick={handleDelete}>
            Supprimer
          </div>
        </div>
      )}

      {showTypeMenu && (
        <div
          ref={menuRef}
          className="type-menu"
          style={{
            position: "fixed",
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
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
