import { browser } from '$app/environment';

export function getUser() {
    if (!browser) return null;

    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
        const user = JSON.parse(raw);
        return user;
    } catch (error) {
        console.error("Error parsing user localStorage:", error);
        return null;
    }
}
