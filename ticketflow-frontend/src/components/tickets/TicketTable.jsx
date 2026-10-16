import { Table, Th, Tr, Td, EmptyRow } from "../ui/Table";
import ActionSelect from "../ui/ActionSelect";
import Button from "../ui/Button";
import { TICKET_STATES, toOptions } from "../../constants/options";

const STATE_OPTIONS = toOptions(TICKET_STATES);

/*
 * Tabla de tickets. Las columnas de selección y de acciones son opcionales:
 * - `selection`: { selectedIds, onToggle, onToggleAll }
 * - `stateActions`: { selections, onSelect, onExecute }
 */
function TicketTable({ tickets, isEmpty, selection, stateActions }) {
    return (
        <Table>
            <thead>
                <tr>
                    {selection && (
                        <Th>
                            <input
                                type="checkbox"
                                checked={tickets.length > 0 && selection.selectedIds.length === tickets.length}
                                onChange={selection.onToggleAll}
                            />
                        </Th>
                    )}
                    <Th>ID</Th>
                    <Th>Subject</Th>
                    <Th>Created By</Th>
                    <Th>Status</Th>
                    <Th>Assigned To</Th>
                    {stateActions && <Th>Actions</Th>}
                </tr>
            </thead>

            <tbody>
                {isEmpty ? (
                    <EmptyRow colSpan="7" message="No tickets to display" />
                ) : (
                    tickets.map((ticket) => (
                        <Tr key={ticket.id}>
                            {selection && (
                                <Td>
                                    <input
                                        type="checkbox"
                                        checked={selection.selectedIds.includes(ticket.id)}
                                        onChange={() => selection.onToggle(ticket.id)}
                                    />
                                </Td>
                            )}
                            <Td>{ticket.id}</Td>
                            <Td>{ticket.title}</Td>
                            <Td>{ticket.createdBy.username}</Td>
                            <Td>{ticket.state}</Td>
                            <Td>{ticket.assignedTo?.username || "Unassigned"}</Td>
                            {stateActions && (
                                <Td>
                                    <ActionSelect
                                        value={stateActions.selections[ticket.id] || ticket.state}
                                        onChange={(e) => stateActions.onSelect(ticket.id, e.target.value)}
                                        options={STATE_OPTIONS}
                                    />

                                    <Button variant="execute" onClick={() => stateActions.onExecute(ticket)}>
                                        Execute
                                    </Button>
                                </Td>
                            )}
                        </Tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}

export default TicketTable;
