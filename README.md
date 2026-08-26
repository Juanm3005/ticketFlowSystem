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

## Configuración del backend

1. Clona el repositorio y abre la carpeta del backend en IntelliJ IDEA.

2. Configura la conexión a la base de datos en `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:oracle:thin:@<tu_alias_tns>?TNS_ADMIN=<ruta_al_wallet>
   spring.datasource.username=<tu_usuario>
   spring.datasource.password=<tu_password>
   spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. Si usas una Autonomous Database en la nube, descomprime el Wallet en `src/main/resources/wallet` y, en la configuración de ejecución de IntelliJ (**Edit Configurations → VM options**), agrega:

   ```
   -Dwallet_location=$MODULE_DIR$/src/main/resources/wallet
   ```

4. Ejecuta los scripts SQL de `database/` (tablas, triggers y procedimientos) contra tu instancia de Oracle antes de levantar la aplicación por primera vez.

5. Corre la aplicación desde IntelliJ (▶️ sobre la clase principal) o con:

   ```bash
   mvn spring-boot:run
   ```

   El backend queda disponible en `http://localhost:8080`.

## Configuración del frontend

1. Entra a la carpeta del frontend:

   ```bash
   cd ticketflow-frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
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

Este es un proyecto académico/de práctica. Algunas decisiones (como el uso de HTTP Basic Auth en vez de JWT) se tomaron deliberadamente para mantener el enfoque en el aprendizaje del flujo completo antes que en la robustez de nivel productivo.
