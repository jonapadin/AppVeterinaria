import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// 🚨 IMPORTANTE: Asegúrate de cambiar esto a la URL de tu servidor de backend (ej. Node.js)
const SOCKET_SERVER_URL = "http://localhost:4000"; // Usualmente en el puerto 3001 o 8080

// Colores de la paleta
const PRIMARY_COLOR = 'bg-[#8F108D]';     
const AGENT_COLOR = 'bg-fuchsia-600';     
const HOVER_COLOR = 'hover:bg-fuchsia-900';

// 1. Tipado para un objeto de mensaje
interface Message {
    type: 'agent' | 'user';
    text: string;
}

// Interfaz para tipar las propiedades (props)
interface LiveChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Componente de burbuja de mensaje con avatares (Sin cambios en diseño)
const MessageBubble: React.FC<Message> = ({ type, text }) => { // Usamos la interfaz Message aquí
    const isAgent = type === 'agent';
    
    // Clases condicionales para posicionamiento y estilo
    const containerClasses = isAgent ? 'justify-start' : 'justify-end';
    const bubbleClasses = isAgent 
        ? `${AGENT_COLOR} text-white rounded-bl-none`
        : 'bg-gray-200 text-gray-800 rounded-br-none';
    
    // Avatar del Agente (Pata/Mascota)
    const AgentAvatar = (
        <div className="flex items-center justify-center w-8 h-8 mr-2 text-white bg-fuchsia-600 rounded-full ">
            🐾 
        </div>
    );
    
    // Avatar del Usuario (Inicial)
    const UserAvatar = (
        <div className="flex items-center justify-center w-8 h-8 ml-2 text-white bg-indigo-500 rounded-full text-xs font-bold">
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
    
    // 2. Estado para el socket, los mensajes y el input
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Para scroll automático

    // Función para hacer scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 3. useEffect para manejar la conexión y desconexión
    useEffect(() => {
        if (isOpen) {
            // Conectar al abrir el modal
            socketRef.current = io(SOCKET_SERVER_URL);

            // Añadir mensaje inicial (simulado)
            setMessages([{
                type: 'agent',
                text: "¡Hola! Soy Sofía, técnica veterinaria. Para ofrecerle la mejor ayuda, por favor, indíquenos el nombre, edad y especie de su mascota."
            }]);

            // Escuchar el evento 'message' desde el servidor
            socketRef.current.on('message', (message: Message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
            
            // Evento de confirmación de conexión (opcional)
            socketRef.current.on('connect', () => {
                console.log('Conectado al servidor de chat.');
            });

            // Limpieza: desconectar al cerrar o desmontar el componente
            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [isOpen]); 

    // 4. useEffect para hacer scroll cuando llegan nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // 5. Función para enviar el mensaje
    const sendMessage = () => {
        if (input.trim()) {
            const newMessage: Message = { type: 'user', text: input.trim() };
            
            // 6. Emitir mensaje al servidor
            socketRef.current.emit('sendMessage', newMessage); 
            
            // Actualizar localmente la lista de mensajes (renderizado optimista)
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            
            // Limpiar el input
            setInput('');
        }
    };
    
    // Función para manejar el Enter en el input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };


    if (!isOpen) return null;
    
    return (
        // Overlay (Fondo oscuro)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 backdrop-blur-sm">
            
            {/* Contenedor del Modal */}
            <div className="w-11/12 max-w-md overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 ease-out transform scale-100">
                
                {/* Encabezado Profesional */}
                <div className={`flex items-center justify-between p-4 text-white ${PRIMARY_COLOR} border-b-2 border-fuchsia-900`}>
                    <div className="flex items-center">
                        <span className="mr-3 text-2xl font-bold">🩺</span> 
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

                {/* Cuerpo/Área de Mensajes (Ahora dinámico) */}
                <div className="h-96 p-4 overflow-y-auto bg-white flex flex-col space-y-4">
                    
                    {/* Renderiza todos los mensajes en el estado 'messages' */}
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} type={msg.type} text={msg.text} />
                    ))}
                    
                    {/* Div invisible para hacer scroll automático */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Área de Entrada de Texto (Ahora funcional) */}
                <div className="flex p-4 bg-gray-100 border-t border-gray-200">
                    <input
                        type="text"
                        placeholder="Escriba su mensaje aquí..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress} // 7. Envío al presionar Enter
                        className="w-full p-3 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8F108D]"
                        aria-label="Campo de entrada de mensaje"
                    />
                    <button
                        onClick={sendMessage} // 8. Envío al hacer click
                        className={`px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 rounded-r-lg ${PRIMARY_COLOR} ${HOVER_COLOR} `}
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