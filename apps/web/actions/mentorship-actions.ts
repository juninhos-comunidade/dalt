"use server";

const API_URL = process.env.API_URL || "http://localhost:3001";

export async function requestMentorshipAction(novatoId: string, padrinhoId: string, objetivo: string) {
    try {
        const response = await fetch(`${API_URL}/mentorship/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novatoId, padrinhoId, objetivo }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to request mentorship");
        return { success: true, request: data.data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function respondToRequestAction(requestId: string, decision: "aceito" | "recusado") {
    try {
        const response = await fetch(`${API_URL}/mentorship/respond`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, decision }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to respond to request");
        return { success: true, request: data.data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
