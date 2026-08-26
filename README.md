# TicketFlow

Sistema de gestión de incidencias (helpdesk) desarrollado como proyecto de práctica para aplicar Spring Boot, Oracle PL/SQL y React en un flujo completo de desarrollo full-stack.

## Descripción

TicketFlow permite a los empleados de una organización reportar incidencias técnicas, que luego son atendidas por técnicos y supervisadas por administradores. El sistema maneja distintos niveles de acceso según el rol del usuario, mantiene un historial de auditoría de cada cambio de estado, y calcula estadísticas de resolución directamente en la base de datos.

### Roles del sistema

- **Employee**: puede crear tickets y ver únicamente los tickets que ha creado.
- **Technician**: puede tomar tickets sin asignar, cambiar el estado de los tickets que tiene asignados, y ver todos los tickets del sistema.
- **Admin**: acceso completo — puede ver, eliminar y reasignar cualquier ticket, así como gestionar roles de usuarios.

### Funcionalidades principales

- Registro y autenticación de usuarios (Spring Security con contraseñas encriptadas vía BCrypt).
- Autorización granular por rol y por dato (un empleado solo ve sus propios tickets; un técnico solo puede modificar tickets que le pertenecen).
- Ciclo de vida de tickets: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`.
- Auditoría automática en base de datos: cada creación y cambio de estado de un ticket queda registrado (quién lo hizo y cuándo) mediante triggers PL/SQL, capturando el usuario real de la aplicación a través de `CLIENT_IDENTIFIER`.
- Procedimiento almacenado en PL/SQL para calcular el tiempo promedio de resolución de tickets.
- Filtro de historial de tickets cerrados vía query param (`GET /tickets?state=CLOSED`).
- Frontend en React con rutas protegidas según el rol del usuario autenticado.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Base de datos | Oracle Autonomous Database (Oracle Cloud Free Tier) |
| Frontend | React + Vite, React Router |
| Autenticación | HTTP Basic Auth |
| Pruebas de API | Postman |
| Control de versiones | Git / GitHub |

## Requisitos previos

- Java 21 (JDK)
- Maven (integrado en IntelliJ IDEA o instalado por separado)
- Node.js y npm
- Una instancia de Oracle Database accesible (local con Oracle XE, o en la nube con Oracle Cloud Free Tier)
- El **Wallet** de conexión, si se usa una Autonomous Database en Oracle Cloud

## Backend
1. Ejecuta el backend 
El backend queda disponible en `http://localhost:8080`.

## Configuración del frontend

1. Entra a la carpeta del frontend:

   ```bash
   cd ticketflow-frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install react-router-dom
   ```

3. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   El frontend queda disponible en `http://localhost:5173`.

> El backend debe estar corriendo antes de usar el frontend, y debe tener configurado CORS para aceptar peticiones desde `http://localhost:5173`.

## Uso

1. Abre `http://localhost:5173/register` y crea una cuenta (queda registrada por defecto con rol `EMPLOYEE`).
2. Inicia sesión en `http://localhost:5173/login`.
3. Según el rol del usuario, la aplicación redirige automáticamente a la vista correspondiente (empleado, técnico o administrador).
4. Para promover un usuario a `TECHNICIAN` o `ADMIN`, actualiza su rol directamente en la base de datos o mediante un usuario `ADMIN` existente.

## Endpoints principales de la API

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/users/register` | Registro de un nuevo usuario | Público |
| GET | `/users/me` | Datos del usuario autenticado | Autenticado |
| GET | `/users` | Listado de usuarios | Admin |
| POST | `/tickets` | Crear un ticket | Autenticado |
| GET | `/tickets` | Listar tickets (filtrados por rol; admite `?state=` como filtro) | Autenticado |
| PATCH | `/tickets/{id}/estado` | Cambiar el estado de un ticket | Technician / Admin |
| DELETE | `/tickets/{id}` | Eliminar un ticket | Admin |

## Notas

Usuario Admin creado:
correo: juanm3005@example.com
contraseña: camilo3005

Este es un proyecto académico/de práctica. Algunas decisiones (como el uso de HTTP Basic Auth en vez de JWT) se tomaron deliberadamente para mantener el enfoque en el aprendizaje del flujo completo antes que en la robustez de nivel productivo.
