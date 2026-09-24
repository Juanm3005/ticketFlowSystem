const API_URL = 'import.meta.env.VITE_API_URL';

export async function getCurrentUser() {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: {
            Authorization: localStorage.getItem("authHeader"),
        },
    });

    if (!response.ok) {
        throw new Error("Session expired");
    }

    return response.json();
}



export async function createTicket(ticketData) {
    const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authHeader"),
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) throw new Error("Error al crear ticket");
    return response.json();
}

export async function updateUserRole(email, role) {
    const response = await fetch(`${API_URL}/users/${email}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authHeader"),
        },
        body: JSON.stringify(role), 
    });

    if (!response.ok) throw new Error("Error to update user role");
    return response.json();
}

export async function createUserByAdmin(username, email, password, role) {
    const response = await fetch(`${API_URL}/users/admin-create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authHeader"),
        },
        body: JSON.stringify({ username, email, password, role }),
    });

    if (!response.ok) throw new Error("Error to create user by admin");
    return response.json();
}


export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("authHeader"),
        },
    });

    if (!response.ok) throw new Error("Error to delete user");
}

export async function deleteTicket(id) {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("authHeader"),
        },
    });
}

export async function changeTicketState(id, newState) {
    const response = await fetch(`${API_URL}/tickets/${id}/state`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authHeader"),
        },
        body: JSON.stringify(newState),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error changing ticket state");
    }

    return response.json();
}

async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
        const user = await login(email, password);

        // Guarda el header Basic para reutilizarlo en otras peticiones
        const authHeader = getAuthHeader(email, password);
        localStorage.setItem("authHeader", authHeader);

        onLoginSuccess(user);

        if (user.role === 'ADMIN') navigate('/admin');
        else if (user.role === 'TECHNICIAN') navigate('/technician');
        else navigate('/employee');
    } catch {
        setError('Invalid email or password. Please try again.');
    }
}

export async function getTicketAudit() {
    const response = await fetch(`${API_URL}/ticket-audit`, {
        headers: {
            Authorization: localStorage.getItem("authHeader"),
        },
    });

    if (!response.ok) throw new Error("Error al obtener actividad reciente");
    return response.json();
}

export function getAuthHeader(email, password) {
    return 'Basic ' + btoa(`${email}:${password}`);
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: {
            Authorization: getAuthHeader(email, password),
        },
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return response.json();
}

export async function register(username, email, password) {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        throw new Error('Not able to register user');
    }

    return response.json();
}