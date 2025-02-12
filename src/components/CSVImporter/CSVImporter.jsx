import { useRef, useState } from "react";

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
        const [id, designation, client, datePrevue] = line
          .split(";")
          .map((field) => field.trim());
        if (id && designation) {
          const description = `${designation}${client ? ` | ${client}` : ""}${
            datePrevue ? ` | ${datePrevue}` : ""
          }`.trim();
          addTicket(undefined, undefined, description, "com", id);
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
        Identifiant interne (ID);Désignation;Client;Date Fin BE Calculée
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
