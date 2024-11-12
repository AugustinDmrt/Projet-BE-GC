import Database from "better-sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const db = new Database("tickets.db");

app.use(cors());
app.use(express.json());

// Drop existing tables to reset the schema
db.exec(`
  DROP TABLE IF EXISTS tickets;
  DROP TABLE IF EXISTS people;
`);

// Initialize database tables with updated schema
db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  -- Insert a special "waiting" person for tickets in the waiting zone
  INSERT OR IGNORE INTO people (id, name) VALUES ('waiting', 'Waiting Zone');

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    personId TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT,
    codeArticle TEXT,
    FOREIGN KEY (personId) REFERENCES people(id)
  );
`);

// People endpoints
app.get("/api/people", (req, res) => {
  // Exclude the special "waiting" person from the regular list
  const people = db
    .prepare("SELECT * FROM people WHERE id != ?")
    .all("waiting");
  res.json(people);
});

app.post("/api/people", (req, res) => {
  const { id, name } = req.body;
  try {
    db.prepare("INSERT INTO people (id, name) VALUES (?, ?)").run(id, name);
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tickets endpoints
app.get("/api/tickets", (req, res) => {
  try {
    const tickets = db.prepare("SELECT * FROM tickets").all();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tickets", (req, res) => {
  const { id, personId, date, description, type, codeArticle } = req.body;
  try {
    const result = db
      .prepare(
        "INSERT INTO tickets (id, personId, date, description, type, codeArticle) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(id, personId, date, description, type, codeArticle);
    res.json({ id, personId, date, description, type, codeArticle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tickets/:id", (req, res) => {
  const { personId, date, type } = req.body;
  try {
    db.prepare(
      "UPDATE tickets SET personId = ?, date = ?, type = ? WHERE id = ?"
    ).run(personId, date, type, req.params.id);
    res.json({ id: req.params.id, personId, date, type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
