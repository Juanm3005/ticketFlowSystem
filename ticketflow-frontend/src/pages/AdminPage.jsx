import { useEffect, useState } from "react";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";
import { deleteUser, updateUserRole, createUserByAdmin, changeTicketState, createTicket, deleteTicket, getTicketAudit } from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


function AdminDashboard() {

    const navigate = useNavigate();
    const [rowActions, setRowActions] = useState({});
    const [users, setUsers] = useState([]);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openTickets, setOpenTickets] = useState(null);
    const [inProgressTickets, setInProgressTickets] = useState(null);
    const [resolvedTickets, setResolvedTickets] = useState(null);
    const [closedTickets, setClosedTickets] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("TECHNICIAN");
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState("");
    const [newTicketDescription, setNewTicketDescription] = useState("");
    const [tickets, setTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [ticketSearchTerm, setTicketSearchTerm] = useState("");
    const [ticketStateSelections, setTicketStateSelections] = useState({});
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [recentActivity, setRecentActivity] = useState([]);

    const ticketStatusData = [
        { name: "Open", value: openTickets || 0, color: "#3B82F6" },
        { name: "In Progress", value: inProgressTickets || 0, color: "#F59E0B" },
        { name: "Resolved", value: resolvedTickets || 0, color: "#F97316" },
        { name: "Closed", value: closedTickets || 0, color: "#22C55E" },
    ];

    function handleClearTicketFilters() {
        setTicketSearchTerm("");
        setStatusFilter("ALL");
    }

    function setTicketStateSelection(ticketId, value) {
        setTicketStateSelections(prev => ({
            ...prev,
            [ticketId]: value
        }));
    }

    async function handleExecuteStateChange(ticket) {
        const newState = ticketStateSelections[ticket.id];
        if (!newState) return alert("Select a new state to change.");

        try {
            await changeTicketState(ticket.id, newState);

            setTickets(prev => {
                const updated = prev.map(t => t.id === ticket.id ? { ...t, state: newState } : t);
                setOpenTickets(updated.filter(t => t.state === "OPEN").length);
                setInProgressTickets(updated.filter(t => t.state === "IN_PROGRESS").length);
                setResolvedTickets(updated.filter(t => t.state === "RESOLVED").length);
                setClosedTickets(updated.filter(t => t.state === "CLOSED").length);
                return updated;
            });
        } catch (error) {
            console.error(error);
            alert("no have permission to change the state of this ticket1");
        }
    }

    async function handleChangeTicketState(id, newState) {
        try {
            await changeTicketState(id, newState);
            setTickets(prev =>
                prev.map(t => t.id === id ? { ...t, state: newState } : t)
            );
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSubject = ticket.title.toLowerCase().includes(ticketSearchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || ticket.state === statusFilter;
        return matchesSubject && matchesStatus;
    });

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

    async function handleCreateTicket(e) {
        e.preventDefault();
        try {
            const createdTicket = await createTicket({
                title: newTicketTitle,
                description: newTicketDescription,
                status: "OPEN" 
            });

            setTotalTickets(prev => prev + 1);
            setOpenTickets(prev => prev + 1);
            setShowCreateTicketForm(false);
            setNewTicketTitle("");
            setNewTicketDescription("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function handleClearFilters() {
        setSearchTerm("");
        setRoleFilter("ALL");
    }

    function handleLogout() {
        localStorage.removeItem("authHeader");
        navigate("/login");
    }

    async function handleAddUser(e) {
        e.preventDefault();
        try {
            const createdUser = await createUserByAdmin(newUsername, newEmail, newPassword, newRole);
            setUsers(prev => [...prev, createdUser]);
            setTotalUsers(prev => prev + 1);
            setShowAddForm(false);
            setNewUsername(""); setNewEmail(""); setNewPassword(""); setNewRole("TECHNICIAN");
        } catch (error) {
            console.error(error);
            alert(error.message);
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

    const filteredUsers = users.filter(user => {
        const matchesUsername = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesUsername && matchesRole;
    });

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
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/users", {
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
            } finally {
                setLoading(false);
            }
        };

        fetchTotalUsers();
    }
        , []);


    // Trae el total de tickets
    useEffect(() => {
        const fetchTotalTickets = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/tickets", {
                    headers: {
                        "Authorization": localStorage.getItem("authHeader")
                    }
                });

                if (!res.ok) throw new Error("Error to obtain data");

                const data = await res.json();
                setTotalTickets(data.length);
                const openTickets = data.filter(ticket => ticket.state === "OPEN");
                setOpenTickets(openTickets.length);//para tickets abiertos
                const inProgressTickets = data.filter(ticket => ticket.state === "IN_PROGRESS");
                const resolvedTickets = data.filter(ticket => ticket.state === "RESOLVED");
                setResolvedTickets(resolvedTickets.length);
                setInProgressTickets(inProgressTickets.length);//para tickets en progreso
                const closedTickets = data.filter(ticket => ticket.state === "CLOSED");
                setClosedTickets(closedTickets.length);//para tickets cerrados
                setTickets(data); // Guarda todos los tickets en el estado

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalTickets();
    }
        , []);

    /*
     * Detecta automáticamente qué sección está visible
     * mientras el usuario hace scroll.
     */
    useEffect(() => {
    const container = document.querySelector(".dashboard-content");

    if (!container) return;

    const sections = [
        "dashboard",
        "users",
        "tickets",
        "reports"
    ];

    function handleScroll() {
        const scrollTop = container.scrollTop;

        let currentSection = "dashboard";

        sections.forEach((id) => {
            const section = document.getElementById(id);

            if (!section) return;

            const sectionTop = section.offsetTop;

            if (scrollTop >= sectionTop - 150) {
                currentSection = id;
            }
        });

        setActiveSection(currentSection);
    }

    container.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
        container.removeEventListener("scroll", handleScroll);
    };
}, []);
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
    return (

        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        TF
                    </div>

                    <span>
                        Ticket<span>Flow</span>
                    </span>
                </div>


                <nav className="sidebar-navigation">
                    <button
                        className={
                            activeSection === "dashboard"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        } onClick={() => scrollToSection("dashboard")}>
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button
                        className={
                            activeSection === "users"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        } onClick={() => scrollToSection("users")}>
                        <span className="sidebar-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                    fill="currentColor"
                                    d="M6.4 20q-1 0-1.7-.7T4 17.6v-1.175q0-.95.688-1.763q.687-.812 1.812-1.4q1.125-.587 2.538-.925Q10.45 12 11.9 12q1.45 0 2.9.337q1.45.338 2.6.938q1.15.6 1.875 1.413Q20 15.5 20 16.45v1.15q0 1-.7 1.7t-1.7.7Zm0-2h11.2q.15 0 .275-.125Q18 17.75 18 17.6v-1.175q0-.625-1.788-1.525q-1.787-.9-4.312-.9q-2.575 0-4.237.9Q6 15.8 6 16.45v1.15q0 .15.125.275Q6.25 18 6.4 18Zm5.5-7q-1.45 0-2.475-1.025Q8.4 8.95 8.4 7.5q0-1.45 1.025-2.475Q10.45 4 11.9 4q1.475 0 2.487 1.025Q15.4 6.05 15.4 7.5q0 1.45-1.025 2.475Q13.35 11 11.9 11Zm0-2q.625 0 1.063-.438q.437-.437.437-1.062t-.437-1.062Q12.525 6 11.9 6t-1.062.438Q10.4 6.875 10.4 7.5t.438 1.062Q11.275 9 11.9 9Zm0-1.5ZM12 14Z" />
                            </svg>
                        </span>
                        Users
                    </button>

                    <button
                        className={
                            activeSection === "tickets"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() => scrollToSection("tickets")}
                    >
                        <span>▣</span>
                        Tickets
                    </button>


                    <button
                        className={
                            activeSection === "reports"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() => scrollToSection("reports")}
                    >
                        <span>▥</span>
                        Reports
                    </button>

                </nav>


                <button className="logout-button" onClick={handleLogout}>
                    <span>↪</span>
                    Logout
                </button>

            </aside>



            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="admin-main">
                {/*HEADER*/}
                <header className="admin-header">
                    <div>

                        <h1>
                            Welcome back, Admin 👋
                        </h1>

                        <p>
                            Here's what's happening with your system today.
                        </p>

                    </div>


                    <div className="header-actions">

                   


                        <div className="admin-profile">

                            <div className="profile-info">

                                <strong>
                                    Admin
                                </strong>


                            </div>


                        </div>

                    </div>

                </header>



                <div className="dashboard-content">

                    <section
                        id="dashboard"
                        className="dashboard-section"
                    >

                        <div className="section-title">

                            <h2>
                                Dashboard
                            </h2>

                            <p>
                                Overview of your TicketFlow system.
                            </p>

                        </div>

                        <div className="stats-grid">


                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                        <path
                                            fill="currentColor"
                                            d="M6.4 20q-1 0-1.7-.7T4 17.6v-1.175q0-.95.688-1.763q.687-.812 1.812-1.4q1.125-.587 2.538-.925Q10.45 12 11.9 12q1.45 0 2.9.337q1.45.338 2.6.938q1.15.6 1.875 1.413Q20 15.5 20 16.45v1.15q0 1-.7 1.7t-1.7.7Zm0-2h11.2q.15 0 .275-.125Q18 17.75 18 17.6v-1.175q0-.625-1.788-1.525q-1.787-.9-4.312-.9q-2.575 0-4.237.9Q6 15.8 6 16.45v1.15q0 .15.125.275Q6.25 18 6.4 18Zm5.5-7q-1.45 0-2.475-1.025Q8.4 8.95 8.4 7.5q0-1.45 1.025-2.475Q10.45 4 11.9 4q1.475 0 2.487 1.025Q15.4 6.05 15.4 7.5q0 1.45-1.025 2.475Q13.35 11 11.9 11Zm0-2q.625 0 1.063-.438q.437-.437.437-1.062t-.437-1.062Q12.525 6 11.9 6t-1.062.438Q10.4 6.875 10.4 7.5t.438 1.062Q11.275 9 11.9 9Zm0-1.5ZM12 14Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p>Total Users</p>
                                    <h2>{totalUsers !== null ? totalUsers : "Loading..."}</h2>

                                </div>
                            </div>
                            <div className="stat-card">

                                <div className="stat-icon green">
                                    ▣
                                </div>
                                <div>
                                    <p> Total Tickets</p>
                                    <h2>{totalTickets !== null ? totalTickets : "Loading..."}</h2>
                                </div>

                            </div>



                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    □
                                </div>

                                <div>

                                    <p>
                                        Open Tickets
                                    </p>

                                    <h2>
                                        {openTickets !== null ? openTickets : "Loading..."}
                                    </h2>

                                    <small>
                                        {/* CAMBIO */}
                                    </small>

                                </div>

                            </div>



                            <div className="stat-card">

                                <div className="stat-icon cyan">
                                    ↻
                                </div>

                                <div>

                                    <p>
                                        In Progress
                                    </p>

                                    <h2>
                                        {inProgressTickets !== null ? inProgressTickets : "Loading..."}
                                    </h2>

                                    <small>
                                        {/* CAMBIO */}
                                    </small>

                                </div>

                            </div>



                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    ✓
                                </div>

                                <div>

                                    <p>
                                        Closed Tickets
                                    </p>

                                    <h2>
                                        {closedTickets !== null ? closedTickets : "Loading..."}
                                    </h2>

                                    <small>
                                        {/* CAMBIO */}
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* ================================
                            EMPTY DASHBOARD AREA
                        ================================= */}

                        <div className="empty-dashboard-area">

                            <span>
                                Dashboard content
                            </span>


                        </div>

                    </section>



                    {/* ==================================================
                        USERS
                    ================================================== */}

                    <section
                        id="users"
                        className="dashboard-section"
                    >

                        <div className="dashboard-card">


                            <div className="card-header">

                                <div>

                                    <h2>
                                        Users
                                    </h2>

                                    <p>
                                        Manage system users and their roles.
                                    </p>

                                </div>


                                <button
                                    className="primary-button"
                                    onClick={() => setShowAddForm(true)}
                                >
                                    + Add User
                                </button>


                            </div>

                            {showAddForm && (
                                <div className="modal-overlay">

                                    <div className="add-user-modal">

                                        <div className="modal-header">

                                            <div>
                                                <h2>Add User</h2>

                                                <p>
                                                    Create a new user for the TicketFlow system.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="modal-close"
                                                onClick={() => setShowAddForm(false)}
                                            >
                                                ×
                                            </button>

                                        </div>


                                        <form
                                            className="add-user-form"
                                            onSubmit={handleAddUser}
                                        >

                                            <div className="form-group">

                                                <label>
                                                    Username
                                                </label>

                                                <input
                                                    type="text"
                                                    placeholder="Enter username"
                                                    value={newUsername}
                                                    onChange={(e) =>
                                                        setNewUsername(e.target.value)
                                                    }
                                                    required
                                                />

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Email
                                                </label>

                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={newEmail}
                                                    onChange={(e) =>
                                                        setNewEmail(e.target.value)
                                                    }
                                                    required
                                                />

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Password
                                                </label>

                                                <input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(e.target.value)
                                                    }
                                                    required
                                                />

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Role
                                                </label>

                                                <select
                                                    value={newRole}
                                                    onChange={(e) =>
                                                        setNewRole(e.target.value)
                                                    }
                                                >

                                                    <option value="TECHNICIAN">
                                                        TECHNICIAN
                                                    </option>

                                                    <option value="EMPLOYEE">
                                                        EMPLOYEE
                                                    </option>

                                                </select>

                                            </div>


                                            <div className="modal-actions">

                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    onClick={() => setShowAddForm(false)}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="create-button"
                                                >
                                                    Create User
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                </div>
                            )}


                            {/* FILTERS */}

                            <div className="filters">

                                <div className="search-box">
                                    <span>⌕</span>

                                    <input
                                        type="text"
                                        placeholder="Search users by username"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>


                                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                    <option value="ALL">All Roles</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="TECHNICIAN">TECHNICIAN</option>
                                    <option value="EMPLOYEE">EMPLOYEE</option>
                                </select>


                                <button className="filter-button" onClick={handleClearFilters}>
                                    ↻ Clear Filters
                                </button>

                            </div>



                            {/* TABLE */}

                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="empty-table">
                                                        No users to display
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>

                                                    <td className="user-actions">
                                                        <select className="action-select"
                                                            value={rowActions[user.id]?.action || ""}
                                                            onChange={(e) => setRowAction(user.id, "action", e.target.value)}
                                                        >
                                                            <option value="">Select action</option>
                                                            <option value="delete">Delete</option>
                                                            <option value="changeRole">Change role</option>
                                                        </select>

                                                        {rowActions[user.id]?.action === "changeRole" && (
                                                            <select className="action-select"
                                                                value={rowActions[user.id]?.newRole || ""}
                                                                onChange={(e) => setRowAction(user.id, "newRole", e.target.value)}
                                                            >
                                                                <option value="">Select role</option>
                                                                <option value="TECHNICIAN">TECHNICIAN</option>
                                                                <option value="EMPLOYEE">EMPLOYEE</option>
                                                            </select>
                                                        )}

                                                        <button className="execute-button" onClick={() => handleExecuteAction(user)}>
                                                            Execute
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                </table>

                            </div>


                            <div className="table-footer">

                                <span>
                                    {/* PAGINACIÓN */}
                                </span>


                                <div className="pagination">

                                    <button>
                                        ‹
                                    </button>

                                    <button className="selected">
                                        1
                                    </button>

                                    <button>
                                        ›
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>



                    {/*TICKETS*/}

                    <section
                        id="tickets"
                        className="dashboard-section"
                    >

                        <div className="dashboard-card">

                            <div className="card-header">

                                <div>
                                    <h2>Tickets</h2>

                                    <p>
                                        Manage and track all support tickets.
                                    </p>
                                </div>
                                {showCreateTicketForm && (
                                    <div className="modal-overlay">

                                        <div className="create-ticket-modal">

                                            {/* HEADER */}
                                            <div className="modal-header">

                                                <div>
                                                    <h2>Create Ticket</h2>

                                                    <p>
                                                        Create a new support ticket.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="modal-close"
                                                    onClick={() => setShowCreateTicketForm(false)}
                                                >
                                                    ×
                                                </button>

                                            </div>


                                            {/* FORM */}
                                            <form
                                                className="create-ticket-form"
                                                onSubmit={handleCreateTicket}
                                            >

                                                {/* TITLE */}
                                                <div className="form-group">

                                                    <label>
                                                        Title
                                                    </label>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter ticket title"
                                                        value={newTicketTitle}
                                                        onChange={(e) =>
                                                            setNewTicketTitle(e.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>


                                                {/* DESCRIPTION */}
                                                <div className="form-group">

                                                    <label>
                                                        Description
                                                    </label>

                                                    <textarea
                                                        placeholder="Describe the problem or request..."
                                                        value={newTicketDescription}
                                                        onChange={(e) =>
                                                            setNewTicketDescription(e.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>


                                                {/* BUTTONS */}
                                                <div className="modal-actions">

                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        onClick={() =>
                                                            setShowCreateTicketForm(false)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="create-button"
                                                    >
                                                        Create Ticket
                                                    </button>

                                                </div>

                                            </form>

                                        </div>

                                    </div>
                                )}
                                <div className="ticket-header-actions">

                                    <button className="create-ticket-button" onClick={() => setShowCreateTicketForm(true)}>
                                        + Create Ticket
                                    </button>
                                    <button className="delete-selected" onClick={handleDeleteSelected}>
                                        ♲ Delete Selected
                                    </button>
                                </div>
                            </div>

                            {/* FILTERS */}

                            <div className="filters">

                                <div className="search-box">

                                    <span>⌕</span>

                                    <input
                                        type="text"
                                        placeholder="Search tickets by subject"
                                        value={ticketSearchTerm}
                                        onChange={(e) => setTicketSearchTerm(e.target.value)}
                                    />

                                </div>


                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="ALL">All Statuses</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>

                                <button className="filter-button" onClick={handleClearTicketFilters}>
                                    ↻ Clear Filters
                                </button>

                            </div>


                            {/* TABLE */}

                            <div className="table-wrapper">

                                <table className="admin-table ticket-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={tickets.length > 0 && selectedTickets.length === tickets.length}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            <th>ID</th>
                                            <th>Subject</th>
                                            <th>Created By</th>
                                            <th>Status</th>
                                            <th>Assigned To</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredTickets.length === 0 ? (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="empty-table">
                                                        No tickets to display
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            tickets.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTickets.includes(ticket.id)}
                                                            onChange={() => toggleTicketSelection(ticket.id)}
                                                        />
                                                    </td>
                                                    <td>{ticket.id}</td>
                                                    <td>{ticket.title}</td>
                                                    <td>{ticket.createdBy.username}</td>
                                                    <td>{ticket.state}</td>
                                                    <td>{ticket.assignedTo?.username || "Unassigned"}</td>
                                                    <td>
                                                        <select
                                                            value={ticketStateSelections[ticket.id] || ticket.state}
                                                            onChange={(e) => setTicketStateSelection(ticket.id, e.target.value)}
                                                            className="action-select"
                                                        >
                                                            <option value="OPEN">OPEN</option>
                                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                            <option value="RESOLVED">RESOLVED</option>
                                                            <option value="CLOSED">CLOSED</option>
                                                        </select>

                                                        <button onClick={() => handleExecuteStateChange(ticket)} className="execute-button">
                                                            Execute
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                </table>

                            </div>


                            <div className="table-footer">

                                <span>
                                    {/* PAGINACIÓN */}
                                </span>


                                <div className="pagination">

                                    <button>
                                        ‹
                                    </button>

                                    <button className="selected">
                                        1
                                    </button>

                                    <button>
                                        ›
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>



                    {/* REPORTS*/}

                    <section
                        id="reports"
                        className="dashboard-section"
                    >

                        <div className="section-title">

                            <h2>
                                Reports
                            </h2>

                            <p>
                                System reports and statistics.
                            </p>

                        </div>


                        <div className="reports-grid">


                            <div className="side-card report-card">

                                <h2>
                                    Tickets by Status
                                </h2>

                                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>

                                    <div style={{ position: "relative", width: 200, height: 200 }}>
                                        <PieChart width={200} height={200}>
                                            <Pie
                                                data={ticketStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                            >
                                                {ticketStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>

                                        <div style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                                {totalTickets || 0}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                                Total
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {ticketStatusData.map((entry) => (
                                            <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    backgroundColor: entry.color,
                                                    display: "inline-block"
                                                }} />
                                                <span>
                                                    {entry.name}: {entry.value} ({totalTickets > 0 ? ((entry.value / totalTickets) * 100).toFixed(1) : 0}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                            </div>

                            <div className="side-card report-card">

                                <h2>
                                    Recent Activity
                                </h2>

                                <div className="empty-activity">
                                    {recentActivity.map((entry, index) => (
                                        <div
                                            key={entry.ID}
                                            style={{
                                                padding: "12px 4px",
                                                borderBottom: index < recentActivity.length - 1 ? "1px solid #e5e7eb" : "none"
                                            }}
                                        >
                                            <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>
                                                Ticket #{entry.TICKET_ID}: {entry.OLD_STATE || "N/A"} → {entry.NEW_STATE}
                                            </p>
                                            <small style={{ fontSize: "13px", color: "#6b7280" }}>
                                                {entry.CHANGED_BY} — {new Date(entry.CHANGED_AT).toLocaleString()}
                                            </small>
                                        </div>
                                    ))}
                                </div>

                            </div>


                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;