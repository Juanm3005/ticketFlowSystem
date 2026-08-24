const API_URL = 'http://localhost:8080';

export function getAuthHeader(email, password) {
    return 'Basic ' + btoa(`${email}:${password}`);
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/tickets`, {
        headers: {
            Authorization: getAuthHeader(email, password),
        },
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return true;
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