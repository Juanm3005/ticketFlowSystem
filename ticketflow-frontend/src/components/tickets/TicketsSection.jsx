import { useState } from "react";
import { Card, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import { TableFooter } from "../ui/Table";
import CreateTicketModal from "./CreateTicketModal";
import TicketFilters from "./TicketFilters";
import TicketTable from "./TicketTable";

/*
 * Tarjeta de "Tickets": encabezado con acciones, modal de creación,
 * filtros, tabla y (opcionalmente) el pie con paginación.
 * - `footer`: "summary" | "plain" | null
 */
function TicketsSection({ onCreateTicket, onDeleteSelected, filters, table, footer = null }) {
    const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState("");
    const [newTicketDescription, setNewTicketDescription] = useState("");

    async function handleCreateTicket(e) {
        e.preventDefault();
        const created = await onCreateTicket({
            title: newTicketTitle,
            description: newTicketDescription,
            status: "OPEN"
        });

        if (created) {
            setShowCreateTicketForm(false);
            setNewTicketTitle("");
            setNewTicketDescription("");
        }
    }

    return (
        <section id="tickets">
            <Card>
                <CardHeader title="Tickets" description="Manage and track all support tickets.">
                    {showCreateTicketForm && (
                        <CreateTicketModal
                            title={newTicketTitle}
                            description={newTicketDescription}
                            onTitleChange={setNewTicketTitle}
                            onDescriptionChange={setNewTicketDescription}
                            onSubmit={handleCreateTicket}
                            onClose={() => setShowCreateTicketForm(false)}
                        />
                    )}

                    <div className="flex flex-col items-stretch gap-2 w-[155px]">
                        <Button variant="createTicket" onClick={() => setShowCreateTicketForm(true)}>
                            + Create Ticket
                        </Button>

                        {onDeleteSelected && (
                            <Button variant="deleteSelected" onClick={onDeleteSelected}>
                                ♲ Delete Selected
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <TicketFilters {...filters} />

                <TicketTable {...table} />

                {footer && <TableFooter showSummary={footer === "summary"} />}
            </Card>
        </section>
    );
}

export default TicketsSection;
