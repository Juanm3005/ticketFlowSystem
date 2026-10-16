import { useEffect, useState } from "react";
import { deleteUser, updateUserRole, createUserByAdmin, deleteTicket, getTicketAudit } from "../services/api";
import { useTickets, useTicketFilters, useTicketSelection, useTicketStateActions } from "../hooks/useTickets";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import UsersSection from "../components/users/UsersSection";
import TicketsSection from "../components/tickets/TicketsSection";
import TicketReports from "../components/tickets/TicketReports";
import TicketStatusChart from "../components/tickets/TicketStatusChart";
import { DashboardIcon, UsersIcon, TicketIcon, ReportsIcon } from "../components/icons/NavIcons";
import RecentActivity from "../components/tickets/RecentActivity";
import '.env';
const API_URL = meta.env.VITE_API_URL;

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "users", label: "Users", icon: <UsersIcon /> },
    { id: "tickets", label: "Tickets", icon: <TicketIcon /> },
    { id: "reports", label: "Reports", icon: <ReportsIcon /> },
];

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(null);
    const [rowActions, setRowActions] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);

    const { tickets, setTickets, setTotalTickets, stats, addTicket, changeState } = useTickets();
    const { filteredTickets, filters } = useTicketFilters(tickets);
    const { selectedTickets, setSelectedTickets, selection } = useTicketSelection(tickets);
    const stateActions = useTicketStateActions(changeState);

    async function handleDeleteSelected() {
        if (selectedTickets.length === 0) return;
        if (!window.confirm(`¿Eliminar ${selectedTickets.length} ticket(s)?`)) return;

        try {
            await Promise.all(selectedTickets.map(id => deleteTicket(id)));

            setTickets(prev => prev.filter(t => !selectedTickets.includes(t.id)));
            setTotalTickets(prev => prev - selectedTickets.length);
            setSelectedTickets([]);
        } catch (error) {
            console.error(error);
            alert("Error al eliminar algunos tickets");
        }
    }

    async function handleAddUser(username, email, password, role) {
        try {
            const createdUser = await createUserByAdmin(username, email, password, role);
            setUsers(prev => [...prev, createdUser]);
            setTotalUsers(prev => prev + 1);
            return true;
        } catch (error) {
            console.error(error);
            alert(error.message);
            return false;
        }
    }

    function setRowAction(userId, field, value) {
        setRowActions(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    }

    async function handleExecuteAction(user) {
        const action = rowActions[user.id]?.action;
        if (!action) return;

        try {
            if (action === "delete") {
                if (!window.confirm(`¿Delete to ${user.username}?`)) return;
                if (user.role === "ADMIN") {
                    alert("Cannot delete an ADMIN user.");
                    return;
                }
                await deleteUser(user.id);
                setUsers(prev => prev.filter(u => u.id !== user.id));
                setTotalUsers(prev => prev - 1);
            }

            if (action === "changeRole") {
                const newRole = rowActions[user.id]?.newRole;
                if (!newRole) return alert("Select a role to change.");

                await updateUserRole(user.email, newRole);
                setUsers(prev =>
                    prev.map(u => u.id === user.id ? { ...u, role: newRole } : u)
                );
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const data = await getTicketAudit();
                setRecentActivity(data.slice(0, 10));
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecentActivity();
    }, []);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/users`, {
                    headers: {
                        "Authorization": localStorage.getItem("authHeader")
                    }
                });

                if (!res.ok) throw new Error("Error al obtener los datos");

                const data = await res.json();
                setTotalUsers(data.length);
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTotalUsers();
    }, []);

    return (
        <DashboardLayout navItems={NAV_ITEMS} title="Welcome back, Admin 👋" profileName="Admin">
            <DashboardOverview totalUsers={totalUsers} stats={stats} />

            <UsersSection
                users={users}
                onAddUser={handleAddUser}
                rowActions={rowActions}
                onRowActionChange={setRowAction}
                onExecute={handleExecuteAction}
            />

            <TicketsSection
                onCreateTicket={addTicket}
                onDeleteSelected={handleDeleteSelected}
                filters={filters}
                table={{ tickets, isEmpty: filteredTickets.length === 0, selection, stateActions }}
                footer="summary"
            />

            <TicketReports>
                <TicketStatusChart {...stats} />
                <RecentActivity entries={recentActivity} />
            </TicketReports>
        </DashboardLayout>
    );
}

export default AdminDashboard;
