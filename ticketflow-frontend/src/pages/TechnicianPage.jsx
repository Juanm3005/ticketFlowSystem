import { useEffect, useState } from "react";
import "./TechnicianPage.css";
import { useNavigate } from "react-router-dom";
import {changeTicketState, createTicket, } from "../services/api";
import { PieChart, Pie, Tooltip, Cell } from "recharts";


function TechnicianDashboard() {

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("dashboard");
    const [totalTickets, setTotalTickets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openTickets, setOpenTickets] = useState(null);
    const [inProgressTickets, setInProgressTickets] = useState(null);
    const [resolvedTickets, setResolvedTickets] = useState(null);
    const [closedTickets, setClosedTickets] = useState(null);
    const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState("");
    const [newTicketDescription, setNewTicketDescription] = useState("");
    const [tickets, setTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [ticketSearchTerm, setTicketSearchTerm] = useState("");
    const [ticketStateSelections, setTicketStateSelections] = useState({});
    const [statusFilter, setStatusFilter] = useState("ALL");

    

    const ticketStatusData = [
        { name: "Open", value: openTickets || 0, color: "#3B82F6" },
        { name: "In Progress", value: inProgressTickets || 0, color: "#F59E0B" },
        { name: "Resolved", value: resolvedTickets || 0, color: "#F97316" },
        { name: "Closed", value: closedTickets || 0, color: "#22C55E" },
    ];

    

    const filteredTickets = tickets.filter(ticket => {
    const matchesSubject = ticket.title.toLowerCase().includes(ticketSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || ticket.state === statusFilter;
    return matchesSubject && matchesStatus;
});

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

    function handleLogout() {
        localStorage.removeItem("authHeader");
        navigate("/login");
    }


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

    useEffect(() => {
    const container = document.querySelector(".dashboard-content");

    if (!container) return;

    const sections = [
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

        <div className="technician-layout">
            <aside className="technician-sidebar">
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

            <main className="technician-main">
                {/*HEADER*/}
                <header className="technician-header">
                    <div>

                        <h1>
                            Welcome back, Technician 👋
                        </h1>

                        <p>
                            Here's what's happening with your system today.
                        </p>

                    </div>


                    <div className="header-actions">

                   


                        <div className="technician-profile">

                            <div className="profile-info">

                                <strong>
                                    Technician
                                </strong>


                            </div>


                        </div>

                    </div>

                </header>



                <div className="dashboard-content">
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

                                <table className="technician-table ticket-table">

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


                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default TechnicianDashboard;