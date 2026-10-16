# AGENTS.md — TicketFlow Frontend

Guía para agentes de IA (y personas) que trabajen en la SPA de TicketFlow. El backend tiene su propia guía en `../ticketflow-backend/AGENTS.md`.

## Problema que resuelve

TicketFlow es un sistema de **gestión de tickets de soporte (helpdesk)**. Los empleados reportan incidencias técnicas, los técnicos las atienden y los administradores supervisan todo el flujo. Este frontend ofrece un dashboard por rol para:

- **Crear tickets** (`title`, `description`) desde `CreateTicketModal`; nacen en estado `OPEN`.
- **Editar tickets**: cambiar su estado (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`) desde la tabla con un select + "Execute". Pasar a `IN_PROGRESS` asigna el ticket al técnico.
- **Eliminar tickets**: solo el admin, seleccionándolos en la tabla ("Delete Selected").
- Ver estadísticas por estado (gráfico y KPIs) y, en el caso del admin, gestionar usuarios y ver la actividad reciente (auditoría).

### Roles y vistas

| Rol | Ruta | Ve | Puede |
|---|---|---|---|
| `EMPLOYEE` | `/employee` | Sus tickets | Crear tickets |
| `TECHNICIAN` | `/technician` | Tickets sin asignar + los suyos | Crear y cambiar estado |
| `ADMIN` | `/admin` | Todo | Crear, cambiar estado, eliminar tickets; gestionar usuarios; ver auditoría |

Los permisos reales los aplica el backend; el frontend solo muestra u oculta acciones.

## Arquitectura

Stack: React 19, Vite 8, Tailwind 4 (`@tailwindcss/vite`), React Router 7, Recharts. Desplegado en Vercel.

```
[React SPA] --fetch + HTTP Basic (header en localStorage)--> [API Spring Boot] (VITE_API_URL)
```

| Carpeta (`src/`) | Contenido |
|---|---|
| `App.jsx` | Rutas (`/login`, `/register`, `/admin`, `/technician`, `/employee`), restauración de sesión vía `getCurrentUser()` |
| `pages/` | Un dashboard por rol: `AdminPage`, `TechnicianPage`, `EmployeePage`. Componen secciones y hooks |
| `services/api.js` | Todas las llamadas `fetch` a la API, con el header `Authorization` tomado de `localStorage.authHeader` |
| `hooks/useTickets.js` | `useTickets` (carga, contadores por estado, crear, cambiar estado), `useTicketFilters`, `useTicketSelection`, `useTicketStateActions` |
| `hooks/useActiveSection.js` | Resalta en el sidebar la sección visible al hacer scroll |
| `components/tickets/` | `TicketsSection`, `TicketTable`, `TicketFilters`, `CreateTicketModal`, `TicketStatusChart`, `TicketReports`, `RecentActivity` |
| `components/users/` | `UsersSection`, `UserTable`, `AddUserModal` (solo admin) |
| `components/dashboard/` | `DashboardOverview`, `StatCard` (KPIs) |
| `components/layout/` | `DashboardLayout`, `Sidebar`, `DashboardHeader` |
| `components/ui/` | Primitivas reutilizables: `Button`, `Card`, `Modal`, `Table`, `FormField`, `FilterBar`, `ActionSelect` |
| `components/auth/` | Piezas de `Login`/`Register` |
| `components/icons/` | Íconos SVG como componentes |
| `constants/options.js` | `TICKET_STATES`, roles y helper `toOptions` |

- **Autenticación**: al hacer login se guarda `Basic base64(email:password)` en `localStorage` y se valida contra `/users/me`. `ProtectedRoute` restringe cada página por rol.
- **Estado**: solo estado local de React + hooks personalizados (sin Redux/Context). Las pages orquestan; los componentes son mayormente presentacionales y reciben props agrupadas (`filters`, `table`, `selection`, `stateActions`).

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173 (requiere VITE_API_URL en .env)
npm run lint
npm run build
npm run preview
```

## Convenciones para agentes

- Toda llamada HTTP nueva va en `services/api.js`; no hacer `fetch` directo en componentes ni hooks.
- La lógica de tickets reutilizable va en `hooks/useTickets.js`; las pages solo componen.
- Reutilizar `components/ui/` antes de crear un componente nuevo; estilos con clases de Tailwind.
- Los estados válidos de ticket deben coincidir con el enum `TicketState` del backend (`constants/options.js`).
- `.env` no se versiona.

## Deudas técnicas conocidas

- `useTickets` hace `fetch("http://localhost:8080/tickets")` hardcodeado en vez de usar `VITE_API_URL` / `api.js`.
- `api.js` contiene una función `handleSubmit` huérfana (copiada de `Login`) y `deleteTicket` no verifica `response.ok`.
- Las pages pasan `tickets` (no `filteredTickets`) a la tabla, por lo que los filtros solo afectan el estado vacío.
- `ProtectedRoute` redirige a `/tickets`, ruta inexistente (cae en el catch-all).
- Las credenciales se guardan en `localStorage` en Basic (base64), no en un token.
