// Hilfsfunktion zum Formatieren der Zeit (HH:MM:SS)
export const formatTime = (duration) => {
    if (!duration) return "00:00:00";

    // Umrechnung von Millisekunden in Stunden, Minuten und Sekunden
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format: HH:MM:SS mit führenden Nullen
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Hilfsfunktion zum Formatieren des Datums
  export const formatDate = (dateString) => {
    if (!dateString) return "–";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };