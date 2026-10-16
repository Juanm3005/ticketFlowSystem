import { useTickets, useTicketFilters, useTicketSelection, useTicketStateActions } from "../hooks/useTickets";
import DashboardLayout from "../components/layout/DashboardLayout";
import TicketsSection from "../components/tickets/TicketsSection";
import TicketReports from "../components/tickets/TicketReports";
import TicketStatusChart from "../components/tickets/TicketStatusChart";

const NAV_ITEMS = [
    { id: "tickets", label: "Tickets", icon: "▣" },
    { id: "reports", label: "Reports", icon: "▥" },
];

function TechnicianDashboard() {
    const { tickets, stats, addTicket, changeState } = useTickets();
    const { filteredTickets, filters } = useTicketFilters(tickets);
    const { selection } = useTicketSelection(tickets);
    const stateActions = useTicketStateActions(changeState);

    return (
        <DashboardLayout navItems={NAV_ITEMS} title="Welcome back, Technician 👋" profileName="Technician">
            <TicketsSection
                onCreateTicket={addTicket}
                filters={filters}
                table={{ tickets, isEmpty: filteredTickets.length === 0, selection, stateActions }}
                footer="plain"
            />

            <TicketReports>
                <TicketStatusChart {...stats} />
            </TicketReports>
        </DashboardLayout>
    );
}

export default TechnicianDashboard;
