import LineIcon from "./LineIcon";

// Íconos de línea para las tarjetas de estadísticas del dashboard

// Ticket abierto / recibido
export function OpenTicketIcon(props) {
    return (
        <LineIcon {...props}>
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </LineIcon>
    );
}

// Ticket en progreso
export function InProgressIcon(props) {
    return (
        <LineIcon {...props}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </LineIcon>
    );
}

// Ticket cerrado
export function ClosedTicketIcon(props) {
    return (
        <LineIcon {...props}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </LineIcon>
    );
}
