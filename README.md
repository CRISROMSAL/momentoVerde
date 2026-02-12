MomentoVerde

Idea y temática:
Es una aplicación web diseñada para ayudar a los amantes de las plantas a gestionar el cuidado de su jardín.

La problemática principal que resuelve es el olvido de las fechas de riego. A través de un sistema visual e intuitivo, la aplicación permite a los usuarios:
* Registrar sus plantas con fotos personalizadas.
* Establecer la frecuencia de riego para cada especie.
* Visualizar mediante un código de colores (Semáforo) el estado de cada planta:
    * Todo bien: Aún no toca regar.
    * Regar Hoy: Toca regar en el día actual.
    * Retrasado: Se pasó la fecha y permite registrar cuándo se regó realmente para recalcular el calendario.

El diseño busca transmitir calma y naturaleza, utilizando una paleta de colores verdes y una interfaz limpia.

---
Tecnologías Utilizadas:
Backend:
* Node.js & Express: Servidor y enrutamiento.
* MongoDB & Mongoose: Base de datos NoSQL y modelado de datos.
* JWT (JSON Web Token): Autenticación segura de usuarios.
* Bcryptjs: Encriptación de contraseñas.
* Cors: Gestión de peticiones cruzadas.

Frontend:
* React: Librería principal para la interfaz de usuario.
* React Router DOM: Navegación entre páginas (SPA).
* Axios: Cliente HTTP para conectar con el backend.
* SweetAlert2: Alertas modales profesionales y amigables.
* CSS3: Estilos personalizados y diseño responsivo (Grid/Flexbox).

---
Instrucciones de Instalación y Ejecución:
1. Clonar el repositorio
2. Configurar el backend:
   cd backend
   npm install
3. Crea un archivo.env en la carpeta backend con las variables (pedirmelo por correo electrónico)
4. Arrancar el servidor:
   node server.js
5. Configurar el frontend
   cd frontend
   npm install
6. Instalación de la librería de alertas
   npm install sweetalert2
7. Arrancar la aplicación:
   npm start

---
Estructura del proyecto:
El proyecto está dividido en dos carpetas principales:

MomentoVerde/
│
├── backend/                # Servidor y API
│   ├── config/             # Configuración de DB
│   ├── controllers/        # Lógica de las funciones (Auth, Plants)
│   ├── middleware/         # Protección de rutas (auth.js)
│   ├── models/             # Esquemas de Mongoose (User, Plant)
│   ├── routes/             # Definición de endpoints
│   ├── server.js           # Punto de entrada del servidor
│   └── .env                # Variables de entorno (NO subir a GitHub)
│
├── frontend/               # Cliente React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (RutaPrivada)
│   │   ├── pages/          # Vistas principales
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── App.js          # Configuración de rutas
│   │   └── App.css         # Estilos globales
│   └── package.json
│
└── README.md

---
Usuarios de prueba:
Para probar la aplicación rápidamente sin necesidad de registrarse, puedes usar estas credenciales:
crisromsal@gail.com 123456
carlosbasulto@gmail.com 123456
