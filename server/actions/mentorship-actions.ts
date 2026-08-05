"use server";

import { createMentorshipService } from "../services/mentorship-services";
import { inMemoryMentorshipRepository } from "../repositories/in-memory-mentorship-repository";

const mentorshipService = createMentorshipService(inMemoryMentorshipRepository);

export async function requestMentorshipAction(novatoId: string, padrinhoId: string, objetivo: string) {
    try {
        const request = await mentorshipService.requestMentorship(novatoId, padrinhoId, objetivo);
        return { success: true, request };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function respondToRequestAction(requestId: string, decision: "aceito" | "recusado") {
    try {
        const request = await mentorshipService.respondToRequest(requestId, decision);
        return { success: true, request };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
