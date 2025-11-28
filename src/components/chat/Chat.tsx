import React from 'react';

// Colores de la paleta (ajustados para un look más profesional)
const PRIMARY_COLOR = 'bg-[#8F108D]';     // Tu color fucsia principal
const AGENT_COLOR = 'bg-fuchsia-600'      // Verde Azulado para el Agente (Profesional/Salud)
const HOVER_COLOR = 'hover:bg-fuchsia-900';

// Interfaz para tipar las propiedades (props)
interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente de burbuja de mensaje con avatares
const MessageBubble: React.FC<{ type: 'agent' | 'user'; text: string }> = ({ type, text }) => {
  const isAgent = type === 'agent';
  
  // Clases condicionales para posicionamiento y estilo
  const containerClasses = isAgent ? 'justify-start' : 'justify-end';
  const bubbleClasses = isAgent 
    ? `${AGENT_COLOR} text-white rounded-bl-none`
    : 'bg-gray-200 text-gray-800 rounded-br-none';
  
  // Avatar del Agente (Pata/Mascota)
  const AgentAvatar = (
    <div className="flex items-center justify-center w-8 h-8 mr-2 text-white bg-fuchsia-600 rounded-full ">
      🐾 {/* Icono de Pata más profesional */}
    </div>
  );
  
  // Avatar del Usuario (Inicial)
  const UserAvatar = (
    <div className="flex items-center justify-center w-8 h-8 ml-2 text-white bg-indigo-500 rounded-full text-xs font-bold ">
      U
    </div>
  );
  
  return (
    <div className={`flex ${containerClasses}`}>
      {isAgent && AgentAvatar}
      <div className={`max-w-[80%] px-4 py-3 text-sm rounded-xl shadow-md ${bubbleClasses} whitespace-pre-wrap`}>
        {text}
      </div>
      {!isAgent && UserAvatar}
    </div>
  );
};


const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Overlay (Fondo oscuro)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 transition-opacity duration-300 backdrop-blur-sm">
      
      {/* Contenedor del Modal */}
      <div className="w-11/12 max-w-md overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 ease-out transform scale-100">
        
        {/* Encabezado Profesional */}
        <div className={`flex items-center justify-between p-4 text-white ${PRIMARY_COLOR} border-b-2 border-fuchsia-900`}>
          <div className="flex items-center">
            <span className="mr-3 text-2xl font-bold">🩺</span> {/* Ícono de salud */}
            <h3 className="text-xl font-semibold">Asistencia Veterinaria Online</h3>
          </div>
          <button
            onClick={onClose}
            className="text-3xl font-light leading-none transition-colors duration-200 hover:text-gray-200"
            aria-label="Cerrar Chat"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo/Área de Mensajes */}
        <div className="h-96 p-4 overflow-y-auto bg-white flex flex-col space-y-4">
          
          <MessageBubble 
            type="agent" 
            text="¡Hola! Soy Sofía, técnica veterinaria. Para ofrecerle la mejor ayuda, por favor, indíquenos el nombre, edad y especie de su mascota." 
          />
          <MessageBubble 
            type="user" 
            text="Mi perro Max (4 años, Golden Retriever) está vomitando desde esta mañana." 
          />
          <MessageBubble 
            type="agent" 
            text="Gracias por la información, haremos todo lo posible para ayudar a Max. ¿Ha comido o bebido algo diferente últimamente? ¿El vómito es frecuente?" 
          />
          
        </div>

        {/* Área de Entrada de Texto */}
        <div className="flex p-4 bg-gray-100 border-t border-gray-200">
          <input
            type="text"
            placeholder="Escriba su mensaje aquí..."
            className="w-full p-3 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8F108D]"
            aria-label="Campo de entrada de mensaje"
          />
          <button
            className={`px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 rounded-r-lg ${PRIMARY_COLOR} ${HOVER_COLOR}`}
            aria-label="Enviar Mensaje"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;