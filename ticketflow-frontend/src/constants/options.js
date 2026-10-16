export const TICKET_STATES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export const ASSIGNABLE_ROLES = ["TECHNICIAN", "EMPLOYEE"];

export const ALL_ROLES = ["ADMIN", ...ASSIGNABLE_ROLES];

// Convierte una lista de valores en opciones { value, label } para los <select>
export function toOptions(values) {
    return values.map((value) => ({ value, label: value }));
}
