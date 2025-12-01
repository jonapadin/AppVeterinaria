import React from 'react';
const SectionChat: React.FC = () => {

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#8F108D] mb-6">
        Asistencia de Chat en Vivo 💬
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">

        {/* Columna 1: Lista de Chats Activos */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 overflow-y-auto border border-gray-200">
          <h2 className="font-bold text-lg mb-4 text-gray-700">Conversaciones Activas (0)</h2>
          {/* Aquí iría la lista de clientes esperando respuesta */}
          <div className="text-gray-500 italic">No hay chats pendientes.</div>
        </div>

        {/* Columna 2: Área de Chat Seleccionada */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg flex flex-col border border-gray-200">
          <div className="p-4 border-b">
            <span className="font-semibold text-gray-800">Selecciona un chat...</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-gray-400 flex items-center justify-center">
            Esperando una conversación para mostrar.
          </div>
          {/* Input de Respuesta del Agente */}
          <div className="p-4 border-t flex gap-3">
            <input
              type="text"
              placeholder="Escribe una respuesta..."
              className="flex-1 p-2 border rounded-lg bg-gray-50"
            />

            <button
              className="px-4 py-2 bg-[#8F108D] text-white rounded-lg  "
            >
              Enviar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SectionChat;