import { useTickets, useTicketFilters } from "../hooks/useTickets";
import DashboardLayout from "../components/layout/DashboardLayout";
import TicketsSection from "../components/tickets/TicketsSection";
import TicketReports from "../components/tickets/TicketReports";
import TicketStatusChart from "../components/tickets/TicketStatusChart";

const NAV_ITEMS = [
    { id: "tickets", label: "Tickets", icon: "▣" },
    { id: "reports", label: "Reports", icon: "▥" },
];

function EmployeeDashboard() {
    const { tickets, stats, addTicket } = useTickets();
    const { filteredTickets, filters } = useTicketFilters(tickets);

    return (
        <DashboardLayout navItems={NAV_ITEMS} title="Welcome back, Employee" profileName="Employee">
            <TicketsSection
                onCreateTicket={addTicket}
                filters={filters}
                table={{ tickets, isEmpty: filteredTickets.length === 0 }}
            />

            <TicketReports>
                <TicketStatusChart {...stats} />
            </TicketReports>
        </DashboardLayout>
    );
}

export default EmployeeDashboard;
