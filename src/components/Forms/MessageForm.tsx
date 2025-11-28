import React, { useState } from "react";

interface Message {
  id: string;
  text: string;
  createdAt: string; // La fecha suele ser una cadena (string) ISO 8601 en la respuesta JSON
}

const NESTJS_BASE_URL = "http://localhost:3000";

// Define el tipo para las props si se necesitaran
interface MessageFormProps {
  // Aquí podrías agregar una prop si quisieras notificar al padre
  onSubmitted: () => void;
}

const MessageForm: React.FC<MessageFormProps> = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Tipado explícito para el evento del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    // Extraemos el valor y lo aseguramos como string
    const messageText = formData.get("text") as string | null;

    if (!messageText || messageText.trim() === "") {
      alert("El mensaje no puede estar vacío.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${NESTJS_BASE_URL}/messages/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) {
        console.error("Error al iniciar el pago:", response.status);
        alert("Error al iniciar el proceso de pago.");
        return;
      }

      const data = await response.json();

      // 🔥 Redirigimos desde el frontend
      window.location.href = data.url;
    } catch (error) {
      console.error("Error de red/conexión:", error);
      alert("Ocurrió un error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <textarea
        className="border-2 border-blue-400 p-2"
        name="text"
        placeholder="Hola perro"
        rows={3}
        required
      />
      <button
        className="rounded bg-blue-400 p-2"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Cargando..." : "Enviar y Pagar"}
      </button>
    </form>
  );
};

export default MessageForm;
