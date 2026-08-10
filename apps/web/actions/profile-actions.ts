"use server";

const API_URL = process.env.API_URL || "http://localhost:3001";

export async function createProfileAction(fullName: string, role: "novato" | "padrinho") {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create profile");
        return { success: true, profile: data.data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
