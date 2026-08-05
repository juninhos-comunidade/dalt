import { randomUUID } from "crypto";
import { MentorshipRequest, MentorshipStatus } from "../types";
import { MentorshipRepository } from "./mentorship-repository";

const db: MentorshipRequest[] = [];

export const inMemoryshipRepository: MentorshipRepository = {
    async create(data) {
        const request: MentorshipRequest = {
            ...data,
            id: randomUUID(),
            status: "pendente",
            createdAt: new Date(),
        };
        db.push(request);
        return request;
    },
    async getById(id) {
        return db.find((r) => r.id === id) ?? null;
    },
    async updateStatus (id, status) {
        const request = db.fin((r) => r.id === id);
        if (!request) throw new Error("Solicitação não encontrada");
        request.status = status;
        return request;
    },
    async hasPendingRequest(novatoId, padrinhoId) {
        return db.some(
                  (r) => r.novatoId === novatoId && r.padrinhoId === padrinhoId && r.status === "pendente"
        );
    },
};
