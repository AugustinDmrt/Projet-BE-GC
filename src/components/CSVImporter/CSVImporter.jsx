import { useRef, useState } from "react";
import { WAITING_ZONE_DATE } from "../App/App";

export default function CSVImporter({ addTicket, closeModal }) {
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const processCSV = (csvText) => {
    const lines = csvText.split("\n");
    if (lines.length < 2) {
      setError("Le fichier CSV est vide ou invalide");
      return;
    }

    // Skip header row and process each line
    lines.slice(1).forEach((line) => {
      if (line.trim()) {
        const [codeArticle, designation, client, datePrevue] = line
          .split(";")
          .map((field) => field.trim());
        if (codeArticle && designation) {
          const description = `${designation} | ${client || ""}`.trim();
          const formattedDate = formatDate(datePrevue);
          addTicket(
            "waiting",
            formattedDate || WAITING_ZONE_DATE,
            description,
            "com",
            codeArticle
          );
        }
      }
    });

    closeModal();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Veuillez sélectionner un fichier CSV valide");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        processCSV(e.target.result);
      } catch (err) {
        setError("Erreur lors du traitement du fichier CSV");
        console.error(err);
      }
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier");
    };
    reader.readAsText(file);
  };

  return (
    <div className="csv-importer">
      <p className="import-instructions">
        Le fichier CSV doit contenir les colonnes:
        <br />
        Code Article;Désignation;Client;Date prévue de fin BE
      </p>
      {error && <p className="import-error">{error}</p>}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="file-input"
      />
    </div>
  );
}
