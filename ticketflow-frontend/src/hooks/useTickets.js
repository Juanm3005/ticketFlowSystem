import { useEffect, useState } from "react";
import { createTicket, changeTicketState } from "../services/api";
const API_URL = import.meta.env.VITE_API_URL;

// Trae los tickets y mantiene los contadores por estado
export function useTickets() {
    const [tickets, setTickets] = useState([]);
    const [totalTickets, setTotalTickets] = useState(null);
    const [openTickets, setOpenTickets] = useState(null);
    const [inProgressTickets, setInProgressTickets] = useState(null);
    const [resolvedTickets, setResolvedTickets] = useState(null);
    const [closedTickets, setClosedTickets] = useState(null);

    function updateStateCounts(list) {
        setOpenTickets(list.filter(t => t.state === "OPEN").length);
        setInProgressTickets(list.filter(t => t.state === "IN_PROGRESS").length);
        setResolvedTickets(list.filter(t => t.state === "RESOLVED").length);
        setClosedTickets(list.filter(t => t.state === "CLOSED").length);
    }

    useEffect(() => {
        const fetchTotalTickets = async () => {
            try {
                const res = await fetch(`${API_URL}/tickets`, {
                    headers: {
                        "Authorization": localStorage.getItem("authHeader")
                    }
                });

                if (!res.ok) throw new Error("Error to obtain data");

                const data = await res.json();
                setTotalTickets(data.length);
                updateStateCounts(data);
                setTickets(data); // Guarda todos los tickets en el estado
            } catch (error) {
                console.error(error);
            }
        };

        fetchTotalTickets();
    }, []);

    async function addTicket(ticketData) {
        try {
            await createTicket(ticketData);

            setTotalTickets(prev => prev + 1);
            setOpenTickets(prev => prev + 1);
            return true;
        } catch (error) {
            console.error(error);
            alert(error.message);
            return false;
        }
    }

    async function changeState(ticket, newState) {
        if (!newState) return alert("Select a new state to change.");

        try {
            await changeTicketState(ticket.id, newState);

            setTickets(prev => {
                const updated = prev.map(t => t.id === ticket.id ? { ...t, state: newState } : t);
                updateStateCounts(updated);
                return updated;
            });
        } catch (error) {
            console.error(error);
            alert("no have permission to change the state of this ticket1");
        }
    }

    return {
        tickets,
        setTickets,
        setTotalTickets,
        stats: {
            total: totalTickets,
            open: openTickets,
            inProgress: inProgressTickets,
            resolved: resolvedTickets,
            closed: closedTickets,
        },
        addTicket,
        changeState,
    };
}

// Búsqueda por asunto + filtro por estado
export function useTicketFilters(tickets) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredTickets = tickets.filter(ticket => {
        const matchesSubject = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || ticket.state === statusFilter;
        return matchesSubject && matchesStatus;
    });

    return {
        filteredTickets,
        filters: {
            searchTerm,
            onSearchChange: setSearchTerm,
            statusFilter,
            onStatusChange: setStatusFilter,
            onClear: () => {
                setSearchTerm("");
                setStatusFilter("ALL");
            },
        },
    };
}

// Selección de tickets con checkboxes
export function useTicketSelection(tickets) {
    const [selectedTickets, setSelectedTickets] = useState([]);

    function toggleTicketSelection(id) {
        setSelectedTickets(prev =>
            prev.includes(id)
                ? prev.filter(ticketId => ticketId !== id)
                : [...prev, id]
        );
    }

    function toggleSelectAll() {
        if (selectedTickets.length === tickets.length) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(tickets.map(t => t.id));
        }
    }

    return {
        selectedTickets,
        setSelectedTickets,
        selection: {
            selectedIds: selectedTickets,
            onToggle: toggleTicketSelection,
            onToggleAll: toggleSelectAll,
        },
    };
}

// Estado elegido en el <select> de cada fila antes de pulsar "Execute"
export function useTicketStateActions(changeState) {
    const [ticketStateSelections, setTicketStateSelections] = useState({});

    function setTicketStateSelection(ticketId, value) {
        setTicketStateSelections(prev => ({
            ...prev,
            [ticketId]: value
        }));
    }

    return {
        selections: ticketStateSelections,
        onSelect: setTicketStateSelection,
        onExecute: (ticket) => changeState(ticket, ticketStateSelections[ticket.id]),
    };
}
