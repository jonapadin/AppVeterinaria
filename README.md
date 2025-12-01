Veterinaria App - Frontend

Frontend de la aplicación de gestión de veterinaria. Permite a los usuarios interactuar con turnos, clientes, productos y pagos de manera intuitiva y rápida.

🛠 Tecnologías

React - Librería para construir interfaces de usuario.

Vite - Herramienta de construcción rápida y ligera.

TypeScript - Para tipado estático y mayor seguridad en el código.

Tailwind CSS - Framework de estilos utility-first para diseño rápido.

React Router - Manejo de rutas en la aplicación.

Axios / Fetch API - Para consumir el backend.

⚡ Funcionalidades

Visualizar y gestionar turnos.

Listar y editar clientes.

Consultar y administrar productos.

Recibir notificaciones en tiempo real.

Integración con Mercado Pago para pagos online.

Autenticación y control de acceso según rol de usuario.

📦 Instalación

Clonar el repositorio:

git clone https://github.com/tu-usuario/veterinaria-frontend.git


Instalar dependencias:

cd veterinaria-frontend
npm install


Crear archivo .env en la raíz del proyecto y configurar la URL del backend:

VITE_API_BASE_URL=http://localhost:3000/api/v1


Iniciar la aplicación en modo desarrollo:

npm run dev


La aplicación correrá por defecto en:

http://localhost:5173

🚀 Rutas principales

/ - Inicio / Dashboard.

/turnos - Gestión de turnos.

/clientes - Gestión de clientes.

/productos - Gestión de productos.

/notificaciones - Notificaciones en tiempo real.

/login - Inicio de sesión.

Algunas rutas requieren autenticación según el rol del usuario.

🧪 Pruebas

Si implementaste pruebas:

npm run test
npm run test:coverage

🤝 Contribuciones

Hacer un fork del repositorio.

Crear una rama nueva (git checkout -b feature/nueva-funcionalidad).

Hacer commit de los cambios (git commit -am 'Agregar nueva funcionalidad').

Hacer push a la rama (git push origin feature/nueva-funcionalidad).

Crear un Pull Request.
